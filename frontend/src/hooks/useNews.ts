import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

export const useArticles = () => {
    return useQuery({
        queryKey: ["articles"],
        queryFn: async () => {
            const response = await api.get("/news");
            return response.data;
        },
    });
};

export const useArticle = (id: string) => {
    return useQuery({
        queryKey: ["article", id],
        queryFn: async () => {
            const response = await api.get(`/news/${id}`);
            return response.data;
        },
        enabled: !!id,
    });
};
