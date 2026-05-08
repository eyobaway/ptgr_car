"use client";

import React, { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Edit, Trash2, MapPin, Car, 
  Settings, Gauge, Calendar, Tag, User, 
  ExternalLink, CheckCircle2, ChevronLeft, ChevronRight,
  Zap, Fuel, ShieldCheck
} from "lucide-react";
import { AnimatePresence } from "framer-motion";
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

export default function PropertyDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  const { data: property, isLoading, isError } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const res = await api.get(`/properties/${id}`);
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
        <Skeleton className="h-[400px] w-full rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Skeleton className="h-64 col-span-2 rounded-3xl" />
            <Skeleton className="h-64 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
          <Car className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Vehicle Not Found</h2>
        <p className="text-slate-500 mb-8">The vehicle you're looking for doesn't exist or has been removed.</p>
        <Link href="/properties">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Vehicles
          </Button>
        </Link>
      </div>
    );
  }

  const features = Array.isArray(property.features) 
    ? property.features 
    : (property.features ? property.features.split(",").map((f: string) => f.trim()) : []);
  const images = property.images && property.images.length > 0 ? property.images : [property.image];

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
          <Link href="/properties" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-2 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Vehicles
          </Link>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            {property.title}
            <span className="text-sm font-medium px-3 py-1 bg-primary/10 text-primary rounded-full uppercase tracking-wider">
              {property.type}
            </span>
          </h1>
          <p className="text-slate-500 flex items-center gap-2 mt-1">
            <Car className="w-4 h-4" />
            {property.make} {property.model} ({property.year})
          </p>
        </div>
        <div className="flex gap-3">
          <Link href={`/properties/${id}/edit`}>
            <Button variant="outline" className="gap-2 border-slate-200 hover:bg-slate-50 text-slate-700">
              <Edit className="w-4 h-4" />
              Edit Vehicle
            </Button>
          </Link>
          <Button variant="destructive" className="gap-2 bg-red-500 hover:bg-red-600 text-white">
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Gallery & Description */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Interactive Slider Gallery */}
          <div className="bg-white p-2 rounded-[2.5rem] premium-shadow border border-slate-100 overflow-hidden space-y-4">
            <div className="relative h-[450px] w-full group overflow-hidden rounded-3xl bg-slate-50">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={getFileUrl(images[currentImageIndex])}
                  alt={`Vehicle Image ${currentImageIndex + 1}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                    className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-slate-900 shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 z-10"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-slate-900 shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 z-10"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Image Counter Overlay */}
              <div className="absolute bottom-6 right-6 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-xs font-bold ring-1 ring-white/20 z-10">
                {currentImageIndex + 1} / {images.length}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 px-2 scrollbar-hide">
                {images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-20 h-16 rounded-xl overflow-hidden shrink-0 transition-all ${
                      currentImageIndex === idx ? 'ring-2 ring-primary scale-95 ring-offset-2' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={getFileUrl(img)} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description & Features */}
          <div className="bg-white p-8 md:p-10 rounded-4xl premium-shadow border border-slate-100 space-y-10">
            <div>
              <h2 className="text-xl font-bold text-primary mb-4">About this Listing</h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                {property.description}
              </p>
            </div>

            <div className="pt-8 border-t border-slate-100">
              <h2 className="text-xl font-bold text-primary mb-6">Vehicle Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {features.map((feature: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 text-slate-600 font-medium bg-slate-50 px-4 py-3 rounded-xl border border-slate-100/50">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Quick Info & Agent */}
        <div className="space-y-8">
          
          {/* Quick Stats Card */}
          <div className="bg-primary p-8 rounded-4xl text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
            
            <div className="relative z-10">
              <div className="text-slate-300 text-sm font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Current Price
              </div>
              <div className="text-5xl font-black mb-1">${Number(property.price).toLocaleString()}</div>
              {property.type === "RENT" && <div className="text-slate-300 font-medium mb-8">per {property.rentCycle?.toLowerCase() || 'month'}</div>}
              
              <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/10">
                <div className="text-center">
                  <Calendar className="w-6 h-6 mx-auto mb-2 text-primary-hover" />
                  <div className="text-xl font-bold">{property.year}</div>
                  <div className="text-[10px] uppercase font-bold tracking-tighter text-slate-300">Year</div>
                </div>
                <div className="text-center">
                  <Gauge className="w-6 h-6 mx-auto mb-2 text-primary-hover" />
                  <div className="text-xl font-bold">{property.mileage}</div>
                  <div className="text-[10px] uppercase font-bold tracking-tighter text-slate-300">KM</div>
                </div>
                <div className="text-center">
                  <Zap className="w-6 h-6 mx-auto mb-2 text-primary-hover" />
                  <div className="text-xl font-bold">{property.transmission}</div>
                  <div className="text-[10px] uppercase font-bold tracking-tighter text-slate-300">Trans.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Listing Details Card */}
          <div className="bg-white p-8 rounded-4xl premium-shadow border border-slate-100 divide-y divide-slate-100">
            <h3 className="text-xl font-bold text-primary mb-6">Vehicle Details</h3>
            <div className="py-4 flex justify-between items-center text-sm">
               <span className="text-slate-500 font-medium flex items-center gap-2">
                 <Fuel className="w-4 h-4" /> Fuel Type
               </span>
               <span className="text-slate-900 font-bold">{property.fuelType}</span>
            </div>
            <div className="py-4 flex justify-between items-center text-sm">
               <span className="text-slate-500 font-medium flex items-center gap-2">
                 <ShieldCheck className="w-4 h-4" /> Condition
               </span>
               <span className="text-slate-900 font-bold">{property.condition}</span>
            </div>
            <div className="py-4 flex justify-between items-center text-sm">
               <span className="text-slate-500 font-medium flex items-center gap-2">
                 <Car className="w-4 h-4" /> Body Type
               </span>
               <span className="text-slate-900 font-bold">{property.bodyType}</span>
            </div>
            <div className="py-4 flex justify-between items-center text-sm">
               <span className="text-slate-500 font-medium flex items-center gap-2">
                 <Calendar className="w-4 h-4" /> Listed Date
               </span>
               <span className="text-slate-900 font-bold">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="py-4 flex justify-between items-center text-sm">
               <span className="text-slate-500 font-medium flex items-center gap-2">
                 <Settings className="w-4 h-4" /> Category
               </span>
               <span className="text-slate-900 font-bold">{property.type}</span>
            </div>
            <div className="py-4 flex justify-between items-center text-sm">
               <span className="text-slate-500 font-medium flex items-center gap-2">
                 <CheckCircle2 className="w-4 h-4" /> Listing Plan
               </span>
               <span className="text-primary font-bold">PREMIUM</span>
            </div>
          </div>

          {/* Agent Information */}
          {property.agent && (
            <div className="bg-white p-8 rounded-4xl premium-shadow border border-slate-100">
              <div className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-[10px] mb-6">
                <User className="w-3 h-3" /> Assigned Dealer
              </div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                  <img 
                    src={getFileUrl(property.agent.user?.profileImage || property.agent.image)} 
                    alt={property.agent.user?.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-lg">{property.agent.user?.name}</div>
                  <div className="text-slate-500 text-sm">{property.agent.role}</div>
                </div>
              </div>
              <Link href={`/agents/${property.agent.id}`}>
                <Button className="w-full bg-slate-50 hover:bg-slate-100 text-primary font-bold border-slate-100 shadow-none gap-2 rounded-xl">
                  View Dealer Profile
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
