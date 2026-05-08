"use client";

import { useSession } from "next-auth/react";
import { ReactNode } from "react";

interface RoleGuardProps {
    children: ReactNode;
    allowedRoles: string[];
    fallback?: ReactNode;
}

export default function RoleGuard({ children, allowedRoles, fallback = null }: RoleGuardProps) {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return null; // Or a loading spinner
    }

    const userRole = session?.user?.role;

    if (userRole && allowedRoles.includes(userRole)) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
}
