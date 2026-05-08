"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";
import { DashboardCharts } from "@/components/DashboardCharts";
import { AISummaryCard } from "@/components/AISummaryCard";


export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await api.get('/admin/stats');
      return res.data;
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40 w-full rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-[400px] w-full rounded-2xl" />
      </div>
    );
  }

  const summary = stats?.summary || {
    totalUsers: 0,
    totalAgents: 0,
    totalProperties: 0,
    totalInquiries: 0
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold text-primary">Dashboard</h1>

      <AISummaryCard />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Users", value: summary.totalUsers, color: "bg-blue-600" },
          { label: "Active Dealers", value: summary.totalAgents, color: "bg-indigo-600" },
          { label: "Listed Vehicles", value: summary.totalProperties, color: "bg-amber-500" },
          { label: "Total Inquiries", value: summary.totalInquiries, color: "bg-emerald-600" },
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className={`p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center relative overflow-hidden group hover:shadow-md transition-shadow bg-white`}
          >
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 ${stat.color} group-hover:scale-110 transition-transform`}></div>
            <h3 className="text-slate-400 font-bold mb-2 text-xs uppercase tracking-widest relative z-10">
              {stat.label}
            </h3>
            <p className="text-4xl font-black text-primary relative z-10 tabular-nums">
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm min-h-[400px]"
      >
        <h2 className="text-xl font-bold text-primary mb-4">Network Activity</h2>
        <DashboardCharts
          growthData={stats?.growthData || []}
          typeDistribution={stats?.typeDistribution || []}
          cityDistribution={stats?.cityDistribution || []}
          userDistribution={stats?.userDistribution || []}
        />
      </motion.div>
    </motion.div>
  );
}
