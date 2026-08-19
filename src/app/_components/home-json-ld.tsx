import { SOCIAL_LINKS } from "~/lib/social";
import { getSiteUrl } from "~/lib/site";

export function HomeJsonLd() {
  const siteUrl = getSiteUrl();
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        name: "Mirka Moravcová",
        jobTitle: "Interiérový dizajn",
        email: "mailto:mirka.moravcova@email.com",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Brno",
          addressCountry: "CZ",
        },
        sameAs: SOCIAL_LINKS.map((link) => link.href),
        url: siteUrl,
      },
      {
        "@type": "WebSite",
        name: "Mirka Moravcová — Interiérový dizajn",
        url: siteUrl,
        inLanguage: "sk",
        creator: {
          "@type": "Organization",
          name: "Nexelon s.r.o.",
          url: "https://nexelon.sk/",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
