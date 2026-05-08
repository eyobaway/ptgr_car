"use client";

import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative flex flex-col items-center gap-4">
        {/* Outer Ring */}
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-secondary border-t-primary"></div>
        
        {/* Inner Pulsing Circle */}
        <div className="absolute top-4 left-4 h-8 w-8 animate-pulse rounded-full bg-gold/20"></div>
        
        {/* Loading Text */}
        <div className="animate-pulse">
             <span className="text-primary font-medium tracking-widest text-sm uppercase">Loading</span>
             <span className="inline-flex items-baseline">
                <span className="animate-[bounce_1.4s_infinite] delay-[200ms]">.</span>
                <span className="animate-[bounce_1.4s_infinite] delay-[400ms]">.</span>
                <span className="animate-[bounce_1.4s_infinite] delay-[600ms]">.</span>
             </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
