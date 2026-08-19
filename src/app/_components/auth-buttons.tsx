"use client";

import { authClient } from "~/server/better-auth/client";

const buttonStyle = {
  fontSize: "0.6rem",
  letterSpacing: "0.14em",
  textTransform: "uppercase" as const,
  padding: "0.3rem 0.75rem",
  border: "1px solid oklch(85% 0.012 80)",
  borderRadius: "2px",
  background: "transparent",
  color: "var(--muted-foreground)",
  cursor: "pointer",
};

export function SignInButton() {
  return (
    <button
      type="button"
      onClick={() =>
        void authClient.signIn.social({
          provider: "google",
          callbackURL: "/",
        })
      }
      style={buttonStyle}
    >
      Prihlásiť
    </button>
  );
}

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() =>
        void authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              window.location.href = "/";
            },
          },
        })
      }
      style={buttonStyle}
    >
      Odhlásiť
    </button>
  );
}
