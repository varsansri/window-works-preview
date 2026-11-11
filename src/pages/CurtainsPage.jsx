import { useEffect, useMemo, useState } from 'react';
import { Header, Footer, Swatch } from '../site/Chrome';
import { ww, inr, H2, LINKS, FOOT, Pic, useSizeCheck, SizeForm, ChoiceGroup, Hero, Faq, Visit, Related, PreviewNote, PhoneBar, rememberedSize } from './common';
import CurtainDrawing, { FoldDiagram } from './CurtainDrawing';
import { INFO, Q_WHERE, Q_WANT, suggest, faqs } from './curtains-data';

const motorText = (s) => `plus a motor from ₹${inr(s.motorFrom)}`;

function PriceBoard({ curtains, settings, size, setSize, sel, setSel }) {
  const W = ww();
  const { wFt, hFt, qty, ok, unitWord, err } = useSizeCheck(size);
  const priced = useMemo(() => curtains.map((c) => ({ c, r: ok ? W.calc('curtains', c, [{ room: '', w: size.w, h: size.h, unit: size.unit, qty }], settings) : null })), [curtains, settings, size, ok]);
  const cur = priced.find((x) => x.c.id === sel) || priced[0];
  const round = (n) => Math.round(n * 100) / 100;
  const href = `estimate.html?cat=curtains&p=${cur.c.id}${ok ? `&w=${round(wFt)}&h=${round(hFt)}&qty=${qty}` : ''}`;
  const wa = ok ? `https://wa.me/?text=${encodeURIComponent(`Window Works rough price\n${cur.c.name}, ${size.w} × ${size.h} ${unitWord}${qty > 1 ? `, ${qty} windows` : ''}\n${W.rupees(cur.r.low)} to ${W.rupees(cur.r.high)} plus GST${cur.c.motor ? `, ${motorText(settings)} plus GST` : ''}\nThe final price is confirmed after measuring at home.`)}` : null;
  const metres = ok ? cur.r.lines[0].measure : null;
  return (
    <section id="price" className="bg-linen pt-20 lg:pt-28">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-x-8 gap-y-3 items-end mb-10">
          <h2 className={`rise lg:col-span-8 ${H2}`}>Price every curtain for your window</h2>
          <p className="rise lg:col-span-4 text-[1.0625rem] leading-relaxed">Curtains are priced by the metre of fabric. Type your window size and see the metres and the price for all six.</p>
        </div>
        <div className="panes lg:grid-cols-12">
          <div className="pane !bg-navy text-white lg:col-span-5 p-5 lg:p-8">
            <SizeForm size={size} setSize={setSize} />
            {ok ? <CurtainDrawing wFt={wFt} hFt={hFt} w={size.w} h={size.h} unit={size.unit} id={cur.c.id} name={cur.c.name} /> : <p role="alert" className="py-16 text-center text-gold-light font-medium">{err}</p>}
            <div aria-live="polite">
              <h3 className="mt-2 font-serif text-2xl font-medium leading-tight">{cur.c.name}</h3>
              <p className="font-serif font-medium tracking-tight leading-[1.1] text-[2.25rem] sm:text-[2.75rem] tabular-nums">{ok ? <>{W.rupees(cur.r.low)} <span className="text-brass">to</span> {W.rupees(cur.r.high)}</> : `from ₹${inr(cur.c.rate)} per metre`}</p>
              <p className="text-[.9375rem] text-[#E8E3D6] mt-2 mb-5">Plus GST{cur.c.motor ? `, ${motorText(settings)} plus GST for each window` : ''}. {ok ? `About ${metres} of fabric per window. ` : ''}A guide from starting rates. The final price comes after we measure at your home.</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href={href} className="slat-btn slat-btn-gold"><span>Get a full estimate</span><span aria-hidden="true">→</span></a>
              {wa && <a href={wa} target="_blank" rel="noopener" className="line-link font-medium text-[.9375rem]">Send on WhatsApp</a>}
            </div>
          </div>
          <div className="pane !bg-navy lg:col-span-7">
            <div className="board h-full content-start" role="group" aria-label="Rough price for each curtain">
              {priced.map(({ c, r }) => (
                <button key={c.id} type="button" className="board-row" aria-pressed={c.id === cur.c.id} onClick={() => setSel(c.id)}>
                  <span className="board-pic"><Pic id={c.id} alt="" small /></span>
                  <span className="min-w-0"><strong className="block font-semibold text-[1.0625rem] leading-snug">{c.name}</strong><small className="block text-[.875rem] leading-snug mt-0.5 opacity-80">from ₹{inr(c.rate)} per metre{c.motor ? ' + motor' : ''}{r ? ` · ${r.lines[0].measure}` : ''}</small></span>
                  <span className="board-price tabular-nums">{r ? <>{W.rupees(r.low)}<span className="board-to"> to {W.rupees(r.high)}</span></> : '–'}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Chooser({ curtains, settings, size, setSel }) {
  const W = ww();
  const [where, setWhere] = useState('bedroom'); const [want, setWant] = useState('dark');
  const picks = useMemo(() => suggest(curtains, where, want), [curtains, where, want]);
  const { ok } = useSizeCheck({ ...size, qty: '1' });
  const money = (c) => {
    if (!ok) return `from ₹${inr(c.rate)} per metre${c.motor ? ' + motor' : ''}`;
    const r = W.calc('curtains', c, [{ room: '', w: size.w, h: size.h, unit: size.unit, qty: 1 }], settings);
    return `${W.rupees(r.low)} to ${W.rupees(r.high)} for one window${c.motor ? ' + motor' : ''}`;
  };
  return (
    <section id="choose" className="bg-sand mt-24 lg:mt-32 py-20 lg:py-28">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-10 grid lg:grid-cols-12 gap-x-12 gap-y-10">
        <div className="lg:col-span-5">
          <h2 className={`rise ${H2} mb-8`}>Which curtain suits your room?</h2>
          <ChoiceGroup legend="Where is the window?" options={Q_WHERE} value={where} onChange={setWhere} />
          <ChoiceGroup legend="What do you want most?" options={Q_WANT} value={want} onChange={setWant} />
        </div>
        <div className="lg:col-span-7" aria-live="polite">
          <div className="panes">
            {picks.map((c, i) => (
              <article key={c.id} className={`pane sm:!grid ${i === 0 ? 'sm:grid-cols-[3fr_2fr]' : 'sm:grid-cols-[2fr_3fr]'}`}>
                <div className="pane-photo aspect-[16/10] sm:aspect-auto sm:min-h-[210px] relative"><Pic id={c.id} alt={INFO[c.id].alt} small className="sm:absolute sm:inset-0" /></div>
                <div className="p-5 lg:p-7">
                  <h3 className="font-serif text-2xl font-medium leading-tight mb-1">{c.name}</h3>
                  <p className="font-bold text-[.9375rem] tabular-nums mb-3">{money(c)}</p>
                  <p className="text-[.9375rem] leading-relaxed mb-4">{INFO[c.id].best}. {INFO[c.id].light}.</p>
                  <a href="#price" onClick={() => setSel(c.id)} className="line-link font-semibold text-[.9375rem]">See it on my window →</a>
                </div>
              </article>
            ))}
          </div>
          <p className="text-[.9375rem] text-muted mt-4">A starting point. At your home we show you the catalogues and settle it together.</p>
        </div>
      </div>
    </section>
  );
}

/* Six panes in two rows: wide, narrow, narrow / narrow, narrow, wide on large screens. */
const SPANS = ['lg:col-span-6', 'lg:col-span-3', 'lg:col-span-3', 'lg:col-span-3', 'lg:col-span-3', 'lg:col-span-6'];

function Types({ curtains, setSel, settings }) {
  return (
    <section id="types" className="bg-linen pt-24 lg:pt-32">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-x-8 gap-y-3 items-end mb-12">
          <h2 className={`rise lg:col-span-7 ${H2}`}>All 6 curtains, explained</h2>
          <p className="rise lg:col-span-5 text-[1.0625rem] leading-relaxed">Every one is stitched to your window by our own tailors, in the fabric you choose at home.</p>
        </div>
        <div className="panes md:grid-cols-2 lg:grid-cols-12">
          {curtains.map((c, i) => {
            const info = INFO[c.id]; const wide = SPANS[i] === 'lg:col-span-6'; const dark = i === 2 || i === 5;
            return (
              <article key={c.id} id={c.id} className={`pane ${SPANS[i]} ${dark ? '!bg-navy text-white' : ''} scroll-mt-24`}>
                <div className={`pane-photo part ${wide ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}><Pic id={c.id} alt={info.alt} small /></div>
                <div className="p-6 lg:p-7 flex flex-col flex-1">
                  <div className="flex items-baseline justify-between gap-4 mb-3 flex-wrap">
                    <h3 className="font-serif text-[1.625rem] font-medium leading-tight">{c.name}</h3>
                    <p className={`shrink-0 font-bold text-[.9375rem] tabular-nums ${dark ? 'text-gold-light' : ''}`}>₹{inr(c.rate)}<span className="font-medium"> / metre</span></p>
                  </div>
                  <p className="text-[1rem] leading-relaxed mb-3 flex-1">{info.long}</p>
                  {c.motor && <p className={`text-[.9375rem] font-semibold mb-3 ${dark ? 'text-gold-light' : ''}`}>Motor from ₹{inr(settings.motorFrom)} plus GST. <a href="motorisation.html" className="line-link">More on motorisation →</a></p>}
                  <p className={`text-[.9375rem] font-medium mb-4 ${dark ? 'text-[#E8E3D6]' : 'text-muted'}`}>Best for: {info.best.toLowerCase()}</p>
                  <a href="#price" onClick={() => setSel(c.id)} className={`line-link font-semibold text-[.9375rem] w-fit ${dark ? 'text-gold-light' : ''}`}>Price this curtain →</a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Fullness({ settings }) {
  const W = ww();
  const ex = W.calc('curtains', { rate: 1 }, [{ w: 5, h: 7, unit: 'ft', qty: 1 }], settings).lines[0];
  const widths = Math.ceil(Math.round(((5 * settings.fullness) / (settings.fabricWidthIn / 12)) * 1000) / 1000);
  return (
    <section id="fabric" className="bg-linen py-24 lg:py-32">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-10 grid lg:grid-cols-12 gap-x-12 gap-y-10 items-center">
        <div className="lg:col-span-5">
          <h2 className={`rise ${H2} mb-6`}>Why a curtain takes more fabric than the window</h2>
          <p className="rise text-[1.0625rem] leading-relaxed mb-5">A curtain only looks full when it hangs in folds, so it needs about {settings.fullness === 2 ? 'twice' : `${settings.fullness} times`} the window’s width in fabric. That fabric comes in {settings.fabricWidthIn}-inch widths, and each width runs the length of the curtain plus {settings.hemFt} ft for the hems.</p>
          <dl className="rise text-[1rem] border-t-[3px] border-navy">
            <div className="flex justify-between gap-4 py-3 border-b border-rule"><dt>A window 5 ft wide and 7 ft tall</dt><dd className="font-semibold tabular-nums text-right">5 × 7 ft</dd></div>
            <div className="flex justify-between gap-4 py-3 border-b border-rule"><dt>Fabric across, at {settings.fullness} ×</dt><dd className="font-semibold tabular-nums text-right">{5 * settings.fullness} ft = {widths} widths</dd></div>
            <div className="flex justify-between gap-4 py-3 border-b border-rule"><dt>Each width, with hems</dt><dd className="font-semibold tabular-nums text-right">{7 + settings.hemFt} ft</dd></div>
            <div className="flex justify-between gap-4 py-3 border-b-[3px] border-navy"><dt className="font-semibold">Fabric to buy</dt><dd className="font-bold tabular-nums text-right">about {ex.measure.replace(' m', ' metres')}</dd></div>
          </dl>
        </div>
        <div className="rise lg:col-span-7 bg-white border-[3px] border-navy p-5 lg:p-10"><FoldDiagram fullness={settings.fullness} /></div>
      </div>
    </section>
  );
}

function Printed() {
  return (
    <section className="grid lg:grid-cols-12 bg-navy text-white">
      <div className="lg:col-span-7 part relative min-h-[300px] lg:min-h-[480px] overflow-hidden"><Swatch className="absolute inset-0 w-full h-full" /></div>
      <div className="lg:col-span-5 p-7 lg:p-14 flex flex-col justify-center">
        <h2 className="rise font-serif text-[2rem] lg:text-[2.75rem] font-medium leading-[1.1] mb-4">Printed to your own theme</h2>
        <p className="rise text-[1.0625rem] leading-relaxed mb-4">Window Works was the first company to print curtains, sheers and blinds to the customer’s own choice, and has done it since 2015. Creative companies bring us their themes, and we make them real in fabric.</p>
        <p className="rise text-[1.0625rem] leading-relaxed text-[#E8E3D6]">Our tailors work in-house. They are from Northern India, from families that have stitched for generations.</p>
      </div>
    </section>
  );
}

function Compare({ curtains, setSel }) {
  return (
    <section id="compare" className="bg-sand py-24 lg:py-32">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-10">
        <h2 className={`rise ${H2} mb-10`}>Compare them side by side</h2>
        <div className="spec-wrap" role="region" aria-label="Comparison of all 6 curtains" tabIndex={0}>
          <table className="spec">
            <thead><tr><th scope="col">Curtain</th><th scope="col" className="n">From, per metre</th><th scope="col">How it works</th><th scope="col">Best for</th></tr></thead>
            <tbody>
              {curtains.map((c) => (
                <tr key={c.id}>
                  <th scope="row"><a href="#price" onClick={() => setSel(c.id)} className="line-link font-semibold">{c.name}</a></th>
                  <td data-label="From, per metre" className="n tabular-nums font-semibold">₹{inr(c.rate)}{c.motor ? ' + motor' : ''}</td>
                  <td data-label="How it works">{INFO[c.id].light}</td>
                  <td data-label="Best for">{INFO[c.id].best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[.9375rem] text-muted mt-4">Starting rates before GST. Your fabric and fittings decide the final figure.</p>
      </div>
    </section>
  );
}

function MeasureDiagram() {
  return (
    <svg viewBox="0 0 420 300" className="block w-full h-auto" role="img" aria-label="A window with a curtain rod above it, the width measured along the rod and the drop from the rod to the floor">
      <rect x="130" y="70" width="170" height="160" fill="#5B76AD" /><rect x="130" y="70" width="170" height="160" fill="none" stroke="#081C45" strokeWidth="6" />
      <rect x="100" y="48" width="230" height="6" fill="#9E7B32" />
      <rect x="0" y="284" width="420" height="4" fill="#081C45" />
      <g stroke="#9E7B32" strokeWidth="2"><line x1="130" x2="300" y1="30" y2="30" /><line x1="130" x2="130" y1="22" y2="38" /><line x1="300" x2="300" y1="22" y2="38" /><line x1="360" x2="360" y1="51" y2="284" /><line x1="352" x2="368" y1="51" y2="51" /><line x1="352" x2="368" y1="284" y2="284" /></g>
      <text x="215" y="18" textAnchor="middle" fill="#081C45" fontSize="17" fontWeight="600">Width</text>
      <text x="390" y="168" textAnchor="middle" fill="#081C45" fontSize="17" fontWeight="600" transform="rotate(90 390 168)">Drop</text>
    </svg>
  );
}

function Measure() {
  const steps = [
    ['Measure the width', 'Run a tape across the window, or along the rod if one is already up.'],
    ['Measure the drop', 'Go from where the rod sits down to where the curtain should end: the sill or the floor.'],
    ['Leave the maths to us', 'We add the folds and the hems for you. A rough figure is fine for now.'],
  ];
  return (
    <section id="measure" className="bg-linen py-20 lg:py-28">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-10 grid lg:grid-cols-12 gap-x-12 gap-y-10 items-center">
        <div className="lg:col-span-7">
          <h2 className={`rise ${H2} mb-8`}>How to measure for curtains</h2>
          <ul className="list-none p-0 m-0 grid sm:grid-cols-3 gap-6">{steps.map(([t, d]) => <li key={t} className="rise rail pt-3"><h3 className="font-semibold text-lg mb-1">{t}</h3><p className="text-[1rem] leading-relaxed">{d}</p></li>)}</ul>
          <p className="rise text-[1.0625rem] leading-relaxed mt-8">Your figure is only for the rough price. We measure again at your home before the final price.</p>
        </div>
        <div className="rise lg:col-span-5 relative pb-16 sm:pb-20">
          <Pic dir="pages" id="curtains-measure" alt="A tape measure along a brass curtain rod above a window, with a notepad and pencil on the granite sill" sizes="(min-width: 1024px) 40vw, 100vw" className="block w-full aspect-[4/3] object-cover" />
          <div className="absolute left-0 bottom-0 w-[58%] sm:w-[48%] lg:w-[58%] bg-white border-[3px] border-navy p-3 sm:p-4"><MeasureDiagram /></div>
        </div>
      </div>
    </section>
  );
}

export default function CurtainsPage() {
  const [rates, setRates] = useState(() => ww().DEFAULTS);
  const [size, setSize] = useState({ w: '5', h: '7', unit: 'ft', qty: '1' });
  const [sel, setSel] = useState('eyelet');
  const curtains = rates.curtains;

  // The server page uses the published rates and a sample size. Saved ones are applied once in the browser.
  useEffect(() => { setRates(ww().rates()); setSize((s) => rememberedSize(s)); }, []);
  const first = useMemo(() => ({ done: false }), []);
  useEffect(() => { if (!first.done) { first.done = true; return; } ww().store.set('ww-size', size); }, [size, first]);
  const low = Math.min(...curtains.map((c) => c.rate));

  return (
    <>
      <PreviewNote />
      <Header links={LINKS} current="curtains.html" />
      <main>
        <Hero crumb="Curtains" title="Curtains in Coimbatore" reveal="hero-part"
          intro={`Sheers, eyelet, pleated, recess, LED and motorised curtains, stitched to your window by our own tailors. From ₹${inr(low)} per metre before GST.`}
          primary={['Price my window', '#price']} secondary={['Help me choose', '#choose']}
          pic="curtains-hero" alt="Ivory sheers and teal eyelet curtains half open on a tall window in a bright Coimbatore living room" />
        <PriceBoard curtains={curtains} settings={rates.settings} size={size} setSize={setSize} sel={sel} setSel={setSel} />
        <Chooser curtains={curtains} settings={rates.settings} size={size} setSel={setSel} />
        <Types curtains={curtains} setSel={setSel} settings={rates.settings} />
        <Fullness settings={rates.settings} />
        <Printed />
        <Compare curtains={curtains} setSel={setSel} />
        <Measure />
        <Faq items={faqs(rates.settings, curtains)} />
        <Related items={[
          ['Blinds', 'Eleven kinds of blind, from ₹55 per sq ft.', 'blinds.html', 'img/blinds/zebra-640.webp', 'Cream zebra blinds in a dining room'],
          ['Motorisation', 'Curtains and blinds that open by remote or from your phone.', 'motorisation.html', 'img/motorised.webp', 'A remote beside a motorised curtain track'],
          ['Skylights', 'Skylight shades, pergolas and louvers for terraces and sit-outs.', 'skylights.html', 'img/skylight-indoor.webp', 'Honeycomb blinds on a sloped skylight'],
        ]} />
        <Visit title="We bring the curtains to you" pic="curtains-evening" cta={['Start my estimate', 'estimate.html?cat=curtains']}
          text="Get your rough price, then our team will call to book a visit at your home in Coimbatore. We bring the fabric catalogues with us, and there’s no charge for the estimate." />
      </main>
      <Footer links={FOOT} />
      <PhoneBar />
    </>
  );
}
