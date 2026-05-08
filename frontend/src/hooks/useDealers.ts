import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";

export const useDealers = (filters?: { name?: string; location?: string; role?: string }) => {
    return useQuery({
        queryKey: ["dealers", filters],
        queryFn: async () => {
            const response = await api.get("/agents", { params: filters });
            return response.data;
        },
    });
};

export const useDealer = (id: string) => {
    return useQuery({
        queryKey: ["dealer", id],
        queryFn: async () => {
            const response = await api.get(`/agents/${id}`);
            return response.data;
        },
        enabled: !!id,
    });
};

export const useUpdateDealer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await api.put("/agents/me", data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dealer"] });
            queryClient.invalidateQueries({ queryKey: ["dealers"] });
            queryClient.invalidateQueries({ queryKey: ["user"] });
        },
    });
};

export const useDealerStats = () => {
    return useQuery({
        queryKey: ["dealer-stats"],
        queryFn: async () => {
            const response = await api.get("/agents/me/stats");
            return response.data;
        },
    });
};
