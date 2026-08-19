export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SERVER_URL ??
    process.env.BETTER_AUTH_URL ??
    "http://localhost:3000"
  );
}
