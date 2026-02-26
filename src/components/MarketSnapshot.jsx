import React, { useEffect, useState } from "react";
import { getGlobalMarketData } from "../data/api";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";

function MarketSnapshot() {
  const [globalData, setGlobalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getGlobalMarketData();
        if (!data) {
          throw new Error("No Global Market Data Available");
        }

        setGlobalData(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load market snapshot.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = globalData
    ? [
        {
          label: "Total Market Cap",
          value: `₹${(globalData.total_market_cap.inr / 1e12).toFixed(2)}T`,
        },
        {
          label: "24h Volume",
          value: `₹${(globalData.total_volume.inr / 1e12).toFixed(2)}T`,
        },
        {
          label: "BTC Dominance",
          value: `${globalData.market_cap_percentage.btc.toFixed(2)}%`,
        },
        {
          label: "ETH Dominance",
          value: `${globalData.market_cap_percentage.eth.toFixed(2)}%`,
        },
        {
          label: "Market Change (24h)",
          value: `${globalData.market_cap_change_percentage_24h_usd.toFixed(2)}%`,
          isPositive: globalData.market_cap_change_percentage_24h_usd > 0,
        },
      ]
    : [];

  return (
    <section className="w-full bg-[var(--color-bg-dark)] py-10">
      <div className="w-11/12 mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          Market Snapshot
        </h2>

        {/* Reserved height prevents layout jump */}
        <div className="min-h-[220px] flex items-center justify-center">
          {loading && (
            <Empty className="w-full">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Spinner />
                </EmptyMedia>
                <EmptyTitle>Fetching Market Data</EmptyTitle>
                <EmptyDescription>
                  Please wait while we load global crypto stats.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}

          {!loading && error && (
            <div className="text-center text-red-400">
              <p className="font-semibold">{error}</p>
              <p className="text-sm opacity-80 mt-1">
                Check your internet connection or try again later.
              </p>
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full">
              {stats.map((item) => (
                <Card
                  key={item.label}
                  className="bg-[var(--color-bg-card)] rounded-2xl p-6 text-center 
                             shadow-lg hover:shadow-cyan-500/20 transition-all"
                >
                  <CardHeader>
                    <CardTitle className="text-sm text-[var(--color-text-secondary)]">
                      {item.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p
                      className={`text-2xl font-bold ${
                        item.isPositive === undefined
                          ? "text-white"
                          : item.isPositive
                          ? "text-[var(--color-accent-green)]"
                          : "text-[var(--color-accent-red)]"
                      }`}
                    >
                      {item.value}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default MarketSnapshot;