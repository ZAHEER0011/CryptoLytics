// import axios from "axios";

// const BASE_URL = "https://api.coingecko.com/api/v3";

// // Fetch top market coins
// // export const getMarketData = async (currency = "usd", perPage = 100) => {
// //   try {
// //     const response = await axios.get(`${BASE_URL}/coins/markets`, {
// //       params: {
// //         vs_currency: currency,
// //         order: "market_cap_desc",
// //         per_page: perPage,
// //         page: 1,
// //         sparkline: false,
// //       },
// //     });
// //     return response.data;
// //   } catch (error) {
// //     console.error("Error fetching market data:", error);
// //     return [];
// //   }
// // };
// export const getMarketData = async (
//   currency = "usd",
//   perPage = 10,
//   page = 1
// ) => {
//   try {
//     const response = await axios.get(`${BASE_URL}/coins/markets`, {
//       params: {
//         vs_currency: currency,
//         order: "market_cap_desc",
//         per_page: perPage,
//         page: page, // ✅ FIXED
//         sparkline: false,
//         price_change_percentage: "24h,7d",
//       },
//     });

//     return response.data;
//   } catch (error) {
//     console.error("Error fetching market data:", error);
//     throw new Error("No Market Data Available");
//   }
// };


// // Fetch single coin details
// export const getCoinDetails = async (id) => {
//   try {
//     const response = await axios.get(`${BASE_URL}/coins/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching coin details:", error);
//     return null;
//   }
// };

// export const getGlobalMarketData = async() => {
//   try {
//     const response = await axios.get(`${BASE_URL}/global`)
//     return response.data.data
//   } catch (error) {
//     console.log("Error fetching Global Market Data: ",error)
//     return null;
//   }
// }

import axios from "axios";

// const API_BASE = "http://localhost:5000/api";
const API_BASE = "https://cryptolytics-backend.onrender.com/api";

export const getMarketData = async (
  currency,
  perPage,
  page,
  signal
) => {
  const response = await axios.get(`${API_BASE}/coins/markets`, {
    params: { vs_currency: currency, per_page: perPage, page },
    signal,
  });

  return response.data;
};


export const getGlobalMarketData = async () => {
  const response = await axios.get(`${API_BASE}/global`);
  return response.data.data;
};

export const getCoinDetails = async (id) => {
  const response = await axios.get(`${API_BASE}/coins/${id}`);
  return response.data;
};

export const getCoinChart = async (id, days = 7) => {
  const response = await axios.get(`${API_BASE}/coins/${id}/chart`, {
    params: { days },
  });
  return response.data;
};