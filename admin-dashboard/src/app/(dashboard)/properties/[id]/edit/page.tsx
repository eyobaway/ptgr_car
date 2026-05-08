"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { PropertyForm } from "@/components/PropertyForm";
import { Loader2, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const id = params.id as string;

  const { data: property, isLoading } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const res = await api.get(`/properties/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ data, images, existingImages }: { data: any, images: File[], existingImages: string[] }) => {
      let finalImageUrls = [...existingImages];

      // 1. Upload new images if any
      if (images.length > 0) {
        const formData = new FormData();
        images.forEach(img => formData.append("images", img));
        const uploadRes = await api.post("/media/multiple", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        finalImageUrls = [...finalImageUrls, ...uploadRes.data.imageUrls];
      }

      // 2. Update the vehicle with the combined image list
      const payload = {
        ...data,
        year: Number(data.year),
        mileage: Number(data.mileage),
        price: data.price.toString().replace(/,/g, ''),
        lat: Number(data.lat),
        lng: Number(data.lng),
        images: finalImageUrls,
        image: finalImageUrls.length > 0 ? finalImageUrls[0] : property?.image
      };

      return api.put(`/properties/${id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["property", id] });
      router.push("/properties");
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Failed to update vehicle");
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading vehicle data...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-20 bg-white rounded-4xl border border-dashed border-slate-200">
        <p className="text-slate-400 font-bold">Vehicle not found.</p>
        <Link href="/properties" className="text-primary hover:underline mt-4 inline-block font-bold">Return to listings</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-10 px-4 md:px-0 text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Link href="/properties" className="text-primary font-bold text-sm flex items-center gap-2 mb-4 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to listings
          </Link>
          <div className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-xs mb-3">
              <Sparkles className="w-4 h-4" />
              <span>Listing Editor</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Edit <span className="text-slate-400">Vehicle.</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2">Adjust details, photos, and location for the {property.make} {property.model}.</p>
        </div>
      </div>

      <PropertyForm 
        initialData={{
          title: property.title || "",
          make: property.make,
          model: property.model,
          year: property.year,
          price: property.price,
          type: property.type,
          transmission: property.transmission,
          fuelType: property.fuelType,
          mileage: property.mileage,
          condition: property.condition,
          bodyType: property.bodyType,
          description: property.description,
          features: property.features,
          lat: property.lat,
          lng: property.lng,
          images: property.images || (property.image ? [property.image] : [])
        }}
        onSubmit={async (data, images, existingImages) => {
          updateMutation.mutate({ data, images, existingImages });
        }} 
        isLoading={updateMutation.isPending} 
      />
    </div>
  );
}
