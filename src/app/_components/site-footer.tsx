import { NexelonCredit } from "~/app/_components/nexelon-credit";
import { SOCIAL_LINKS } from "~/lib/social";

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
        <div style={{ display: "grid", gap: "0.5rem" }}>
          <span>© {new Date().getFullYear()} Mirka Moravcová</span>
          <NexelonCredit />
        </div>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          {SOCIAL_LINKS.map((network) => (
            <a
              key={network.label}
              href={network.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              {network.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
