import { useMemo, useState } from 'react';
import { Header, Footer } from '../site/Chrome';
import { ww, inr, H2, LINKS, FOOT, Pic, useSizeCheck, SizeForm, Hero, Works, Faq, Visit, Related, PreviewNote, PhoneBar } from './common';

// Starting rates per sq ft before GST, as shown on windowworks.in/skylights.php.
// Louvers are listed there at ₹12,000 per sq ft, which looks like a typing error, so this page asks instead of quoting it.
export const SKY = [
  { id: 'skylight-indoor', name: 'Skylight indoor', rate: 1200, pic: ['', true], alt: 'Teal honeycomb shades fitted under a sloped skylight and on the window below',
    long: 'A fabric shade fitted inside, under the glass of a skylight, to soften the sun that comes in from above.', best: 'Skylights over halls, stairs and kitchens' },
  { id: 'pergoflex', name: 'Pergoflex', rate: 1800, pic: ['pages', false], alt: 'A pale grey fabric canopy folded in soft waves on aluminium rails over a garden sit-out',
    long: 'A flexible fabric roof that runs along rails, so you can open it to the sky or close it for shade.', best: 'Sit-outs, gardens and terraces' },
  { id: 'pergoroof', name: 'Pergoroof', rate: 2400, pic: ['', true], alt: 'A covered outdoor lounge under a pergola roof, with a fabric screen lowered at the side',
    long: 'A fabric roof on a pergola frame, for an outdoor room that stays usable through sun and rain.', best: 'Outdoor lounges and dining areas' },
  { id: 'skylight-outdoor', name: 'Skylight outdoor', rate: 2500, pic: ['', true], alt: 'A retractable fabric shade on a frame over the terrace of an apartment block',
    long: 'A shade fitted outside, over a skylight or a terrace, so the sun is stopped before it reaches the glass.', best: 'Terraces and roof skylights' },
  { id: 'pergoshade', name: 'Pergoshade', rate: 2500, pic: ['pages', false], alt: 'An off-white fabric shade on a slim dark pergola over a terrace dining table',
    long: 'Fabric stretched over a slim pergola frame, for clean, even shade over a terrace or outdoor dining area.', best: 'Terraces and outdoor dining' },
  { id: 'louvers', name: 'Louvers', rate: null, pic: ['', true], alt: 'A louvered pergola roof with its slats tilted open over an outdoor dining table',
    long: 'A pergola roof made of slats that tilt, to let in light and air or close up against the sun.', best: 'Pergolas over large outdoor areas' },
];
const PRICED = SKY.filter((s) => s.rate);
const SkyPic = ({ s, sizes, className = '' }) => <Pic dir={s.pic[0]} id={s.id} alt={s.alt} small={s.pic[1]} sizes={sizes} className={className} />;

export const VIDEOS = [
  ['5SVYaEVHAXY', 'Skylights'],
  ['n2h3RbdLkhE', 'Terrace skylight blinds'],
  ['KVRXYsUQVrs', 'Pergoflex'],
  ['lR8uuBi7O78', 'Pergoflex, another job'],
];

export const faqs = (s) => [
  ['How much do skylights cost in Coimbatore?', `At Window Works, indoor skylight shades start from ₹1,200 per sq ft, Pergoflex from ₹1,800, Pergoroof from ₹2,400, and outdoor skylights and Pergoshade from ₹2,500, all before GST. Louvers are priced after a visit.`],
  ['Where does the fabric come from?', 'We import it from Italy, from a world leader in flexible composite fabrics, and assemble everything at our own plant in Coimbatore.'],
  ['Will it help keep the house cool?', 'They are made for thermal performance and energy saving: the fabric takes the heat of the sun before it reaches the room below.'],
  ['Can skylights and Pergoflex be motorised?', 'Yes. Our skylight and Pergoflex jobs on this page are motorised. See our motorisation page for more.'],
  ['Is it only for homes?', 'No. We fit them on villas and homes, and also on offices, resorts, open-air hotels, halls, schools, playgrounds, farm houses and industrial buildings.'],
  ['Is the price on this page final?', 'No, it is a rough guide based on our starting rates, plus GST. The fabric, frame and fittings decide the final figure, and we confirm it after measuring on site.'],
  ['Is there a minimum size?', `For the rough price, any area smaller than ${s.minArea} sq ft is counted as ${s.minArea} sq ft.`],
];

function PriceBoard({ settings, size, setSize, sel, setSel }) {
  const W = ww();
  const { qty, ok, unitWord, err } = useSizeCheck(size, 80, 80);
  const priced = useMemo(() => PRICED.map((s) => ({ s, r: ok ? W.calc('blinds', s, [{ room: '', w: size.w, h: size.h, unit: size.unit, qty }], settings) : null })), [settings, size, ok]);
  const cur = priced.find((x) => x.s.id === sel) || priced[0];
  const mail = `mailto:admin@windowworks.in?subject=${encodeURIComponent(`${cur.s.name} enquiry`)}&body=${encodeURIComponent(`Hello Window Works,\n\nI would like a price for ${cur.s.name.toLowerCase()}${ok ? `, about ${size.w} × ${size.h} ${unitWord}${qty > 1 ? `, ${qty} areas` : ''}` : ''}.\n\nMy name:\nMy phone:\nMy area in Coimbatore:\n`)}`;
  const wa = ok ? `https://wa.me/?text=${encodeURIComponent(`Window Works rough price\n${cur.s.name}, ${size.w} × ${size.h} ${unitWord}${qty > 1 ? `, ${qty} areas` : ''}\n${W.rupees(cur.r.low)} to ${W.rupees(cur.r.high)} plus GST\nThe final price is confirmed after measuring on site.`)}` : null;
  return (
    <section id="price" className="bg-linen pt-20 lg:pt-28">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-x-8 gap-y-3 items-end mb-10">
          <h2 className={`rise lg:col-span-8 ${H2}`}>Price your skylight or terrace</h2>
          <p className="rise lg:col-span-4 text-[1.0625rem] leading-relaxed">Measure the area you want covered. Type its length and width, and all five prices change.</p>
        </div>
        <div className="panes lg:grid-cols-12">
          <div className="pane !bg-navy text-white lg:col-span-5 p-5 lg:p-8">
            <SizeForm size={size} setSize={setSize} labels={['Length', 'Width']} countLabel="How many areas" />
            <div className="pane-photo aspect-[4/3] my-4 bg-midnight"><SkyPic key={cur.s.id} s={cur.s} sizes="(min-width: 1024px) 35vw, 100vw" className="draw-fade" /></div>
            {!ok && <p role="alert" className="text-gold-light font-medium mb-2">{err}</p>}
            <div aria-live="polite">
              <h3 className="font-serif text-2xl font-medium leading-tight">{cur.s.name}</h3>
              <p className="font-serif font-medium tracking-tight leading-[1.1] text-[2.25rem] sm:text-[2.75rem] tabular-nums">{ok ? <>{W.rupees(cur.r.low)} <span className="text-brass">to</span> {W.rupees(cur.r.high)}</> : `from ₹${inr(cur.s.rate)} per sq ft`}</p>
              <p className="text-[.9375rem] text-[#E8E3D6] mt-2 mb-5">Plus GST. {ok ? `Counted as ${cur.r.lines[0].measure}${qty > 1 ? ' an area' : ''}. ` : ''}A guide from starting rates. The final price comes after we measure on site.</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href={mail} className="slat-btn slat-btn-gold"><span>Email us for a price</span><span aria-hidden="true">→</span></a>
              {wa && <a href={wa} target="_blank" rel="noopener" className="line-link font-medium text-[.9375rem]">Send on WhatsApp</a>}
            </div>
          </div>
          <div className="pane !bg-navy lg:col-span-7">
            <div className="board h-full content-start" role="group" aria-label="Rough price for each skylight and shade">
              {priced.map(({ s, r }) => (
                <button key={s.id} type="button" className="board-row" aria-pressed={s.id === cur.s.id} onClick={() => setSel(s.id)}>
                  <span className="board-pic"><SkyPic s={{ ...s, alt: '' }} sizes="96px" /></span>
                  <span className="min-w-0"><strong className="block font-semibold text-[1.0625rem] leading-snug">{s.name}</strong><small className="block text-[.875rem] leading-snug mt-0.5 opacity-80">from ₹{inr(s.rate)} per sq ft</small></span>
                  <span className="board-price tabular-nums">{r ? <>{W.rupees(r.low)}<span className="board-to"> to {W.rupees(r.high)}</span></> : '–'}</span>
                </button>
              ))}
              <div className="board-row !cursor-default" aria-label="Louvers are priced after a visit">
                <span className="board-pic"><SkyPic s={{ ...SKY[5], alt: '' }} sizes="96px" /></span>
                <span className="min-w-0"><strong className="block font-semibold text-[1.0625rem] leading-snug">Louvers</strong><small className="block text-[.875rem] leading-snug mt-0.5 opacity-80">Priced after a visit</small></span>
                <span className="board-price">Ask us</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const SPANS = ['lg:col-span-7', 'lg:col-span-5', 'lg:col-span-4', 'lg:col-span-4', 'lg:col-span-4', 'lg:col-span-12'];

function Types({ setSel }) {
  return (
    <section id="types" className="bg-sand mt-24 lg:mt-32 py-24 lg:py-32">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-10">
        <h2 className={`rise ${H2} mb-12`}>All six, explained</h2>
        <div className="panes md:grid-cols-2 lg:grid-cols-12">
          {SKY.map((s, i) => {
            const wide = SPANS[i] === 'lg:col-span-12'; const dark = i === 1 || i === 4;
            return (
              <article key={s.id} id={s.id} className={`pane ${SPANS[i]} ${dark ? '!bg-navy text-white' : ''} ${wide ? 'lg:!grid lg:grid-cols-[7fr_5fr]' : ''} scroll-mt-24`}>
                <div className={`pane-photo slide ${wide ? 'aspect-[4/3] lg:aspect-[16/8]' : 'aspect-[4/3]'}`}><SkyPic s={s} /></div>
                <div className="p-6 lg:p-8 flex flex-col flex-1">
                  <div className="flex items-baseline justify-between gap-4 mb-3 flex-wrap">
                    <h3 className="font-serif text-[1.75rem] font-medium leading-tight">{s.name}</h3>
                    <p className={`shrink-0 font-bold text-[.9375rem] tabular-nums ${dark ? 'text-gold-light' : ''}`}>{s.rate ? <>₹{inr(s.rate)}<span className="font-medium"> / sq ft</span></> : 'Ask us'}</p>
                  </div>
                  <p className="text-[1rem] leading-relaxed mb-3 flex-1">{s.long}</p>
                  <p className={`text-[.9375rem] font-medium mb-4 ${dark ? 'text-[#E8E3D6]' : 'text-muted'}`}>Best for: {s.best.toLowerCase()}</p>
                  {s.rate ? <a href="#price" onClick={() => setSel(s.id)} className={`line-link font-semibold text-[.9375rem] w-fit ${dark ? 'text-gold-light' : ''}`}>Price this →</a>
                    : <a href="#visit" className="line-link font-semibold text-[.9375rem] w-fit">Ask for a visit →</a>}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Fabric() {
  const points = ['Highly affordable', 'High in quality', 'Latest in technology', 'Minimum maintenance', 'Colour and material ranges', 'Contemporary styles and design'];
  return (
    <section className="grid lg:grid-cols-12 bg-navy text-white">
      <div className="lg:col-span-6 p-7 lg:p-14 flex flex-col justify-center order-2 lg:order-1">
        <h2 className="rise font-serif text-[2rem] lg:text-[2.75rem] font-medium leading-[1.1] mb-4">Italian fabric, assembled in Coimbatore</h2>
        <p className="rise text-[1.0625rem] leading-relaxed mb-4">We import our fabric from Italy, from a world leader in flexible composite materials, and assemble every shade at our own plant in Coimbatore.</p>
        <p className="rise text-[1.0625rem] leading-relaxed text-[#E8E3D6] mb-8">The fabric is light, durable and recyclable, and it is made for thermal performance and energy saving.</p>
        <ul className="list-none p-0 m-0 grid grid-cols-2 gap-x-6 gap-y-3">{points.map((p) => <li key={p} className="rise border-t-[3px] border-gold pt-2 font-medium">{p}</li>)}</ul>
      </div>
      <div className="lg:col-span-6 slide relative min-h-[300px] lg:min-h-[520px] overflow-hidden pane-photo order-1 lg:order-2"><Pic dir="pages" id="pergoshade" alt="An off-white fabric shade on a slim dark pergola over a terrace dining table" sizes="(min-width: 1024px) 50vw, 100vw" className="absolute inset-0" /></div>
    </section>
  );
}

function Places() {
  const places = ['Villas and homes', 'Commercial offices', 'Beach resorts', 'Open-air hotels', 'Shading structures', 'Halls', 'Schools', 'Playgrounds', 'Farm houses', 'Industrial buildings'];
  return (
    <section className="bg-linen py-20 lg:py-28">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-10 grid lg:grid-cols-12 gap-x-12 gap-y-8">
        <div className="lg:col-span-5">
          <h2 className={`rise ${H2} mb-5`}>Where it goes</h2>
          <p className="rise text-[1.0625rem] leading-relaxed">From a single skylight over a staircase to a whole terrace, for homes and for businesses.</p>
        </div>
        <ul className="lg:col-span-7 list-none p-0 m-0 panes sm:grid-cols-2">
          {places.map((p) => <li key={p} className="pane p-5 font-serif text-[1.375rem] font-medium">{p}</li>)}
        </ul>
      </div>
    </section>
  );
}

function Measure({ settings }) {
  const steps = [
    ['Measure the length', 'Run a tape along the skylight opening, terrace or sit-out you want covered.'],
    ['Then the width', 'Measure across it the other way. A rough figure is fine.'],
    ['We work out the rest', `We multiply the two to get the area. For the rough price, anything under ${settings.minArea} sq ft counts as ${settings.minArea}.`],
  ];
  return (
    <section id="measure" className="bg-sand py-20 lg:py-28">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-10">
        <h2 className={`rise ${H2} mb-10`}>How to measure</h2>
        <ul className="list-none p-0 m-0 grid sm:grid-cols-3 gap-8">{steps.map(([t, d]) => <li key={t} className="rise rail pt-3"><h3 className="font-semibold text-lg mb-1">{t}</h3><p className="text-[1rem] leading-relaxed">{d}</p></li>)}</ul>
        <p className="rise text-[1.0625rem] leading-relaxed mt-8">Your figure is only for the rough price. We measure on site before the final price.</p>
      </div>
    </section>
  );
}

export default function SkylightsPage() {
  const [rates] = useState(() => ww().DEFAULTS);
  const [size, setSize] = useState({ w: '12', h: '10', unit: 'ft', qty: '1' });
  const [sel, setSel] = useState('skylight-indoor');
  return (
    <>
      <PreviewNote />
      <Header links={LINKS} current="skylights.html" />
      <main>
        <Hero crumb="Skylights" title="Skylights and pergola shades in Coimbatore" reveal="hero-slide"
          intro="Skylight shades, Pergoflex, Pergoshade, Pergoroof and louvers, made with Italian fabric at our plant in Coimbatore. From ₹1,200 per sq ft before GST."
          primary={['Price my area', '#price']} secondary={['See all six', '#types']}
          pic="skylights-hero" alt="A white fabric shade on a slim pergola over the roof terrace of a Coimbatore villa" />
        <PriceBoard settings={rates.settings} size={size} setSize={setSize} sel={sel} setSel={setSel} />
        <Types setSel={setSel} />
        <Fabric />
        <Places />
        <Measure settings={rates.settings} />
        <Works videos={VIDEOS} title="See our skylights on real jobs" note="Videos from Window Works: skylights, a terrace and Pergoflex." />
        <Faq items={faqs(rates.settings)} />
        <Related items={[
          ['Motorisation', 'Open skylights and Pergoflex by remote or from your phone.', 'motorisation.html', 'img/motorised.webp', 'A remote beside a motorised curtain track'],
          ['Blinds', 'Eleven kinds of blind, including outdoor and monsoon blinds.', 'blinds.html', 'img/blinds/zebra-640.webp', 'Cream zebra blinds in a dining room'],
          ['Curtains', 'Six kinds of curtain, from ₹250 per metre.', 'curtains.html', 'img/eyelet.webp', 'Grey patterned eyelet curtains'],
        ]} />
        <Visit title="We come and measure on site" pic="pergoshade" cta={['Email us for a price', 'mailto:admin@windowworks.in?subject=Skylight%20enquiry']}
          text="Tell us what you want covered, and our team will call to book a visit anywhere in Coimbatore. There’s no charge for the estimate." />
      </main>
      <Footer links={FOOT} />
      <PhoneBar priceLabel="Price my area" />
    </>
  );
}
