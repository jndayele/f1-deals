import { useEffect } from "react";

/**
 * SEO component — dynamically sets <title>, <meta> tags, and Open Graph/Twitter Card
 * tags for every page. Call it at the top of each page component.
 */
export default function SEO({
  title,
  description,
  canonicalPath = "",
  ogImage = "/og-default.png",
  type = "website",
  noIndex = false,
}) {
  const siteUrl = "https://f1deals.com"; // Update to your production domain
  const fullTitle = title
    ? `${title} | F1 Deals Ghana`
    : "F1 Deals — Ghana's Premier Car Broker";
  const canonical = `${siteUrl}${canonicalPath}`;

  useEffect(() => {
    // Title
    document.title = fullTitle;

    const setMeta = (selector, attr, value) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        const [key, val] = selector.replace("meta[", "").replace("]", "").split("=");
        el.setAttribute(key.trim(), val.replace(/"/g, ""));
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    // Standard meta
    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[name="robots"]', "content", noIndex ? "noindex,nofollow" : "index,follow");

    // Open Graph
    setMeta('meta[property="og:title"]', "content", fullTitle);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:type"]', "content", type);
    setMeta('meta[property="og:url"]', "content", canonical);
    setMeta('meta[property="og:image"]', "content", `${siteUrl}${ogImage}`);
    setMeta('meta[property="og:site_name"]', "content", "F1 Deals Ghana");
    setMeta('meta[property="og:locale"]', "content", "en_GH");

    // Twitter Card
    setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "content", fullTitle);
    setMeta('meta[name="twitter:description"]', "content", description);
    setMeta('meta[name="twitter:image"]', "content", `${siteUrl}${ogImage}`);

    // Canonical link
    let canonical_el = document.querySelector('link[rel="canonical"]');
    if (!canonical_el) {
      canonical_el = document.createElement("link");
      canonical_el.setAttribute("rel", "canonical");
      document.head.appendChild(canonical_el);
    }
    canonical_el.setAttribute("href", canonical);
  }, [fullTitle, description, canonical, ogImage, type, noIndex]);

  return null;
}
