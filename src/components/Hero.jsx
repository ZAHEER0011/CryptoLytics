import React, { useEffect, useState } from "react";
import { getMarketData } from "../data/api";
import { Card, CardContent } from "@/components/ui/card";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { useNavigate } from "react-router-dom";

function Hero() {
    const [coins, setCoins] = useState([]);
    const [api, setApi] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate()

    // Fetch 50 coins
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null)

                const data = await getMarketData("inr", 50);
                if (!data || data.length === 0) {
                    throw new Error("No Market Data Available")
                }

                setCoins(data)
            } catch (error) {
                console.error(error)
                setError("Failed to load crypto data. Please try again.")
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Auto slide logic
    useEffect(() => {
        if (!api) return;

        const interval = setInterval(() => {
            if (!api.canScrollNext()) {
                api.scrollTo(0); // loop back to start
            } else {
                api.scrollNext();
            }
        }, 2500);

        return () => clearInterval(interval);
    }, [api]);

    return (
        <div className="bg-[var(--color-bg-dark)] text-[var(--color-text-primary)] py-25">


            <div className="w-11/12 mx-auto flex flex-col items-center gap-10">

                {/* Hero Text */}
                <div className="text-center">
                    <h1 className="font-bold font-serif text-5xl italic">
                        CryptoLytics
                    </h1>
                    <p className="font-semibold text-xl text-[var(--color-text-secondary)] mt-2">
                        Live Crypto Analytics, AI Predictions & Market Insights
                    </p>
                </div>

                {/* Carousel */}
                <div className="w-full">
                    <h2 className="text-3xl font-bold text-center mb-6">
                        Most Trending Cryptos of Today
                    </h2>

                    {loading && (
                        <div className="flex flex-col items-center gap-3">
                            <Empty className="w-full">
                                <EmptyHeader>
                                    <EmptyMedia variant="icon">
                                        <Spinner />
                                    </EmptyMedia>
                                    <EmptyTitle>Fetching Cryptos....</EmptyTitle>
                                    <EmptyDescription>
                                        Please wait while we are fetching cryptos. Do not refresh the page.
                                    </EmptyDescription>
                                </EmptyHeader>
                            </Empty>
                        </div>
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
                        <Carousel
                            setApi={setApi}
                            opts={{
                                align: "start",
                                loop: true,
                            }}
                            className="w-full max-w-[85%] mx-auto"
                        >
                            <CarouselContent>
                                {coins.map((coin) => (
                                    <CarouselItem
                                        key={coin.id}
                                        className="basis-1/2 md:basis-1/3 lg:basis-1/5"
                                        onClick={() => navigate(`/crypto/${coin.id}`)}
                                    >
                                        <Card  className="border-0 hover:scale-125 transition-transform cursor-pointer bg-transparent text-white">
                                            <CardContent className="flex flex-col items-center gap-2 p-6">
                                                <img src={coin.image} alt={coin.name} className="w-20 h-20 " />
                                                <span className="font-bold text-lg">{coin.name}</span>
                                                <span className="font-semibold text-xl">
                                                    ₹{coin.current_price}
                                                </span>
                                                <span
                                                    className={`text-sm ${coin.price_change_percentage_24h > 0
                                                        ? "text-[var(--color-accent-green)]"
                                                        : "text-[var(--color-accent-red)]"
                                                        }`}
                                                >
                                                    {coin.price_change_percentage_24h !== null
                                                        ? `${coin.price_change_percentage_24h.toFixed(2)}%`
                                                        : "—"}
                                                </span>
                                            </CardContent>
                                        </Card>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>

                            <CarouselPrevious className="cursor-pointer text-black" />
                            <CarouselNext className="cursor-pointer text-black" />
                        </Carousel>
                    )}

                </div>
            </div>
        </div>
    );
}

export default Hero;