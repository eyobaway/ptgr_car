"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";

interface GuardOptions {
    title?: string;
    description?: string;
    icon?: React.ReactNode;
}

export const useAuthGuard = () => {
    const { data: session, status } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [modalOptions, setModalOptions] = useState<GuardOptions>({});

    const openModal = useCallback((options: GuardOptions = {}) => {
        setModalOptions(options);
        setIsOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsOpen(false);
    }, []);

    const guardAction = useCallback((action: () => void, options: GuardOptions = {}) => {
        if (status === "authenticated") {
            action();
        } else {
            openModal(options);
        }
    }, [status, openModal]);

    return {
        isOpen,
        modalOptions,
        openModal,
        closeModal,
        guardAction,
        isAuthenticated: !!session
    };
};
