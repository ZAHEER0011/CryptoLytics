import express from "express";
import axios from "axios";
import cors from "cors";
import NodeCache from "node-cache";

const app = express();
const PORT = process.env.PORT || 5000;
axios.defaults.timeout = 10000;
axios.defaults.headers.common['Accept'] = 'application/json';

// Cache: 60 seconds TTL
const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes

app.use(cors());

const BASE_URL = "https://api.coingecko.com/api/v3";

/**
 * Helper: fetch with cache
 */
async function fetchWithCache(key, url, params) {
  const cached = cache.get(key);
  if (cached) {
    return cached;
  }

  const response = await axios.get(url, { params });
  cache.set(key, response.data);
  return response.data;
}

/**
 * Global Market Data
 */
app.get("/api/global", async (req, res) => {
  try {
    const data = await fetchWithCache(
      "global",
      `${BASE_URL}/global`,
      {}
    );
    res.json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch global market data" });
  }
});

/**
 * Coins Market Data (paginated)
 */
app.get("/api/coins/markets", async (req, res) => {
  try {
    const {
      vs_currency = "inr",
      per_page = 10,
      page = 1,
    } = req.query;

    const cacheKey = `markets_${vs_currency}_${per_page}_${page}`;

    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const response = await axios.get(
      `${BASE_URL}/coins/markets`,
      {
        params: {
          vs_currency,
          order: "market_cap_desc",
          per_page,
          page,
          sparkline: false,
          price_change_percentage: "24h,7d",
        },
        timeout: 8000, // IMPORTANT
      }
    );

    // CoinGecko sometimes returns non-array garbage
    if (!Array.isArray(response.data)) {
      console.error("Invalid CoinGecko response");
      return res.json([]);
    }

    cache.set(cacheKey, response.data);
    res.json(response.data);
  } catch (err) {
    console.error("Market fetch failed:", err.message);

    // 🔑 NEVER return 500 for pagination
    res.json([]);
  }
});

app.get("/api/coins/:id", async (req, res) => {
  try {
    const { id } = req.params;

    async function fetchWithCache(key, url, params, retries = 3) {
      // return cache immediately if exists
      const cached = cache.get(key);
      if (cached) {
        return cached;
      }

      try {
        const response = await axios.get(url, {
          params,
          timeout: 10000,
        });

        cache.set(key, response.data);
        return response.data;

      } catch (err) {

        const status = err.response?.status;

        console.error(`Fetch failed (${status}): ${url}`);

        // if rate limited, retry with delay
        if ((status === 429 || err.code === "ECONNRESET") && retries > 0) {
          console.log("Retrying after delay...");

          await new Promise(res => setTimeout(res, 1500));

          return fetchWithCache(key, url, params, retries - 1);
        }

        // fallback to stale cache if exists
        if (cached) {
          console.log("Using stale cache fallback");
          return cached;
        }

        throw err;
      }
    }

    res.json(data);
  } catch (err) {
    console.error(err.message);
    res.json(cache.get(`coin_${id}`) || {});
  }
});

app.get("/api/coins/:id/chart", async (req, res) => {
  const { id } = req.params;
  const { days = 7 } = req.query;

  const cacheKey = `chart_${id}_${days}`;

  try {
    const data = await fetchWithCache(
      cacheKey,
      `${BASE_URL}/coins/${id}/market_chart`,
      {
        vs_currency: "inr",
        days,
      }
    );

    res.json(data);

  } catch (err) {

    console.error("Chart fetch failed:", err.message);

    const cached = cache.get(cacheKey);

    res.json(cached || { prices: [] });
  }
});


app.listen(PORT, () => {
  console.log(`Backend proxy running on port ${PORT}`);
});
