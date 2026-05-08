import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";

export const useUser = () => {
    const queryClient = useQueryClient();

    const { data: user, isLoading } = useQuery({
        queryKey: ["me"],
        queryFn: async () => {
            const res = await api.get("/users/me");
            return res.data;
        },
    });

    const updatePreferences = useMutation({
        mutationFn: async (preferences: any) => {
            const res = await api.put("/users/preferences", { preferences });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["me"] });
        },
    });

    const updateProfile = useMutation({
        mutationFn: async (data: { name?: string; profileImage?: string } | FormData) => {
            const res = await api.put("/users/profile", data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["me"] });
        },
    });

    return {
        user,
        isLoading,
        updatePreferences,
        updateProfile,
    };
};
