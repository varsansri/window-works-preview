import { useEffect, useRef, useState } from 'react';
import SplitText from './bits/SplitText';
import CountUp from './bits/CountUp';
import { useSiteMotion, useSmoothScroll } from './useSiteMotion';
import { RATES } from './data';

// Design preview: only the interface works. Nothing is calculated, saved or sent.
const PHONE = '+91 91590 30465';
const TEL = '#';
const inr = (n) => n.toLocaleString('en-IN');

const VIDEOS = [
  ['AIU1LYDOvPY', 'Jumbo Roman blinds'],
  ['L4cqZRJlWSI', 'Motorised patio blinds'],
  ['N9EtkCqD3KQ', 'Weatherproof zipper blinds'],
  ['n2h3RbdLkhE', 'Terrace skylight blinds'],
  ['F3_9vdSg7_s', 'Quality check at our factory'],
  ['Ruzhotl_yUw', 'Honeycomb blinds'],
];
const GALLERY = [
  ['p-arched', 'Tall arched windows with full-length curtains', 'Full-length curtains for tall arched windows'],
  ['p-zebra-close', 'Zebra blinds with blue curtains on a city-view window', 'Zebra blinds layered with curtains'],
  ['p-roman', 'Linen Roman blinds on a sunlit window', 'Roman blinds in soft linen'],
  ['p-bedroom', 'Zebra and wooden blinds in a bedroom', 'Zebra and wooden blinds in one room'],
  ['p-living', 'Sheer curtains in a bright living room', 'Sheers for a bright living room'],
];
function Heading({ text, className = '', align = 'left' }) {
  return <SplitText tag="h2" text={text} splitType="words" textAlign={align} delay={45} duration={0.9} rootMargin="-40px" className={`font-serif font-medium tracking-tight leading-[1.08] text-[2.25rem] sm:text-[2.75rem] lg:text-[3.5rem] ${className}`} />;
}

function Swatch({ className = '' }) {
  return (
    <svg viewBox="0 0 400 400" className={className} role="img" aria-label="Royal blue and ivory fabric" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sw-blue" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#0A2B8C" /><stop offset=".45" stopColor="#1642C4" /><stop offset=".7" stopColor="#0B2559" /><stop offset="1" stopColor="#1642C4" /></linearGradient>
        <linearGradient id="sw-ivory" x1="0" y1="0" x2="1" y2=".6"><stop offset="0" stopColor="#FBF3DF" /><stop offset=".5" stopColor="#E4CFA4" /><stop offset="1" stopColor="#FFF9EA" /></linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#sw-blue)" />
      <path d="M210 0C250 70 180 120 190 190c10 72 96 92 90 210h120V0z" fill="url(#sw-ivory)" />
      <path d="M210 0C250 70 180 120 190 190c10 72 96 92 90 210" fill="none" stroke="#D4AF37" strokeWidth="5" />
      <path d="M70 0c40 90-30 150 10 240 26 58 74 90 70 160" fill="none" stroke="#fff" strokeOpacity=".13" strokeWidth="22" />
      <path d="M320 0c-34 90 24 130-6 220-18 56-8 120 6 180" fill="none" stroke="#9E7B32" strokeOpacity=".2" strokeWidth="26" />
    </svg>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const links = [['Products', '#collections'], ['Prices', '#prices'], ['Gallery', '#gallery'], ['Motorisation', '#motorisation'], ['Our works', '#works'], ['Contact', '#contact']];
  return (
    <header className="sticky top-0 z-50 bg-linen border-b-[3px] border-navy">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-10 flex items-stretch gap-6 h-[68px]">
        <a href="./" className="bg-brand px-3 flex items-center shrink-0"><img src="img/logo-white.png" width="520" height="324" alt="Window Works" className="h-[54px] w-auto" /></a>
        <nav aria-label="Main" className="hidden xl:flex items-center gap-7 text-[.9375rem] font-medium ml-2">
          {links.map(([t, h]) => <a key={h} href={h} className="line-link">{t}</a>)}
        </nav>
        <div className="flex items-center gap-4 ml-auto">
          <a href={TEL} className="hidden md:inline-block line-link font-semibold text-[.9375rem] tabular-nums">{PHONE}</a>
          <a href={TEL} className="md:hidden font-semibold px-1 py-3">Call</a>
          <a href="estimate.html" className="slat-btn !py-3 hidden sm:inline-flex"><span>Get a rough price</span></a>
          <button type="button" className="xl:hidden font-semibold px-1 py-3 underline underline-offset-4 decoration-2 decoration-gold" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}</button>
        </div>
      </div>
      {open && (
        <nav aria-label="Mobile" className="xl:hidden bg-linen border-t border-rule px-4 py-3 grid gap-1 text-lg font-medium">
          {links.map(([t, h]) => <a key={h} href={h} className="py-2.5" onClick={() => setOpen(false)}>{t}</a>)}
          <a href={TEL} className="py-2.5 font-semibold">Call {PHONE}</a>
          <a href="estimate.html" className="slat-btn mt-2 w-full">Get a rough price</a>
        </nav>
      )}
    </header>
  );
}

function ArchWindow() {
  return (
    <div className="relative w-full max-w-[470px] mx-auto">
      <div className="relative bg-white p-[10px] arch ring-[3px] ring-navy">
        <div className="relative overflow-hidden arch aspect-[4/5] bg-navy">
          <img src="img/p-arched.webp" width="1376" height="768" alt="Tall arched windows with full-length curtains" className="hero-photo w-full h-full object-cover" fetchPriority="high" />
          <div className="absolute inset-y-0 left-1/2 w-[6px] -ml-[3px] bg-white/90 z-[1]" />
          <div className="absolute inset-x-0 top-[33%] h-[6px] bg-white/90 z-[1]" />
          <div className="absolute inset-x-0 top-[66%] h-[6px] bg-white/90 z-[1]" />
          <div className="curtain curtain-l" /><div className="curtain curtain-r" />
        </div>
      </div>
      <div className="h-4 bg-navy -mx-5 relative" aria-hidden="true" />
      <div className="hero-pane absolute -left-6 sm:-left-16 bottom-16 w-28 sm:w-40 bg-white p-[6px] ring-[3px] ring-navy z-10"><Swatch className="block w-full aspect-square" /></div>
      <div className="hero-pane absolute -right-3 sm:-right-14 top-[38%] w-32 sm:w-44 bg-white p-[6px] ring-[3px] ring-navy z-10"><img src="img/p-zebra-close.webp" width="1200" height="896" alt="Zebra blinds with blue curtains" className="block w-full aspect-square object-cover" /></div>
    </div>
  );
}

function QuickEstimate({ rates }) {
  return (
    <div className="hero-rise relative z-20 bg-soft cut-corner p-6 lg:p-9">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-2 mb-6">
        <h2 className="font-serif text-[1.75rem] leading-tight font-medium">Get a rough price for your window</h2>
        <p className="text-[.9375rem] text-muted lg:pr-10">Starting rates, before GST. We fix the final price after measuring at your home.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-[1fr_1.5fr_.7fr_.7fr_auto] gap-x-5 gap-y-5 items-end">
        <label className="text-sm font-semibold col-span-2 lg:col-span-1">Product
          <select className="line-field font-normal mt-1"><option>Blinds</option><option>Curtains</option></select>
        </label>
        <label className="text-sm font-semibold col-span-2 lg:col-span-1">Style
          <select className="line-field font-normal mt-1" defaultValue="Roller blinds, from ₹80 per sq ft">{rates.blinds.map((x) => <option key={x.id}>{x.name}, from ₹{inr(x.rate)} per sq ft</option>)}</select>
        </label>
        <label className="text-sm font-semibold">Width (feet)<input className="line-field font-normal mt-1" inputMode="decimal" defaultValue="5" /></label>
        <label className="text-sm font-semibold">Height (feet)<input className="line-field font-normal mt-1" inputMode="decimal" defaultValue="6" /></label>
        <a href="estimate.html" className="slat-btn col-span-2 lg:col-span-1 w-full lg:w-auto"><span>See my rough price</span><span aria-hidden="true">→</span></a>
      </div>
    </div>
  );
}

function Hero({ rates }) {
  return (
    <section className="hero-section relative overflow-hidden bg-sand">
      <img src="img/p-living.webp" alt="" width="1376" height="768" className="absolute inset-0 w-full h-full object-cover opacity-[.13]" />
      <div className="relative max-w-[1440px] mx-auto px-4 lg:px-10 pt-10 lg:pt-14 pb-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-6 xl:col-span-7">
            <p className="hero-rise font-semibold text-gold-ink mb-5">RS Puram, Coimbatore, since 2015</p>
            <h1 className="hero-title font-serif font-medium tracking-tight text-[2.5rem] leading-[1.08] sm:text-6xl lg:text-[4.5rem] xl:text-[5.25rem] mb-7">
              Made-to-measure <em className="text-[#A87F3F]">curtains</em> &amp; blinds for your home
            </h1>
            <p className="hero-rise text-[1.0625rem] sm:text-lg leading-relaxed text-muted max-w-[34rem] mb-8">Tell us your window size and see a rough price straight away. Then we bring the catalogues to your home and measure in front of you.</p>
            <div className="hero-rise flex flex-wrap items-center gap-x-7 gap-y-3">
              <a href="estimate.html" className="slat-btn"><span>Get a rough price</span><span aria-hidden="true">→</span></a>
              <a href="#prices" className="line-link font-semibold">See all prices</a>
            </div>
          </div>
          <div className="lg:col-span-6 xl:col-span-5 px-5 sm:px-16 lg:px-10"><ArchWindow /></div>
        </div>
        <div className="mt-14"><QuickEstimate rates={rates} /></div>
      </div>
    </section>
  );
}

function PhotoCard({ item, img, alt, cat, dark, label, wide }) {
  const unit = cat === 'blinds' ? 'sq ft' : 'metre';
  return (
    <article className={`pane ${dark ? '!bg-navy text-white' : ''} ${wide ? 'md:max-lg:col-span-2' : ''}`}>
      {img && (
        <div className="pane-photo blind relative aspect-[16/11]">
          <img src={`img/${img}.webp`} alt={alt} width="1200" height="896" loading="lazy" />
          {label && <span className="tag tag-gold absolute top-0 left-0">{label}</span>}
        </div>
      )}
      <div className="p-6 lg:p-7 flex flex-col flex-1">
        <div className="flex items-baseline justify-between gap-4 mb-3">
          <h3 className="font-serif text-2xl font-medium leading-tight">{item.name}</h3>
          <p className={`shrink-0 font-bold text-[.9375rem] tabular-nums ${dark ? 'text-gold-light' : ''}`}>₹{inr(item.rate)}<span className="font-medium"> / {unit}</span></p>
        </div>
        <p className={`text-[.9375rem] leading-relaxed flex-1 ${dark ? 'text-[#E8E3D6]' : 'text-muted'}`}>{item.desc}</p>
        <a href="estimate.html" className={`line-link font-semibold text-[.9375rem] mt-5 self-start ${dark ? 'text-gold-light' : ''}`}>Price my window →</a>
      </div>
    </article>
  );
}

function Collections({ rates }) {
  const b = (id) => rates.blinds.find((x) => x.id === id);
  return (
    <section id="collections" className="bg-linen pt-24 lg:pt-32">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-6 mb-12 items-end">
          <Heading text="Blinds and curtains, made to your window" className="lg:col-span-8" />
          <p className="rise lg:col-span-4 text-[1.0625rem] leading-relaxed text-muted">The prices shown are our starting rates before GST. Your fabric and fittings decide the final figure.</p>
        </div>
        <div className="panes md:grid-cols-2 lg:grid-cols-3">
          <PhotoCard item={b('roller')} img="p-living" alt="A bright living room with soft window coverings" cat="blinds" />
          <PhotoCard item={b('zebra')} img="p-bedroom" alt="Zebra blinds in a bedroom with garden views" cat="blinds" dark label="Light and privacy in one" />
          <PhotoCard item={b('roman')} img="p-roman" alt="Linen Roman blinds on a sunlit window" cat="blinds" wide />
          <PhotoCard item={b('venetian')} cat="blinds" />
          <PhotoCard item={b('wooden')} cat="blinds" />
          <PhotoCard item={b('vertical')} cat="blinds" wide />
        </div>
      </div>
    </section>
  );
}

function Row({ name, value, href }) {
  return (
    <li className="rise">
      <a href={href} className="group flex items-baseline justify-between gap-4 py-3 border-b border-rule no-underline hover:border-navy transition-colors">
        <span className="font-medium group-hover:text-brand transition-colors">{name}</span>
        <span className="font-semibold tabular-nums whitespace-nowrap">{value}</span>
      </a>
    </li>
  );
}

function Prices({ rates }) {
  return (
    <section id="prices" className="mt-24 lg:mt-32 bg-sand py-20 lg:py-28">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-10">
        <Heading text="Every starting price" className="mb-12" />
        <div className="grid lg:grid-cols-12 gap-x-12 gap-y-14">
          <div className="lg:col-span-5">
            <h3 className="rail pt-3 font-serif text-2xl font-medium mb-2">Blinds, per sq ft</h3>
            <ul>{rates.blinds.map((p) => <Row key={p.id} name={p.name} value={`₹${inr(p.rate)}`} href="estimate.html" />)}</ul>
          </div>
          <div className="lg:col-span-4">
            <h3 className="rail pt-3 font-serif text-2xl font-medium mb-2">Curtains, per metre</h3>
            <ul>{rates.curtains.map((p) => <Row key={p.id} name={p.name} value={p.motor ? `₹${inr(p.rate)} + motor` : `₹${inr(p.rate)}`} href="estimate.html" />)}</ul>
          </div>
          <div className="lg:col-span-3">
            <h3 className="rail pt-3 font-serif text-2xl font-medium mb-2">Priced after a visit</h3>
            <ul><Row name="Skylights" value="Ask us" href="#contact" /><Row name="Insect screens" value="Ask us" href="#contact" /></ul>
            <p className="rise text-[.9375rem] text-muted mt-4 leading-relaxed">All prices are before GST. Motors for curtains start from ₹{inr(rates.settings.motorFrom)} plus GST.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureDuo({ rates }) {
  const sheers = rates.curtains.find((x) => x.id === 'sheers');
  const eyelet = rates.curtains.find((x) => x.id === 'eyelet');
  return (
    <section id="motorisation" className="grid lg:grid-cols-12">
      <div className="lg:col-span-7 bg-[#FFFDF7] grid sm:grid-cols-2">
        <div className="blind min-h-[300px] relative overflow-hidden"><Swatch className="absolute inset-0 w-full h-full" /><span className="tag tag-gold absolute top-0 left-0">Royal blue × ivory</span></div>
        <div className="p-7 lg:p-12 flex flex-col justify-center">
          <h2 className="rise font-serif text-[2rem] lg:text-[2.5rem] font-medium leading-[1.1] mb-4">Fabric printed to your choice</h2>
          <p className="rise text-[1.0625rem] leading-relaxed text-muted mb-6">Curtains, sheers and blinds printed to your own theme, with a range of designs to match your room.</p>
          <dl className="rise text-[.9375rem]">
            <div className="flex justify-between gap-4 py-2.5 border-t border-rule"><dt>Sheers, from</dt><dd className="font-bold tabular-nums">₹{inr(sheers.rate)} / metre</dd></div>
            <div className="flex justify-between gap-4 py-2.5 border-y border-rule"><dt>Curtains, from</dt><dd className="font-bold tabular-nums">₹{inr(eyelet.rate)} / metre</dd></div>
          </dl>
        </div>
      </div>
      <div className="lg:col-span-5 bg-navy text-white flex flex-col">
        <div className="pane-photo blind aspect-[16/8]"><img src="img/p-motor.webp" width="1024" height="1024" loading="lazy" alt="A curtain track with a motor, hidden in a ceiling cove" /></div>
        <div className="p-7 lg:p-12 flex-1 flex flex-col">
          <h2 className="rise font-serif text-[2rem] lg:text-[2.5rem] font-medium leading-[1.1] mb-4">Curtains that open at a touch</h2>
          <p className="rise text-[1.0625rem] leading-relaxed text-[#E8E3D6] mb-7">Motors start from <strong className="text-gold-light">₹{inr(rates.settings.motorFrom)}</strong> plus GST. Open and close your curtains by remote.</p>
          <a href="estimate.html" className="rise slat-btn slat-btn-gold self-start mt-auto"><span>Price motorised curtains</span><span aria-hidden="true">→</span></a>
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section id="gallery" className="gallery-section bg-linen overflow-hidden py-20 lg:py-0 lg:h-[calc(100vh-72px)] lg:flex lg:flex-col lg:justify-center">
      <div className="max-w-[1440px] w-full mx-auto px-4 lg:px-10">
        <Heading text="Ideas for every room" className="mb-8 lg:mb-10" />
      </div>
      <div className="px-4 lg:px-10 overflow-hidden lg:overflow-visible">
        <div className="gallery-track w-full">
          {GALLERY.map(([src, alt, cap]) => (
            <figure key={src} className="shrink-0 w-[82vw] sm:w-[58vw] lg:w-[52vh] xl:w-[62vh] m-0">
              <div className="pane-photo blind aspect-[4/3] lg:aspect-[5/4] border-t-[3px] border-navy"><img src={`img/${src}.webp`} alt={alt} width="1376" height="768" loading="lazy" /></div>
              <figcaption className="mt-3 text-[1.0625rem] font-medium">{cap}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function SamplePrice({ rates }) {
  return (
    <div className="grid lg:grid-cols-12 mt-14 border-[3px] border-navy bg-white">
      <div className="lg:col-span-5 p-6 lg:p-10">
        <h3 className="font-serif text-[1.75rem] font-medium mb-1">Try it</h3>
        <p className="text-[.9375rem] text-muted mb-7">Pick a sample room and a style to see how the range moves.</p>
        <label className="block text-sm font-semibold mb-6">Sample room
          <select className="line-field font-normal mt-1" defaultValue="Bedroom, 2 windows, 5 × 6 ft"><option>One small window, 4 × 5 ft</option><option>Bedroom, 2 windows, 5 × 6 ft</option><option>Living room, 2 windows, 8 × 7 ft</option><option>Whole home, 6 windows, 5 × 6 ft</option></select>
        </label>
        <label className="block text-sm font-semibold">Style
          <select className="line-field font-normal mt-1" defaultValue="Zebra blinds">
            <optgroup label="Blinds">{rates.blinds.map((p) => <option key={p.id}>{p.name}</option>)}</optgroup>
            <optgroup label="Curtains">{rates.curtains.map((p) => <option key={p.id}>{p.name}</option>)}</optgroup>
          </select>
        </label>
      </div>
      <div className="lg:col-span-7 bg-navy text-white cut-corner p-6 lg:p-10 flex flex-col justify-center">
        <p className="text-[1.0625rem] mb-1">Rough price</p>
        <p data-price className="font-serif font-medium tracking-tight leading-[1.05] text-[2.5rem] sm:text-[3.5rem] xl:text-[4.5rem] tabular-nums mb-4">
          <CountUp from={0} to={7200} prefix="₹" separator="," duration={1.1} trigger="view" /> <span className="text-brass">to</span> <CountUp from={0} to={9400} prefix="₹" separator="," duration={1.1} trigger="view" />
        </p>
        <p className="text-[.9375rem] text-[#E8E3D6] max-w-xl mb-7">Plus GST. A guide from starting rates. The final price comes after we measure at your home.</p>
        <a href="estimate.html" className="slat-btn slat-btn-gold self-start"><span>Price my own windows</span><span aria-hidden="true">→</span></a>
      </div>
    </div>
  );
}

function How({ rates }) {
  const steps = [
    ['Pick a style', 'Choose curtains or blinds, then the style you like.'],
    ['Measure', 'Enter each window’s width and height. Rough is fine.'],
    ['Confirm your number', 'We text a code, and your price appears straight away.'],
    ['We visit', 'We bring the catalogues, measure, and fix the final price.'],
  ];
  return (
    <section id="how" className="bg-sand py-24 lg:py-32">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-10">
        <Heading text="How the rough price works" className="mb-12" />
        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-9 list-none p-0 m-0">
          {steps.map(([t, d], i) => (
            <li key={t} className="rise rail pt-4">
              <span className="font-serif italic text-[2.5rem] leading-none text-[#A87F3F]" aria-hidden="true">{i + 1}</span>
              <h3 className="font-semibold text-lg mt-3 mb-1">{t}</h3>
              <p className="text-[.9375rem] leading-relaxed text-muted">{d}</p>
            </li>
          ))}
        </ol>
        <SamplePrice rates={rates} />
      </div>
    </section>
  );
}

function Why() {
  const reasons = [
    ['No outlet costs', 'We don’t carry the cost of running an outlet, and that benefits you.'],
    ['Catalogues at your door', 'See everything against your own wall colours before you order.'],
    ['Measured in front of you', 'Our team visits and takes every measurement with you there.'],
    ['Our own tailors', 'Stitched in-house, checked at our factory, and inspected after fitting.'],
  ];
  return (
    <section id="about" className="bg-linen py-24 lg:py-32">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-10 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <Heading text="No outlet. We come to you." className="mb-7" />
          <p className="rise text-[1.0625rem] leading-relaxed text-muted max-w-2xl mb-10">Since 2015, Window Works has handled the site visit, measuring, processing and installation for homes, offices, architects and builders.</p>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-7">
            {reasons.map(([t, d]) => <div key={t} className="rise rail pt-3"><h3 className="font-semibold text-lg mb-1">{t}</h3><p className="text-[.9375rem] leading-relaxed text-muted">{d}</p></div>)}
          </div>
        </div>
        <aside className="lg:col-span-5 relative">
          <div className="pane-photo blind aspect-[4/3]"><img src="img/p-roman.webp" width="1024" height="1024" loading="lazy" alt="Roman blinds on a sunlit window" /></div>
          <div className="rise bg-navy text-white p-7 lg:p-9">
            <h3 className="font-serif text-[1.75rem] font-medium mb-3">Talk to our team</h3>
            <address className="not-italic text-[.9375rem] leading-relaxed text-[#E8E3D6] mb-6">19, G.R.D Layout, A.A. Scheme Road<br />RS Puram, Coimbatore 641002</address>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href={TEL} className="slat-btn slat-btn-gold"><span>Call {PHONE}</span></a>
              <a href="#" className="line-link font-medium text-[.9375rem]">admin@windowworks.in</a>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Also() {
  const items = [
    ['Skylights', 'Indoor and outdoor skylights, pergolas and louvers.', 'skylight-indoor', 'Honeycomb blinds on a sloped skylight'],
    ['Insect screens', 'Magnetic, sliding and pleated screens for windows and doors.', 'screen', 'A black framed insect screen door'],
  ];
  return (
    <section className="grid md:grid-cols-2 gap-[3px] bg-navy border-y-[3px] border-navy">
      {items.map(([t, d, img, alt]) => (
        <a key={t} href="#contact" className="bg-linen grid grid-cols-[42%_1fr] no-underline group">
          <div className="pane-photo blind min-h-[220px] relative"><img src={`img/${img}.webp`} alt={alt} width="600" height="600" loading="lazy" className="absolute inset-0" /></div>
          <div className="p-6 lg:p-9 flex flex-col justify-center">
            <h2 className="rise font-serif text-[1.75rem] lg:text-[2.25rem] font-medium leading-tight mb-2">{t}</h2>
            <p className="rise text-[.9375rem] leading-relaxed text-muted mb-3">{d}</p>
            <p className="rise font-semibold text-[.9375rem] group-hover:text-brand transition-colors">Priced after a visit. Ask us →</p>
          </div>
        </a>
      ))}
    </section>
  );
}

function Works() {
  return (
    <section id="works" className="bg-linen py-24 lg:py-32">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-10">
          <Heading text="Our works" />
          <p className="rise text-muted">Real jobs and our factory.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-9">
          {VIDEOS.map(([id, title], i) => (
            <a key={id} href="#" className={`group no-underline ${i % 3 === 1 ? 'lg:mt-14' : ''}`}>
              <div className="pane-photo blind aspect-video bg-navy"><img src={`img/yt-${id}.jpg`} width="480" height="360" loading="lazy" alt={`Video: ${title}`} /></div>
              <p className="mt-3 font-medium text-[1.0625rem] group-hover:text-brand transition-colors">{title} <span aria-hidden="true" className="text-[#A87F3F]">↗</span></p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const ref = useRef(null);
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!desktop || still || !ref.current) return undefined;
    let effect; let stop = false;
    const io = new IntersectionObserver(async ([en]) => {
      if (!en.isIntersecting) return;
      io.disconnect();
      try {
        const THREE = await import('three');
        window.THREE = THREE;
        const mod = await import('vanta/dist/vanta.fog.min');
        const FOG = mod.default || window.VANTA?.FOG;
        if (stop || !FOG) return;
        effect = FOG({ el: ref.current, THREE, mouseControls: false, touchControls: false, gyroControls: false, highlightColor: 0x123473, midtoneColor: 0x0b2559, lowlightColor: 0x05112b, baseColor: 0x081c45, blurFactor: 0.62, speed: 0.75, zoom: 0.9 });
        ref.current.dataset.vanta = 'on';
      } catch (e) { if (ref.current) ref.current.dataset.vanta = 'off'; }
    }, { rootMargin: '200px' });
    io.observe(ref.current);
    return () => { stop = true; io.disconnect(); if (effect) effect.destroy(); };
  }, []);
  return (
    <section id="contact" ref={ref} className="relative bg-navy text-white overflow-hidden">
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 lg:px-10 py-24 lg:py-32 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <Heading text="Ready for a rough price?" className="mb-5" />
          <p className="rise text-[1.0625rem] leading-relaxed text-[#E8E3D6] max-w-xl mb-8">It takes a few minutes with a tape measure. There’s no charge for the estimate, and our team will call you to book a visit.</p>
          <a href="estimate.html" className="rise slat-btn slat-btn-gold"><span>Start my estimate</span><span aria-hidden="true">→</span></a>
        </div>
        <div className="lg:col-span-5 grid gap-5 content-start">
          <h3 className="font-serif text-[1.75rem] font-medium">Rather just ask?</h3>
          <label className="text-sm font-semibold">Your name<input className="line-field line-field-light font-normal mt-1" autoComplete="off" /></label>
          <label className="text-sm font-semibold">Mobile number<input className="line-field line-field-light font-normal mt-1" type="tel" inputMode="numeric" autoComplete="off" /></label>
          <label className="text-sm font-semibold">Area or PIN code<input className="line-field line-field-light font-normal mt-1" /></label>
          <label className="text-sm font-semibold">What do you need?<input className="line-field line-field-light font-normal mt-1" /></label>
          <button type="button" className="slat-btn slat-btn-light justify-self-start"><span>Ask us to call</span></button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-midnight text-[#E8E3D6]">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-10 pt-14 pb-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-12 gap-10 text-[.9375rem]">
          <div className="lg:col-span-5">
            <span className="inline-block bg-brand p-3 mb-5"><img src="img/logo-white.png" width="520" height="324" loading="lazy" alt="Window Works" className="h-16 w-auto" /></span>
            <p className="max-w-sm leading-relaxed">Curtains, sheers, blinds, skylights and insect screens, made to measure in Coimbatore since 2015.</p>
          </div>
          <nav aria-label="Footer" className="lg:col-span-2 grid gap-1 content-start">{[['Products', '#collections'], ['Prices', '#prices'], ['Gallery', '#gallery'], ['Our works', '#works']].map(([t, h]) => <a key={h} href={h} className="line-link w-fit">{t}</a>)}</nav>
          <div className="lg:col-span-2 grid gap-1 content-start"><a href="estimate.html" className="line-link w-fit">Rough price</a><a href="#" className="line-link w-fit">Instagram</a><a href="#" className="line-link w-fit">Facebook</a><a href="admin.html" className="line-link w-fit">Team view (demo)</a></div>
          <address className="lg:col-span-3 not-italic leading-relaxed">19, G.R.D Layout, A.A. Scheme Road<br />RS Puram, Coimbatore 641002<br /><a href={TEL} className="line-link">{PHONE}</a><br /><a href="#" className="line-link">admin@windowworks.in</a></address>
        </div>
        <p className="mt-12 text-sm">Copyright 2026 Window Works. Design preview by Mi Media Labs.</p>
      </div>
    </footer>
  );
}

export default function App() {
  const scope = useRef(null);
  const rates = RATES;
  useEffect(() => {
    const stop = (e) => { const a = e.target.closest('a[href="#"]'); if (a) e.preventDefault(); };
    document.addEventListener('click', stop);
    return () => document.removeEventListener('click', stop);
  }, []);
  useSmoothScroll();
  useSiteMotion(scope);
  return (
    <div ref={scope}>
      <p className="bg-midnight text-white text-sm px-4 lg:px-10 py-2">Design preview only. Forms and buttons are for show, and sample prices are examples.</p>
      <Header />
      <main>
        <Hero rates={rates} />
        <Collections rates={rates} />
        <Prices rates={rates} />
        <FeatureDuo rates={rates} />
        <Gallery />
        <How rates={rates} />
        <Why />
        <Also />
        <Works />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
