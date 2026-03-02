import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getCoinDetails, getCoinChart } from "../data/api";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import CryptoChart from "../components/CryptoChart";

function CryptoDetail() {
  const { id } = useParams();

  const [coin, setCoin] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [days, setDays] = useState(7);
  // const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setLoading(true);

  //       const [coinRes, chartRes] = await Promise.all([
  //         getCoinDetails(id),
  //         getCoinChart(id, days),
  //       ]);

  //       setCoin(coinRes);
  //       setChartData(chartRes);
  //     } catch (err) {
  //       console.error(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [id, days]);

  // Fetch coin details (ONLY when id changes)
  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const data = await getCoinDetails(id);
        setCoin(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCoin();
  }, [id]);

  // Fetch chart (when id OR days changes)
  useEffect(() => {
    const fetchChart = async () => {
      try {
        setChartLoading(true);
        const data = await getCoinChart(id, days);
        setChartData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setChartLoading(false);
      }
    };

    fetchChart();
  }, [id, days]);

  // if (loading || !coin || !chartData) {
  //   return (
  //     <div className="min-h-screen bg-[var(--color-bg-dark)] flex justify-center items-center">
  //       <Spinner />
  //     </div>
  //   );
  // }

  if (!coin || !coin.market_data) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-dark)] flex justify-center items-center">
        <div className="flex flex-col items-center gap-3 text-white">
          <Spinner />
          <p className="text-sm opacity-80">Fetching coin details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-dark)] text-white pb-10">
      <Navbar />

      <div className="w-11/12 mx-auto mt-10 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          {/* <img src={coin.image.large} alt={coin.name} className="w-12 h-12" /> */}
          <img
            src={coin?.image?.large || "/placeholder.png"}
            alt={coin?.name || "coin"}
            className="w-12 h-12"
          />
          <div>
            <h1 className="text-3xl font-bold">
              {coin.name} ({coin.symbol.toUpperCase()})
            </h1>
            <p className="text-xl mt-1">
              {/* ₹{coin.market_data.current_price.inr.toLocaleString()} */}
              ₹{
                coin?.market_data?.current_price?.inr
                  ? coin.market_data.current_price.inr.toLocaleString()
                  : "N/A"
              }
            </p>
          </div>
        </div>

        {/* Chart */}
        {/* <Card className="p-6 bg-black/40">
          <div className="flex gap-4 mb-4">
            {[1, 7, 30, 90, 365].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3 py-1 rounded ${days === d
                  ? "bg-white text-black"
                  : "bg-white/10 text-white"
                  }`}
              >
                {d === 1 ? "24H" : `${d}D`}
              </button>
            ))}
          </div>

          <CryptoChart data={chartData} />
        </Card> */}


        {/* <Card className="p-6 bg-black/40">
          <div className="flex gap-4 mb-4">
            {[1, 7, 30, 90, 365].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3 py-1 rounded ${days === d
                  ? "bg-white text-black"
                  : "bg-white/10 text-white"
                  }`}
              >
                {d === 1 ? "24H" : `${d}D`}
              </button>
            ))}
          </div>

          {chartLoading ? (
            <div className="flex justify-center py-20">
              <Spinner />
            </div>
          ) : (
            <CryptoChart data={chartData} />
          )}
        </Card> */}

        <Card className="p-6 bg-black/40 border-0">
          <div className="flex gap-4 mb-4">
            {[1, 7, 30, 90, 365].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3 py-1 rounded ${days === d
                  ? "bg-white text-black"
                  : "bg-white/10 text-white"
                  }`}
              >
                {d === 1 ? "24H" : `${d}D`}
              </button>
            ))}
          </div>

          {/* Chart Container */}
          <div className="relative">

            {/* Chart always mounted */}
            <div className={chartLoading ? "opacity-30" : "opacity-100"}>
              {chartData && <CryptoChart data={chartData} />}
            </div>

            {/* Loader overlay */}
            {chartLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Spinner />
              </div>
            )}

          </div>
        </Card>

        {/* Stats */}
        {/* <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <Card className="p-4 bg-black/40">
            <p>Market Cap</p>
            <p className="font-bold text-lg">
              ₹{coin.market_data.market_cap.inr.toLocaleString()}
            </p>
          </Card>

          <Card className="p-4 bg-black/40">
            <p>Circulating Supply</p>
            <p className="font-bold text-lg">
              {coin.market_data.circulating_supply.toLocaleString()}
            </p>
          </Card>

          <Card className="p-4 bg-black/40">
            <p>All Time High</p>
            <p className="font-bold text-lg">
              ₹{coin.market_data.ath.inr.toLocaleString()}
            </p>
          </Card>
        </div> */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {[
            {
              label: "Market Cap",
              value: coin.market_data?.market_cap?.inr,
            },
            {
              label: "24H High",
              value: coin.market_data?.high_24h?.inr,
            },
            {
              label: "24H Low",
              value: coin.market_data?.low_24h?.inr,
            },
            {
              label: "All Time High",
              value: coin.market_data?.ath?.inr,
            },
            {
              label: "Circulating Supply",
              value: coin.market_data?.circulating_supply,
              isSupply: true,
            },
            {
              label: "Total Supply",
              value: coin.market_data?.total_supply,
              isSupply: true,
            },
          ].map((item, index) => (
            <Card key={index} className="p-4 bg-black/40">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="font-bold text-lg mt-2 text-primary-foreground">
                {item.value
                  ? item.isSupply
                    ? item.value.toLocaleString()
                    : `₹${item.value.toLocaleString()}`
                  : "N/A"}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CryptoDetail;