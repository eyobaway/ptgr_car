"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { AgentForm } from "@/components/AgentForm";
import { Loader2, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditAgentPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const id = params.id as string;

  const { data: agent, isLoading } = useQuery({
    queryKey: ["agent", id],
    queryFn: async () => {
      const res = await api.get(`/agents/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      return api.put(`/agents/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      queryClient.invalidateQueries({ queryKey: ["agent", id] });
      router.push("/agents");
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Failed to update agent");
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Fetching agent profile...</p>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="text-center py-20 bg-white rounded-4xl border border-dashed border-slate-200">
        <p className="text-slate-400 font-bold">Agent profile not found.</p>
        <Link href="/agents" className="text-primary hover:underline mt-4 inline-block font-bold">Return to agents</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-10 px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Link href="/agents" className="text-primary font-bold text-sm flex items-center gap-2 mb-4 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to agents
          </Link>
          <div className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-xs mb-3 text-left">
              <Sparkles className="w-4 h-4" />
              <span>Profile Editor</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight text-left">
              Edit <span className="text-slate-400">Agent.</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2 text-left">Update professional role and contact info for high-quality representation.</p>
        </div>
      </div>

      <AgentForm 
        initialData={{
          role: agent.role,
          phone: agent.phone || "",
          location: agent.location || "",
          bio: agent.bio || "",
          languages: agent.languages || "",
          isActive: agent.isActive,
        }}
        onSubmit={async (data) => {
          updateMutation.mutate(data);
        }} 
        isLoading={updateMutation.isPending} 
      />
    </div>
  );
}
