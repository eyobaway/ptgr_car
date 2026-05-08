"use client";

import { useSession, signOut } from "next-auth/react";

export const useAuth = () => {
    const { data: session, status, update } = useSession();

    const user = session?.user || null;
    const isLoading = status === "loading";

    const logout = async () => {
        await signOut({ callbackUrl: "/login" });
    };

    return {
        user,
        isLoading,
        logout,
        update,
        // Kept for compatibility but should be migrated to next-auth signIn directly
        isAuthenticated: !!session,
    };
};
