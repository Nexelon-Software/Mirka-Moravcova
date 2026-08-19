export function SiteFooter() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        padding: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          fontSize: "0.65rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--muted-foreground)",
        }}
      >
        <span>© {new Date().getFullYear()} Mirka Moravcová</span>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          {["Instagram", "LinkedIn", "Behance"].map((network) => (
            <a key={network} href="#" style={{ color: "inherit", textDecoration: "none" }}>
              {network}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
