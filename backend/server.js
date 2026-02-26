import express from "express";
import axios from "axios";
import cors from "cors";
import NodeCache from "node-cache";

const app = express();
const PORT = process.env.PORT || 5000;

// Cache: 60 seconds TTL
const cache = new NodeCache({ stdTTL: 60 });

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

    const data = await fetchWithCache(
      `coin_${id}`,
      `${BASE_URL}/coins/${id}`,
      {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
      }
    );

    res.json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch coin details" });
  }
});

app.get("/api/coins/:id/chart", async (req, res) => {
  try {
    const { id } = req.params;
    const { days = 7 } = req.query;

    const cacheKey = `chart_${id}_${days}`;

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
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch chart data" });
  }
});


app.listen(PORT, () => {
  console.log(`Backend proxy running on port ${PORT}`);
});
