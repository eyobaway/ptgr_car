import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    console.log("Auth: Missing credentials");
                    return null;
                }

                try {
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                    console.log("Auth: Attempting login at", `${apiUrl}/api/auth/login`);

                    // Added AbortController to prevent hanging indefinitely
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

                    const response = await fetch(`${apiUrl}/api/auth/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                        signal: controller.signal
                    });

                    clearTimeout(timeoutId);

                    if (!response.ok) {
                        const errorData = await response.text().catch(() => "No response body");
                        console.error(`Auth: Backend returned status ${response.status}: ${errorData}`);
                        return null;
                    }

                    const data = await response.json();
                    console.log("Auth: Login successful for", data.user?.email || credentials.email);

                    if (data.token) {
                        return {
                            id: data.user?.id || 'system-admin',
                            email: data.user?.email || credentials.email,
                            name: data.user?.name || 'Admin',
                            role: data.user?.role || 'ADMIN',
                            token: data.token,
                        };
                    }
                    
                    console.error("Auth: No token in response data");
                    return null;
                } catch (error: any) {
                    if (error.name === 'AbortError') {
                        console.error("Auth: Fetch timed out after 10s");
                    } else {
                        console.error("Auth fetch failed:", error.message || error);
                    }
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.jwt = user.token;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }: any) {
            if (session.user) {
                (session.user as any).role = token.role;
            }
            (session as any).jwt = token.jwt;
            return session;
        }
    },
    pages: {
        signIn: '/login',
    },
    secret: process.env.NEXTAUTH_SECRET || "ptgr_admin_super_secret_key_123456789", // Use a more consistent fallback
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
