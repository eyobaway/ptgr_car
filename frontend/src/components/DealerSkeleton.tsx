import React from "react";

const DealerSkeleton = () => {
    return (
        <div className="bg-white p-6 rounded-4xl premium-shadow border border-slate-100 relative overflow-hidden animate-pulse">
            <div className="flex items-center gap-6">
                {/* Avatar skeleton */}
                <div className="w-24 h-24 rounded-full bg-slate-200 shrink-0" />

                <div className="flex-1 space-y-3">
                    {/* Name skeleton */}
                    <div className="h-6 w-3/4 bg-slate-200 rounded-lg" />
                    {/* Role skeleton */}
                    <div className="h-4 w-1/2 bg-slate-100 rounded-lg" />
                    {/* Stats skeleton */}
                    <div className="h-4 w-1/3 bg-slate-50 rounded-lg" />
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
                {/* Footer link skeletons */}
                <div className="h-4 w-16 bg-slate-100 rounded-lg" />
                <div className="h-4 w-16 bg-slate-100 rounded-lg" />
                {/* Arrow button skeleton */}
                <div className="w-10 h-10 rounded-full bg-slate-50 ml-auto" />
            </div>
        </div>
    );
};

export default DealerSkeleton;
