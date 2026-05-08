"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { AgentForm } from "@/components/AgentForm";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewAgentPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return api.post("/agents", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      router.push("/agents");
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Failed to create agent");
    },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-10 px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Link href="/agents" className="text-primary font-bold text-sm flex items-center gap-2 mb-4 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to agents
          </Link>
          <div className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-xs mb-3">
              <Sparkles className="w-4 h-4" />
              <span>Agent Onboarding</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight text-left">
              Create New <span className="text-slate-400">Agent.</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2 text-left">Onboard a professional agent to help users find their dream car.</p>
        </div>
      </div>
      
      <AgentForm 
        onSubmit={async (data) => {
          createMutation.mutate(data);
        }} 
        isLoading={createMutation.isPending} 
      />
    </div>
  );
}
