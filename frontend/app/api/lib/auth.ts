import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { AuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_Url}/api/user/login`,
            {
              email: credentials.email,
              password: credentials.password,
            }
          );

          if (response.status === 201) {
            return {
              id: response.data?.id.toString(),
              email: response.data.email,
            };
          }
          return null;
        } catch (error: unknown) {
          console.error("Credentials login error:", error);
          return null;
        }
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET || "secret",

  pages: {
    signIn: "/login",
    error: "/login?error=authentication",
  },

  cookies: {
  sessionToken: {
    name:
      process.env.NODE_ENV === "production"
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
    options: {
      httpOnly: true,
      sameSite: "none",                     // required for cross-site
      secure: process.env.NODE_ENV === "production", // true on Vercel (HTTPS)
      path: "/",
    },
  },
},


  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "credentials") return true;

      if (["google", "facebook", "github"].includes(account?.provider ?? "")) {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_Url}/api/user/${user.email}`
          );

          if (response.status === 201) return true;
        } catch (error: unknown) {
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            try {
              const registerResponse = await axios.post(
                `${process.env.NEXT_PUBLIC_Url}/api/user/register`,
                {
                  email: user.email,
                  name: user.name || "",
                  password: null,
                  image: user.image || "",
                }
              );
              return registerResponse.status === 201;
            } catch (registerError: unknown) {
              console.error("Social registration error:", registerError);
              return false;
            }
          }
          console.error("Social login error:", error);
        }
      }

      return false;
    },

    async jwt({ token, user, account }) {
      if (account?.provider === "credentials" && user?.id) {
        token.userId = user.id;
        token.email = user.email;
      }

      if (
        ["google", "facebook", "github"].includes(account?.provider ?? "") &&
        user?.email
      ) {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_Url}/api/user/${user.email}`
          );

          if (response.status === 201) {
            token.userId = response.data.id;
          }
        } catch (error: unknown) {
          console.error("JWT callback error:", error);
        }
      }

      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.email = String(token.email);
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  debug: process.env.NODE_ENV === "development",
};
