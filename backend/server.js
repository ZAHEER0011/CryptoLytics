import express from "express";
import axios from "axios";
import cors from "cors";
import NodeCache from "node-cache";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

axios.defaults.timeout = 10000;
axios.defaults.headers.common["Accept"] = "application/json";

const cache = new NodeCache({ stdTTL: 300 });

const VITE_API_KEY=process.env.VITE_API_KEY;
const BASE_URL = `https://api.coingecko.com/api/v3/ping?x_cg_demo_api_key=${VITE_API_KEY}`;
console.log(BASE_URL)


// SAFE FETCH WITH RETRY
async function fetchWithCache(key, url, params, retries = 3) {

  const cached = cache.get(key);
  if (cached) return cached;

  try {

    const response = await axios.get(url, { params });

    cache.set(key, response.data);

    return response.data;

  } catch (err) {

    const status = err.response?.status;

    console.log("Fetch error:", status, url);

    if ((status === 429 || err.code === "ECONNRESET") && retries > 0) {

      await new Promise(r => setTimeout(r, 1500));

      return fetchWithCache(key, url, params, retries - 1);

    }

    if (cached) return cached;

    throw err;
  }
}



// GLOBAL
app.get("/api/global", async (req, res) => {

  try {

    const data = await fetchWithCache(
      "global",
      `${BASE_URL}/global`,
      {}
    );

    res.json(data);

  } catch {

    res.json({});
  }

});



// MARKETS
app.get("/api/coins/markets", async (req, res) => {

  try {

    const {
      vs_currency = "inr",
      per_page = 10,
      page = 1,
    } = req.query;

    const key = `markets_${vs_currency}_${per_page}_${page}`;

    const data = await fetchWithCache(
      key,
      `${BASE_URL}/coins/markets`,
      {
        vs_currency,
        order: "market_cap_desc",
        per_page,
        page,
        sparkline: false,
      }
    );

    res.json(Array.isArray(data) ? data : []);

  } catch {

    res.json([]);
  }

});



// COIN DETAILS  ✅ FIXED
app.get("/api/coins/:id", async (req, res) => {

  try {

    const { id } = req.params;

    const key = `coin_${id}`;

    const data = await fetchWithCache(
      key,
      `${BASE_URL}/coins/${id}`,
      {
        localization: false,
        tickers: false,
        market_data: true,
      }
    );

    res.json(data || {});

  } catch {

    res.json({});
  }

});



// CHART ✅ FIXED
app.get("/api/coins/:id/chart", async (req, res) => {

  try {

    const { id } = req.params;
    const { days = 7 } = req.query;

    const key = `chart_${id}_${days}`;

    const data = await fetchWithCache(
      key,
      `${BASE_URL}/coins/${id}/market_chart`,
      {
        vs_currency: "inr",
        days,
      }
    );

    res.json(data || { prices: [] });

  } catch {

    res.json({ prices: [] });
  }

});



app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});