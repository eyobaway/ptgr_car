import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";

const mapVehicle = (v: any) => ({
    ...v,
    // Handle both old 'image' string and new 'images' JSON array
    images: v.images && Array.isArray(v.images) && v.images.length > 0
        ? v.images
        : [v.image || "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800"],
    location: {
        lat: parseFloat(v.lat),
        lng: parseFloat(v.lng),
    },
    features: Array.isArray(v.features)
        ? v.features
        : v.features
            ? v.features.split(",").map((f: string) => f.trim())
            : [],
});

export const useVehicles = (filters = {}) => {
    return useQuery({
        queryKey: ["vehicles", filters],
        queryFn: async () => {
            const response = await api.get("/properties", { params: filters });
            return response.data.map(mapVehicle);
        },
    });
};

export const useVehicle = (id: string) => {
    return useQuery({
        queryKey: ["vehicle", id],
        queryFn: async () => {
            const response = await api.get(`/properties/${id}`);
            return mapVehicle(response.data);
        },
        enabled: !!id,
    });
};

export const useCreateVehicle = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (vehicleData: any) => {
            const response = await api.post("/properties", vehicleData);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vehicles"] });
            queryClient.invalidateQueries({ queryKey: ["dealer"] });
            queryClient.invalidateQueries({ queryKey: ["dealers"] });
        },
    });
};

export const useUpdateVehicle = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            const response = await api.put(`/properties/${id}`, data);
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["vehicles"] });
            queryClient.invalidateQueries({ queryKey: ["vehicle", variables.id] });
            queryClient.invalidateQueries({ queryKey: ["dealer"] });
            queryClient.invalidateQueries({ queryKey: ["dealers"] });
        },
    });
};

export const useDeleteVehicle = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete(`/properties/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vehicles"] });
            queryClient.invalidateQueries({ queryKey: ["dealer"] });
            queryClient.invalidateQueries({ queryKey: ["dealers"] });
        },
    });
};
