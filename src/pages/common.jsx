// Parts shared by the Curtains, Motorisation and Skylights pages. Same language as Blinds: slats, joined panes, single-line fields.
import { useState } from 'react';
import { PHONE, TEL } from '../site/Chrome';

export const ww = () => globalThis.WW;
export const inr = (n) => n.toLocaleString('en-IN');
export const UNITS = [['ft', 'feet'], ['in', 'inches'], ['cm', 'cm'], ['m', 'metres']];
export const UNIT_SHORT = { ft: 'ft', in: 'in', cm: 'cm', m: 'm' };
export const H2 = 'font-serif font-medium tracking-tight leading-[1.08] text-[2.25rem] sm:text-[2.75rem] lg:text-[3.5rem]';

// The menu on every inner page, so each new page is one click from the others.
export const LINKS = [['Blinds', 'blinds.html'], ['Curtains', 'curtains.html'], ['Motorisation', 'motorisation.html'], ['Skylights', 'skylights.html'], ['Prices', './#prices'], ['Our works', './#works'], ['Contact', '#visit']];
export const FOOT = [['Blinds', 'blinds.html'], ['Curtains', 'curtains.html'], ['Motorisation', 'motorisation.html'], ['Skylights', 'skylights.html'], ['Prices', './#prices']];

/* A photo with a 640px copy for phones. `dir` is the folder under img/; old 600px pictures pass small. */
export function Pic({ dir, id, alt, sizes = '(min-width: 1024px) 50vw, 100vw', eager, className = '', full = 1376, small }) {
  const base = `img/${dir ? dir + '/' : ''}${id}`;
  return (
    <img src={`${base}.webp`} srcSet={small ? undefined : `${base}-640.webp 640w, ${base}.webp ${full}w`} sizes={small ? undefined : sizes}
      alt={alt} width={small ? 600 : 1200} height={small ? 600 : 800} loading={eager ? 'eager' : 'lazy'} {...(eager ? { fetchpriority: 'high' } : {})} decoding="async" className={className} />
  );
}

/* Width, height, unit and how many: the same four fields as the Blinds price board. */
export function useSizeCheck(size, maxW = 60, maxH = 40) {
  const W = ww();
  const wFt = W.toFeet(size.w, size.unit); const hFt = W.toFeet(size.h, size.unit); const qty = Number(size.qty);
  const tooBig = wFt > maxW || hFt > maxH;
  const okQty = Number.isInteger(qty) && qty >= 1 && qty <= 200;
  const ok = wFt > 0 && hFt > 0 && !tooBig && okQty;
  const unitWord = UNITS.find((u) => u[0] === size.unit)[1];
  const err = !(wFt > 0 && hFt > 0) ? 'Enter both sizes to see prices.' : tooBig ? `That looks very large. Is the unit set to ${unitWord}?` : !okQty ? 'How many should be a whole number, 1 or more.' : null;
  return { wFt, hFt, qty, ok, unitWord, err };
}

export function SizeForm({ size, setSize, labels = ['Width', 'Height'], countLabel = 'How many' }) {
  const set = (k) => (e) => setSize({ ...size, [k]: e.target.value });
  return (
    <form className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-4 mb-3" onSubmit={(e) => e.preventDefault()}>
      <label className="text-sm font-semibold">{labels[0]}<input className="line-field line-field-light font-normal mt-1 tabular-nums" type="number" inputMode="decimal" min="0" step="any" value={size.w} onChange={set('w')} /></label>
      <label className="text-sm font-semibold">{labels[1]}<input className="line-field line-field-light font-normal mt-1 tabular-nums" type="number" inputMode="decimal" min="0" step="any" value={size.h} onChange={set('h')} /></label>
      <label className="text-sm font-semibold">Unit<select className="line-field line-field-light unit-select font-normal mt-1" value={size.unit} onChange={set('unit')}>{UNITS.map(([v, t]) => <option key={v} value={v}>{t}</option>)}</select></label>
      <label className="text-sm font-semibold">{countLabel}<input className="line-field line-field-light font-normal mt-1 tabular-nums" type="number" inputMode="numeric" min="1" step="1" value={size.qty} onChange={set('qty')} /></label>
    </form>
  );
}

export function ChoiceGroup({ legend, options, value, onChange }) {
  return (
    <fieldset className="border-0 p-0 m-0 mb-7">
      <legend className="font-semibold text-[1.0625rem] mb-3 p-0">{legend}</legend>
      <div className="choice-set">{options.map(([v, t]) => <button key={v} type="button" className="choice" aria-pressed={value === v} onClick={() => onChange(v)}>{t}</button>)}</div>
    </fieldset>
  );
}

/* Page top: breadcrumb, H1, a short promise, two actions, then the wide photo with this page's own reveal. */
export function Hero({ crumb, title, intro, primary, secondary, pic, alt, reveal }) {
  return (
    <section className="bg-sand">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-10 pt-5 lg:pt-7">
        <nav aria-label="Breadcrumb" className="text-[.9375rem] mb-4 lg:mb-5"><a href="./" className="line-link">Home</a> <span aria-hidden="true" className="mx-1.5">/</span> <span aria-current="page" className="font-medium">{crumb}</span></nav>
        <div className="grid lg:grid-cols-12 gap-x-10 gap-y-4 items-end pb-7 lg:pb-9">
          <h1 className="lg:col-span-8 font-serif font-medium tracking-tight text-[2.75rem] leading-[1.05] sm:text-[4rem] lg:text-[5rem] xl:text-[5.75rem]">{title}</h1>
          <div className="lg:col-span-4">
            <p className="text-[1.0625rem] sm:text-lg leading-relaxed mb-5">{intro}</p>
            <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
              <a href={primary[1]} className="slat-btn"><span>{primary[0]}</span><span aria-hidden="true">→</span></a>
              {secondary && <a href={secondary[1]} className="line-link font-semibold">{secondary[0]}</a>}
            </div>
          </div>
        </div>
      </div>
      <div className={`${reveal} bg-navy aspect-[4/3] sm:aspect-[16/8] lg:aspect-auto lg:h-[58vh] lg:min-h-[420px] overflow-hidden`}><Pic dir="pages" id={pic} alt={alt} sizes="100vw" eager className="w-full h-full object-cover" /></div>
    </section>
  );
}

export function Works({ videos, title, note }) {
  const [cur, setCur] = useState(0); const [playing, setPlaying] = useState(false);
  const [id, name] = videos[cur];
  return (
    <section id="works" className="bg-linen py-24 lg:py-32">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-x-8 gap-y-3 items-end mb-10">
          <h2 className={`rise lg:col-span-7 ${H2}`}>{title}</h2>
          <p className="rise lg:col-span-5 text-[1.0625rem] leading-relaxed">{note}</p>
        </div>
        <div className="panes lg:grid-cols-12">
          <div className="pane !bg-navy lg:col-span-8">
            <div className="relative aspect-video bg-navy">
              {playing ? <iframe className="absolute inset-0 w-full h-full" src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`} title={name} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
                : (
                  <button type="button" className="video-cover" onClick={() => setPlaying(true)} aria-label={`Play video: ${name}`}>
                    <img src={`img/yt-${id}.jpg`} alt="" width="480" height="360" loading="lazy" />
                    <span className="video-play" aria-hidden="true"><svg viewBox="0 0 24 24" width="28" height="28"><path d="M6 3l15 9-15 9z" fill="currentColor" /></svg></span>
                  </button>
                )}
            </div>
            <p className="text-white font-serif text-2xl font-medium p-5 lg:p-7">{name}</p>
          </div>
          <div className="pane !bg-navy lg:col-span-4">
            <div className="board h-full content-start">
              {videos.map(([vid, t], i) => (
                <button key={vid} type="button" className="board-row !grid-cols-[88px_1fr]" aria-pressed={i === cur} onClick={() => { setCur(i); setPlaying(false); }}>
                  <span className="board-pic !w-[88px] !h-[56px]"><img src={`img/yt-${vid}.jpg`} alt="" width="480" height="360" loading="lazy" /></span>
                  <span className="font-medium leading-snug">{t}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Faq({ items }) {
  return (
    <section id="faq" className="bg-sand py-20 lg:py-28">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-10 grid lg:grid-cols-12 gap-x-12 gap-y-8">
        <h2 className={`rise lg:col-span-4 ${H2}`}>Questions people ask</h2>
        <div className="lg:col-span-8">
          {items.map(([q, a]) => (
            <details key={q} className="faq">
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Visit({ title, text, cta, pic }) {
  const steps = [
    ['Catalogues at your door', 'See everything against your own wall colours before you order.'],
    ['Measured in front of you', 'Our team visits and takes every measurement with you there.'],
    ['Made by our own team', 'Processed and checked at our factory, then fitted and inspected at your home.'],
    ['No outlet costs', 'We don’t carry the cost of running an outlet, and that benefits you.'],
  ];
  return (
    <section id="visit" className="relative bg-navy text-white">
      <div className="absolute inset-0 pane-photo"><Pic dir="pages" id={pic} alt="" sizes="100vw" /></div>
      <div className="absolute inset-0 bg-navy/80" />
      <div className="relative max-w-[1440px] mx-auto px-4 lg:px-10 py-24 lg:py-32 grid lg:grid-cols-12 gap-x-12 gap-y-12">
        <div className="lg:col-span-6">
          <h2 className={`rise ${H2} mb-5`}>{title}</h2>
          <p className="rise text-[1.0625rem] leading-relaxed text-[#F4F1E9] max-w-xl mb-8">{text}</p>
          <div className="rise flex flex-wrap items-center gap-x-6 gap-y-4">
            <a href={cta[1]} className="slat-btn slat-btn-gold"><span>{cta[0]}</span><span aria-hidden="true">→</span></a>
            <a href={TEL} className="slat-btn slat-btn-light"><span>Call {PHONE}</span></a>
          </div>
          <address className="rise not-italic text-[.9375rem] leading-relaxed text-[#F4F1E9] mt-8">19, G.R.D Layout, A.A. Scheme Road, RS Puram, Coimbatore 641002</address>
        </div>
        <ul className="lg:col-span-6 list-none p-0 m-0 grid sm:grid-cols-2 gap-x-8 gap-y-7 content-center">
          {steps.map(([t, d]) => <li key={t} className="rise border-t-[3px] border-gold pt-3"><h3 className="font-semibold text-lg mb-1">{t}</h3><p className="text-[.9375rem] leading-relaxed text-[#F4F1E9]">{d}</p></li>)}
        </ul>
      </div>
    </section>
  );
}

/* Next pages, so a reader who came in on one product can reach the others. */
export function Related({ items }) {
  return (
    <section className="bg-linen py-20 lg:py-24">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-10">
        <h2 className={`rise ${H2} mb-10`}>Also from Window Works</h2>
        <div className="panes sm:grid-cols-3">
          {items.map(([t, d, href, pic, alt]) => (
            <a key={href} href={href} className="pane group no-underline">
              <div className="pane-photo blind aspect-[4/3]"><img src={pic} alt={alt} width="600" height="600" loading="lazy" decoding="async" /></div>
              <div className="p-6 lg:p-7">
                <h3 className="font-serif text-[1.75rem] font-medium leading-tight mb-2">{t}</h3>
                <p className="text-[1rem] leading-relaxed mb-3">{d}</p>
                <span className="line-link font-semibold text-[.9375rem]">See {t.toLowerCase()} →</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PreviewNote() {
  return <p className="bg-midnight text-white text-sm px-4 lg:px-10 py-2">Preview only. Rates are real starting rates, but nothing you enter reaches Window Works, and product advice is still to be checked by them.</p>;
}

export function PhoneBar({ priceHref = '#price', priceLabel = 'Price my window' }) {
  return (
    <div className="phone-bar">
      <a href={TEL} className="phone-bar-call">Call us</a>
      <a href={priceHref} className="phone-bar-price">{priceLabel}</a>
    </div>
  );
}

/* The size typed on any page is remembered, so the next page opens with it. */
export function rememberedSize(fallback) {
  const saved = ww().store.get('ww-size', null);
  if (saved && saved.w !== undefined && saved.h !== undefined && UNITS.some((u) => u[0] === saved.unit)) return { w: String(saved.w), h: String(saved.h), unit: saved.unit, qty: String(saved.qty || 1) };
  return fallback;
}

export function businessSchema() {
  return {
    '@type': 'LocalBusiness', name: 'Window Works', telephone: '+919159030465', email: 'admin@windowworks.in',
    address: { '@type': 'PostalAddress', streetAddress: '19, G.R.D Layout, A.A. Scheme Road, RS Puram', addressLocality: 'Coimbatore', addressRegion: 'Tamil Nadu', addressCountry: 'IN' },
  };
}
export const crumbSchema = (name, file) => ({ '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://windowworks.in/' }, { '@type': 'ListItem', position: 2, name, item: `https://windowworks.in/${file}` }] });
export const faqSchema = (items) => ({ '@type': 'FAQPage', mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });
