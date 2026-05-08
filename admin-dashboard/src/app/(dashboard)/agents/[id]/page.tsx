"use client";

import React, { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Edit, Trash2, Mail, Phone, 
  MapPin, Globe, ExternalLink, Home, 
  User, CheckCircle2, Award
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api, { getFileUrl } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function AgentDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  const { data: agent, isLoading, isError } = useQuery({
    queryKey: ['agent', id],
    queryFn: async () => {
      const res = await api.get(`/agents/${id}`);
      return res.data;
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Skeleton className="h-80 md:h-[400px] col-span-1 rounded-4xl" />
            <Skeleton className="h-80 md:h-[400px] col-span-2 rounded-4xl" />
        </div>
        <Skeleton className="h-[400px] w-full rounded-4xl" />
      </div>
    );
  }

  if (isError || !agent) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
          <User className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Agent Not Found</h2>
        <p className="text-slate-500 mb-8">The agent you're looking for doesn't exist or has been removed.</p>
        <Link href="/agents">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Agents
          </Button>
        </Link>
      </div>
    );
  }

  const agentName = agent.user?.name || "Premium Agent";
  const agentProperties = agent.properties || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 pb-12"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/agents" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-2 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Agents
          </Link>
          <h1 className="text-3xl font-bold text-[#163962] flex items-center gap-3">
            {agentName}
            <span className="text-sm font-medium px-3 py-1 bg-primary/10 text-primary rounded-full uppercase tracking-wider">
              {agent.role}
            </span>
          </h1>
        </div>
        <div className="flex gap-3">
          <Link href={`/agents/${id}/edit`}>
            <Button variant="outline" className="gap-2 border-slate-200 hover:bg-slate-50 text-slate-700">
              <Edit className="w-4 h-4" />
              Edit Agent
            </Button>
          </Link>
          <Button variant="destructive" className="gap-2 bg-red-500 hover:bg-red-600 text-white">
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column - Profile Overview */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-4xl premium-shadow border border-slate-100 flex flex-col items-center text-center">
            <div className="relative mb-6">
                <div className="w-40 h-40 rounded-3xl overflow-hidden border-4 border-slate-50 ring-4 ring-primary/10 shadow-2xl transition-transform hover:scale-105 duration-500">
                    <img 
                        src={getFileUrl(agent.user?.profileImage || agent.image)} 
                        alt={agentName}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg border-2 border-white">
                    <Award className="w-5 h-5" />
                </div>
            </div>
            
            <h2 className="text-2xl font-bold text-[#163962] mb-1">{agentName}</h2>
            <p className="text-primary font-bold text-sm tracking-widest uppercase mb-6">{agent.role}</p>

            <div className="w-full space-y-4 pt-6 border-t border-slate-50">
                <div className="flex items-center gap-4 text-slate-600">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="text-left overflow-hidden">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email Address</p>
                      <p className="font-bold truncate text-sm">{agent.user?.email}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-slate-600">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div className="text-left overflow-hidden">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Phone Number</p>
                      <p className="font-bold truncate text-sm">{agent.phone || 'N/A'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-slate-600">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="text-left overflow-hidden">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Main Location</p>
                      <p className="font-bold truncate text-sm">{agent.location || 'N/A'}</p>
                    </div>
                </div>
            </div>
          </div>

          <div className="bg-[#163962] p-8 rounded-4xl text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10 text-center">
              <div className="text-4xl font-black mb-1">{agentProperties.length}</div>
              <div className="text-slate-300 text-xs font-bold uppercase tracking-widest">Active Listings</div>
            </div>
          </div>
        </div>

        {/* Right Column - Bio & Listings */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Biography */}
          <div className="bg-white p-8 md:p-10 rounded-4xl premium-shadow border border-slate-100">
            <h2 className="text-xl font-bold text-[#163962] mb-6 flex items-center gap-3">
               <span className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                 <User className="w-4 h-4" />
               </span>
               Professional Biography
            </h2>
            <p className="text-slate-600 leading-relaxed text-lg italic">
              "{agent.bio || 'This agent has not provided a biography yet.'}"
            </p>
          </div>

          {/* Listings Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-bold text-[#163962]">Agent's Current Listings</h2>
              <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                <Home className="w-4 h-4" />
                <span>{agentProperties.length} Total</span>
              </div>
            </div>

            {agentProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {agentProperties.map((property: any) => (
                  <motion.div
                    key={property.id}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-3xl border border-slate-100 overflow-hidden group premium-shadow"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={getFileUrl(property.image)} 
                        alt={property.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase text-slate-900 shadow-sm">
                          {property.type}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1 mb-2">
                        {property.title}
                      </h3>
                      <p className="text-slate-400 text-xs flex items-center gap-1 mb-4">
                        <MapPin className="w-3 h-3" />
                        {property.address}
                      </p>
                      <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                        <div className="text-lg font-black text-primary">${Number(property.price).toLocaleString()}</div>
                        <Link href={`/properties/${property.id}`}>
                          <Button variant="ghost" size="sm" className="text-xs font-bold gap-1 rounded-lg">
                            Manage
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-12 rounded-4xl text-center">
                 <Home className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                 <p className="text-slate-500 font-medium">No properties managed by this agent.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
