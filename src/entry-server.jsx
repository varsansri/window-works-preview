// Used only at build time, to put each page's real text into its HTML for search engines.
import { renderToString } from 'react-dom/server';
import BlindsPage from './pages/BlindsPage.jsx';
import { faqs } from './pages/blinds-data';

function blindsSchema() {
  const WW = globalThis.WW;
  const business = {
    '@type': 'LocalBusiness', name: 'Window Works', telephone: '+919159030465', email: 'admin@windowworks.in',
    address: { '@type': 'PostalAddress', streetAddress: '19, G.R.D Layout, A.A. Scheme Road, RS Puram', addressLocality: 'Coimbatore', addressRegion: 'Tamil Nadu', addressCountry: 'IN' },
  };
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://windowworks.in/' }, { '@type': 'ListItem', position: 2, name: 'Blinds', item: 'https://windowworks.in/blinds.php' }] },
      { '@type': 'Service', name: 'Made-to-measure window blinds', areaServed: 'Coimbatore', provider: business, hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Window blinds', itemListElement: WW.DEFAULTS.blinds.map((b) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: b.name }, priceSpecification: { '@type': 'UnitPriceSpecification', price: b.rate, priceCurrency: 'INR', unitText: 'per sq ft, before GST' } })) } },
      { '@type': 'FAQPage', mainEntity: faqs(WW.DEFAULTS.settings).map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    ],
  };
}

export const PAGES = {
  'blinds.html': { render: () => renderToString(<div><BlindsPage /></div>), schema: blindsSchema },
};
