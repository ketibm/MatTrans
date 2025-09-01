import React from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";

const Seo = ({ title, description, image = "/logo1.png", lang = "en" }) => {
  const location = useLocation();
  const baseUrl = "https://www.mat-trans.mk";

  const url =
    lang === "mk"
      ? location.pathname === "/"
        ? `${baseUrl}/`
        : `${baseUrl}${location.pathname}`
      : location.pathname === "/"
      ? `${baseUrl}/en/`
      : `${baseUrl}/en${location.pathname}`;

  const hreflangs = [
    {
      href: baseUrl + (location.pathname === "/" ? "/" : location.pathname),
      lang: "mk",
    },
    {
      href:
        baseUrl +
        (location.pathname === "/" ? "/en/" : `/en${location.pathname}`),
      lang: "en",
    },
  ];

  return (
    <Helmet htmlAttributes={{ lang }}>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <link rel="canonical" href={url} />

      {hreflangs.map((h) => (
        <link key={h.lang} rel="alternate" href={h.href} hrefLang={h.lang} />
      ))}

      <script type="application/ld+json">
        {`
        {
          "@context": "https://schema.org",
          "@type": "TransportService",
          "name": "MAT-TRANS",
          "description": "${description}",
          "areaServed": "North Macedonia",
          "provider": {
            "@type": "Organization",
            "name": "MAT-TRANS DOOEL"
          }
        }
        `}
      </script>
    </Helmet>
  );
};

export default Seo;
