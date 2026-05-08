import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/login`, {
                        email: credentials?.email,
                        password: credentials?.password,
                    });

                    if (res.data && res.data.user) {
                        return {
                            ...res.data.user,
                            accessToken: res.data.token,
                        };
                    }
                    return null;
                } catch (error) {
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "google") {
                try {
                    // Sync Google user with backend
                    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/register`, {
                        name: user.name,
                        email: user.email,
                        password: `google_${user.id}`, // Placeholder password for social users
                        role: "USER", // Default role
                        profileImage: user.image
                    });

                    if (res.data && res.data.user) {
                        user.role = res.data.user.role;
                        user.accessToken = res.data.token;
                        user.id = res.data.user.id;
                        (user as any).profileImage = res.data.user.profileImage;
                    }
                    return true;
                } catch (error: any) {
                    // If user already exists, just login
                    if (error.response?.status === 400) {
                        try {
                            const loginRes = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/login`, {
                                email: user.email,
                                password: `google_${user.id}`,
                                profileImage: user.image
                            });
                            if (loginRes.data && loginRes.data.user) {
                                user.role = loginRes.data.user.role;
                                user.accessToken = loginRes.data.token;
                                user.id = loginRes.data.user.id;
                                (user as any).profileImage = loginRes.data.user.profileImage;
                            }
                            return true;
                        } catch (loginErr) {
                            return false;
                        }
                    }
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.role = user.role;
                token.accessToken = user.accessToken;
                token.id = user.id as any;
                token.profileImage = (user as any).profileImage;
            }
            
            // Handle session updates from the client (e.g. role change)
            if (trigger === "update" && session?.role) {
                token.role = session.role;
            }
            if (trigger === "update" && session?.name) {
                token.name = session.name;
            }
            if (trigger === "update" && session?.image) {
                token.profileImage = session.image;
            }

            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.role = token.role;
                session.user.accessToken = token.accessToken;
                session.user.id = token.id as any;
                (session.user as any).profileImage = (token as any).profileImage;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60, // 7 days
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
