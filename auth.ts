import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const cookieDomain = process.env.AUTH_COOKIE_DOMAIN || undefined;
const useSecureCookie = process.env.NODE_ENV === "production";
const authSecret = process.env.AUTH_SECRET || (process.env.NODE_ENV === "production" ? undefined : "local-jimmyyao-home-dev-secret");
const providers = process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
  ? [
      Google({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET
      })
    ]
  : [];

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: authSecret,
  providers,
  session: {
    strategy: "jwt"
  },
  cookies: {
    sessionToken: {
      name: useSecureCookie ? "__Secure-authjs.session-token" : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookie,
        domain: cookieDomain
      }
    }
  },
  callbacks: {
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }

      return session;
    }
  }
});
