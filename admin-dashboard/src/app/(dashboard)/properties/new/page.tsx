"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { PropertyForm } from "@/components/PropertyForm";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewPropertyPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async ({ data, images }: { data: any, images: File[] }) => {
      let imageUrls: string[] = [];

      // 1. Upload images first if any
      if (images.length > 0) {
        const formData = new FormData();
        images.forEach(img => formData.append("images", img));
        const uploadRes = await api.post("/media/multiple", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        imageUrls = uploadRes.data.imageUrls;
      }

      // 2. Create the vehicle with image URLs
      const payload = {
        ...data,
        year: Number(data.year),
        mileage: Number(data.mileage),
        price: data.price.toString().replace(/,/g, ''), // Clean currency format if needed
        lat: Number(data.lat),
        lng: Number(data.lng),
        images: imageUrls,
        image: imageUrls.length > 0 ? imageUrls[0] : null
      };

      return api.post("/properties", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      router.push("/properties");
    },
    onError: (error: any) => {
      console.error("Mutation error:", error);
      alert(error.response?.data?.message || "Failed to add vehicle");
    },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-10 px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Link href="/properties" className="text-primary font-bold text-sm flex items-center gap-2 mb-4 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to listings
          </Link>
          <div className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-xs mb-3">
              <Sparkles className="w-4 h-4" />
              <span>Create Listing</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Add New <span className="text-slate-400">Vehicle.</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2">Design your vehicle's perfect presentation for the public market.</p>
        </div>
      </div>
      
      <PropertyForm 
        onSubmit={async (data, images) => {
          createMutation.mutate({ data, images });
        }} 
        isLoading={createMutation.isPending} 
      />
    </div>
  );
}
