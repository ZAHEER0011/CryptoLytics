import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import MarketSnapshot from "../components/MarketSnapshot.jsx";
import CryptoTable from "../components/CryptoTable.jsx";
import TablePagination from "../components/TablePagination.jsx";
import { getMarketData } from "../data/api";
import { Spinner } from "@/components/ui/spinner";

function Home() {
  const [allCoins, setAllCoins] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const perPage = 10;

  // 🔹 Fetch ONCE
  useEffect(() => {
    const fetchAllCoins = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch max once
        const data = await getMarketData("inr", 250, 1);

        if (!Array.isArray(data) || data.length === 0) {
          throw new Error("No data received");
        }

        setAllCoins(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load crypto data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllCoins();
  }, []);

  // 🔹 Client-side pagination
  const paginatedCoins = useMemo(() => {
    const start = (page - 1) * perPage;
    return allCoins.slice(start, start + perPage);
  }, [allCoins, page]);

  const totalPages = Math.ceil(allCoins.length / perPage);

  return (
    <>
      <Navbar />
      <Hero />
      <MarketSnapshot />

      <section className="bg-[var(--color-bg-dark)] pb-14">
        {loading && (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        )}

        {!loading && error && (
          <p className="text-center text-red-400">{error}</p>
        )}

        {!loading && !error && (
          <>
            <CryptoTable coins={paginatedCoins} />

            <TablePagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </section>
    </>
  );
}

export default Home;
