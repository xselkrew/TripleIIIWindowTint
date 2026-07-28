export const SITE_ORIGIN = 'https://www.cartintfortworth.com';

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: new URL(item.path, SITE_ORIGIN).href,
    })),
  };
}

export function webPageSchema(type: string, name: string, description: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': `${new URL(path, SITE_ORIGIN).href}#webpage`,
    name,
    description,
    url: new URL(path, SITE_ORIGIN).href,
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${SITE_ORIGIN}/#website`,
      name: 'Triple III Window Tint',
      url: `${SITE_ORIGIN}/`,
    },
    about: { '@id': `${SITE_ORIGIN}/#business` },
  };
}
