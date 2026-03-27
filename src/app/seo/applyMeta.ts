/** Updates document title and common SEO meta tags (SPA shell). */
export function applyPageMeta(opts: {
  title: string;
  description: string;
  canonicalHref: string;
}) {
  document.title = opts.title;
  const set = (selector: string, attr: string, value: string) => {
    const el = document.querySelector<HTMLMetaElement | HTMLLinkElement>(selector);
    if (el) el.setAttribute(attr, value);
  };
  set('meta[name="description"]', 'content', opts.description);
  set('link[rel="canonical"]', 'href', opts.canonicalHref);
  set('meta[property="og:url"]', 'content', opts.canonicalHref);
  set('meta[property="og:title"]', 'content', opts.title);
  set('meta[property="og:description"]', 'content', opts.description);
  set('meta[name="twitter:title"]', 'content', opts.title);
  set('meta[name="twitter:description"]', 'content', opts.description);
}
