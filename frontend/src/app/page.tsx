"use client";

import Hero from "@/components/Hero";
import ListingGrid from "@/components/ListingGrid";
import { ArrowRight, Sparkles, MapPin, Loader2 } from "lucide-react";
import Link from "next/link";
import { useVehicles } from "@/hooks/useVehicles";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const AllVehiclesMap = dynamic(() => import("@/components/AllVehiclesMap"), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-slate-100 animate-pulse rounded-[2.5rem] flex items-center justify-center text-slate-400 font-bold">Loading Map...</div>
});


export default function Home() {
  const { data: vehicles = [], isLoading, isError } = useVehicles();
  const [mapCenter, setMapCenter] = useState<[number, number] | undefined>(undefined);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const handleLocationAccess = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setMapCenter([latitude, longitude]);
        setUserLocation([latitude, longitude]);
        setIsLocating(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        // We only show an alert if they explicitly clicked the button, not on auto-load
        if (isLocating) alert("Unable to retrieve your location. Please check your browser permissions.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  // Automatically request location access on home page load
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
          setUserLocation([latitude, longitude]);
        },
        () => {
          // silently fail on mount if denied or errors
        }
      );
    }
  }, []);

  return (
    <div>
      <Hero />

      <section className="py-12 md:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4 md:gap-6">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-sm mb-3">
              <Sparkles className="w-4 h-4" />
              <span>Recommended for you</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Featured <span className="text-slate-400">Cars.</span>
            </h2>
          </div>
          <Link
            href="/buy"
            className="group flex items-center gap-2 text-primary font-bold text-base md:text-lg hover:underline underline-offset-8 shrink-0"
          >
            View all cars
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isError && (
          <div className="text-center py-20 text-red-500 font-bold">
            Error loading vehicles. Please try again later.
          </div>
        )}

        {!isError && (
          <ListingGrid
            vehicles={vehicles.slice(0, 6)}
            isLoading={isLoading}
            skeletonCount={6}
          />
        )}
      </section>

      {/* Explore Nearby Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-12 md:mb-24">
        <div className="bg-white rounded-[2rem] md:rounded-[3rem] border-slate-100">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8 mb-8 md:mb-12">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-sm mb-3">
                <MapPin className="w-4 h-4" />
                <span>Cars Near You</span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 mb-4">
                Find Cars in Your <span className="text-slate-400">Area.</span>
              </h2>
              <p className="text-slate-500 font-medium text-sm md:text-base">
                {userLocation 
                  ? "We've found cars available in your area! Explore them on the map below."
                  : "Want to see cars available near you? Allow location access to discover great deals in your immediate vicinity."}
              </p>
            </div>
            {!userLocation && (
              <button
                onClick={handleLocationAccess}
                disabled={isLocating}
                className="w-full md:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary transition-all shadow-xl active:scale-95 whitespace-nowrap flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLocating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Locating...
                  </>
                ) : (
                  "Allow Location Access"
                )}
              </button>
            )}
          </div>

          <div className="rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border border-slate-100 min-h-[300px] md:min-h-[400px]">
            {isLoading ? (
              <div className="h-[300px] md:h-[400px] w-full bg-slate-50 animate-pulse flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-slate-300 animate-spin" />
              </div>
            ) : (
              <AllVehiclesMap
                vehicles={vehicles}
                center={mapCenter}
                userLocation={userLocation}
              />
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-50 py-12 md:py-24 mb-12 md:mb-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12 text-center">
          <div>
            <div className="text-3xl md:text-5xl font-black text-slate-900 mb-2">12k+</div>
            <div className="text-slate-500 font-medium text-sm md:text-base">Cars Sold</div>
          </div>
          <div>
            <div className="text-3xl md:text-5xl font-black text-slate-900 mb-2">2.5k</div>
            <div className="text-slate-500 font-medium text-sm md:text-base">Daily Listings</div>
          </div>
          <div>
            <div className="text-3xl md:text-5xl font-black text-slate-900 mb-2">450+</div>
            <div className="text-slate-500 font-medium text-sm md:text-base">Top Dealers</div>
          </div>
          <div>
            <div className="text-3xl md:text-5xl font-black text-slate-900 mb-2">99%</div>
            <div className="text-slate-500 font-medium text-sm md:text-base">Happy Customers</div>
          </div>
        </div>
      </section>

      {/* Sell CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-12 md:mb-24">
        <div
          className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1567818735868-e71b99932e29?q=80&w=2070&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center 40%",
          }}
        >
          {/* Gradient overlays for contrast */}
          <div className="absolute inset-0 bg-linear-to-r from-slate-900/95 via-slate-900/75 to-slate-900/30" />
          <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 via-transparent to-transparent" />

          <div className="relative z-10 p-8 sm:p-12 md:p-20 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 text-white bg-transparent py-1.5 border border-slate-400 rounded-full text-xs sm:text-sm font-bold uppercase tracking-widest mb-5 md:mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full text-white bg-slate-400 animate-pulse" />
              List with us
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-5 md:mb-8 leading-tight drop-shadow-lg">
              Ready to sell your{" "}
              <span className="text-slate-400">car?</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base md:text-lg mb-7 md:mb-10 leading-relaxed">
              Join 10,000+ car owners who have already listed their vehicles and found their perfect buyers. We provide the tools to get you the best price.
            </p>
            <Link
              href="/sell"
              className="inline-block bg-primary hover:bg-primary-hover text-white px-8 md:px-10 py-4 md:py-5 rounded-full font-bold text-base md:text-lg transition-all shadow-xl hover:scale-105 active:scale-95"
            >
              List My Car
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
