/* JSON-LD (schema.org) builders. Pure functions: each returns a plain object
   that a page injects as <script type="application/ld+json">. Only the fields
   that the official site actually publishes are included — never invented
   coordinates or opening hours for destinations we don't have them for. */
import { SITE, u } from './site.js';

/** Organization — homepage. */
export function organization() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': u('/#organization'),
    name: SITE.name,
    url: u('/'),
    description: SITE.description,
    logo: SITE.ogImage,
    email: SITE.email,
    address: [
      { '@type': 'PostalAddress', addressCountry: 'ID', ...SITE.addressBandung },
      { '@type': 'PostalAddress', addressCountry: 'ID', streetAddress: SITE.addressJakarta.street, addressLocality: SITE.addressJakarta.locality, postalCode: SITE.addressJakarta.postalCode },
    ],
    sameAs: Object.values(SITE.social),
  };
}

/** TouristAttraction for each destination. */
export function touristAttraction(d, ratings = {}, locale = 'id') {
  const typeLabels = {
    id: { air: 'Wisata air', keluarga: 'Keluarga & edukasi', alam: 'Alam & pegunungan' },
    en: { air: 'Water tourism', keluarga: 'Family & education', alam: 'Nature & mountains' },
  };
  const node = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    '@id': u(`/destinasi/${d.id}#attraction`),
    name: d.name,
    url: u(`/destinasi/${d.id}`),
    description: d.desc,
    image: d.gallery[0],
    touristType: [typeLabels[locale]?.[d.type] ?? typeLabels.id[d.type]],
    isAccessibleForFree: false,
  };
  return node;
}

/** Hotel for each penginapan. */
export function hotel(h, ratings = {}) {
  const node = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    '@id': u(`/penginapan/${h.id}#hotel`),
    name: h.name,
    url: u(`/penginapan/${h.id}`),
    description: h.desc,
    image: h.rooms[0]?.img ?? h.img,
    address: { '@type': 'PostalAddress', streetAddress: h.area, addressCountry: 'ID' },
    amenityFeature: h.facilities.map(f => ({
      '@type': 'LocationFeatureSpecification',
      name: f,
    })),
  };
  return node;
}

/** BreadcrumbList for listing and detail pages. */
export function breadcrumbs(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: u(it.path),
    })),
  };
}