import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';

let socket: Socket | null = null;
let connectionPromise: Promise<Socket> | null = null;

export const useSocket = () => {
    const { data: session, status } = useSession();
    const [isConnected, setIsConnected] = useState(socket?.connected || false);

    const isAuthenticated = status === 'authenticated';
    const token = (session?.user as any)?.accessToken; // Retrieve from next-auth JWT session

    // We export a function to explicitly trigger connection 
    // rather than auto-connecting on import, to ensure we have the token.
    const connect = async () => {
        if (socket?.connected) {
            setIsConnected(true);
            return socket;
        }
        if (!token) return null;

        if (!connectionPromise) {
            connectionPromise = new Promise((resolve, reject) => {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
                const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || apiUrl.replace(/\/api$/, '');

                const newSocket = io(socketUrl, {
                    auth: { token },
                    transports: ['websocket'],
                    reconnection: true,
                    reconnectionAttempts: 5,
                    reconnectionDelay: 1000,
                });

                newSocket.on('connect', () => {
                    console.log('Socket connected:', newSocket.id);
                    setIsConnected(true);
                    socket = newSocket;
                    resolve(newSocket);
                });

                newSocket.on('connect_error', (err) => {
                    console.error('Socket connection error:', err);
                    setIsConnected(false);
                    // Don't reject the promise immediately on first fail, 
                    // socket.io will retry based on config, but if it fails auth:
                    if (err.message === "Authentication error") reject(err);
                });

                newSocket.on('disconnect', (reason) => {
                    console.log('Socket disconnected:', reason);
                    setIsConnected(false);
                    socket = null;
                    connectionPromise = null;
                });
            });
        }

        return connectionPromise;
    };

    const disconnect = () => {
        if (socket) {
            socket.disconnect();
            socket = null;
            connectionPromise = null;
            setIsConnected(false);
        }
    };

    // Auto connect/disconnect based on auth state
    useEffect(() => {
        if (isAuthenticated && token) {
            connect();
        } else {
            disconnect();
        }

        return () => {
            // We usually don't want to disconnect on unmount of a single component
            // because the user might navigate to another page while staying logged in.
            // The socket persists across the SPA lifecycle.
        };
    }, [isAuthenticated, token]);

    return {
        socket,
        isConnected,
        connect,
        disconnect
    };
};
