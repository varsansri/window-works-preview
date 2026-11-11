// Used only at build time, to put each page's real text into its HTML for search engines.
import { renderToString } from 'react-dom/server';
import BlindsPage from './pages/BlindsPage.jsx';
import CurtainsPage from './pages/CurtainsPage.jsx';
import MotorisationPage, { faqs as motorFaqs } from './pages/MotorisationPage.jsx';
import SkylightsPage, { SKY, faqs as skyFaqs } from './pages/SkylightsPage.jsx';
import { faqs } from './pages/blinds-data';
import { faqs as curtainFaqs } from './pages/curtains-data';
import { businessSchema, crumbSchema, faqSchema } from './pages/common';

const offers = (name, items, unitText) => ({
  '@type': 'OfferCatalog', name,
  itemListElement: items.map((b) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: b.name }, priceSpecification: { '@type': 'UnitPriceSpecification', price: b.rate, priceCurrency: 'INR', unitText } })),
});

function blindsSchema() {
  const WW = globalThis.WW;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      crumbSchema('Blinds', 'blinds.php'),
      { '@type': 'Service', name: 'Made-to-measure window blinds', areaServed: 'Coimbatore', provider: businessSchema(), hasOfferCatalog: offers('Window blinds', WW.DEFAULTS.blinds, 'per sq ft, before GST') },
      faqSchema(faqs(WW.DEFAULTS.settings)),
    ],
  };
}

function curtainsSchema() {
  const D = globalThis.WW.DEFAULTS;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      crumbSchema('Curtains', 'curtains.php'),
      { '@type': 'Service', name: 'Made-to-measure curtains', areaServed: 'Coimbatore', provider: businessSchema(), hasOfferCatalog: offers('Curtains', D.curtains, 'per metre, before GST') },
      faqSchema(curtainFaqs(D.settings, D.curtains)),
    ],
  };
}

function motorSchema() {
  const D = globalThis.WW.DEFAULTS;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      crumbSchema('Motorisation', 'motorisation.php'),
      { '@type': 'Service', name: 'Motorised curtains and blinds', areaServed: 'Coimbatore', provider: businessSchema(), offers: { '@type': 'Offer', name: 'Curtain motor', priceSpecification: { '@type': 'PriceSpecification', minPrice: D.settings.motorFrom, priceCurrency: 'INR', valueAddedTaxIncluded: false } } },
      faqSchema(motorFaqs(D.settings, D.curtains.find((c) => c.id === 'motorised').rate)),
    ],
  };
}

function skySchema() {
  const D = globalThis.WW.DEFAULTS;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      crumbSchema('Skylights', 'skylights.php'),
      { '@type': 'Service', name: 'Skylight shades and pergola shades', areaServed: 'Coimbatore', provider: businessSchema(), hasOfferCatalog: offers('Skylights and pergola shades', SKY.filter((s) => s.rate), 'per sq ft, before GST') },
      faqSchema(skyFaqs(D.settings)),
    ],
  };
}

export const PAGES = {
  'blinds.html': { render: () => renderToString(<div><BlindsPage /></div>), schema: blindsSchema },
  'curtains.html': { render: () => renderToString(<div><CurtainsPage /></div>), schema: curtainsSchema },
  'motorisation.html': { render: () => renderToString(<div><MotorisationPage /></div>), schema: motorSchema },
  'skylights.html': { render: () => renderToString(<div><SkylightsPage /></div>), schema: skySchema },
};
