import { useEffect, useMemo, useState } from 'react';
import { Header, Footer, Swatch, PHONE, TEL } from '../site/Chrome';
import { INFO, GROUPS, Q_WHERE, Q_WANT, Q_BUDGET, VIDEOS, suggest, faqs } from './blinds-data';

const ww = () => globalThis.WW;
const inr = (n) => n.toLocaleString('en-IN');
const UNITS = [['ft', 'feet'], ['in', 'inches'], ['cm', 'cm'], ['m', 'metres']];
const UNIT_SHORT = { ft: 'ft', in: 'in', cm: 'cm', m: 'm' };
const LINKS = [['Blinds', 'blinds.html'], ['Curtains', './#collections'], ['Prices', './#prices'], ['Gallery', './#gallery'], ['Motorisation', './#motorisation'], ['Our works', '#works'], ['Contact', '#visit']];
const FOOT = [['Blinds', 'blinds.html'], ['Curtains', './#collections'], ['Prices', './#prices'], ['Gallery', './#gallery'], ['Our works', '#works']];

function Pic({ id, alt, sizes = '(min-width: 1024px) 50vw, 100vw', eager, className = '', full = 1200 }) {
  return (
    <img src={`img/blinds/${id}.webp`} srcSet={`img/blinds/${id}-640.webp 640w, img/blinds/${id}.webp ${full}w`} sizes={sizes}
      alt={alt} width="1200" height="800" loading={eager ? 'eager' : 'lazy'} {...(eager ? { fetchpriority: 'high' } : {})} decoding="async" className={className} />
  );
}

/* The customer's window, drawn to scale, with the chosen blind on it. */
function Drawing({ wFt, hFt, w, h, unit, id, name }) {
  const VW = 520; const VH = 430;
  const scale = Math.min((VW - 130) / Math.max(wFt, 8), (VH - 110) / Math.max(hFt, 8));
  const W = Math.max(wFt * scale, 26); const H = Math.max(hFt * scale, 26);
  const x = 80 + (VW - 110 - W) / 2; const y = 56 + (VH - 86 - H) / 2;
  const down = H * 0.62;
  const cloth = '#FBF9F5';
  const parts = [];
  const rows = (gap, height, fill, end = down, op) => { for (let i = 0, yy = 0; yy < end - 1; i++, yy += gap) parts.push(<rect key={`r${i}`} x={x} y={y + yy} width={W} height={Math.min(height, end - yy)} fill={fill} opacity={op} />); };
  const cols = (count, cover, fill, gapPx = 2) => { const cw = (W * cover) / count; for (let i = 0; i < count; i++) parts.push(<rect key={`c${i}`} x={x + i * cw} y={y} width={Math.max(cw - gapPx, 1)} height={H} fill={fill} />); };
  if (id === 'roller') parts.push(<rect key="s" x={x} y={y} width={W} height={down} fill={cloth} />, <rect key="b" x={x} y={y + down - 4} width={W} height={4} fill="#C59B63" />);
  else if (id === 'zebra') { let band = 0; for (let yy = 0; yy < down; yy += 16, band++) parts.push(<rect key={band} x={x} y={y + yy} width={W} height={Math.min(16, down - yy)} fill={cloth} opacity={band % 2 ? 0.42 : 1} />); }
  else if (id === 'venetian') rows(8, 5.5, cloth);
  else if (id === 'wooden') rows(12, 9, '#B98A52');
  else if (id === 'vertical') cols(Math.max(5, Math.round((W * 0.68) / 14)), 0.68, cloth);
  else if (id === 'panel') cols(Math.max(2, Math.min(4, Math.round(W / 70))), 0.72, cloth, 4);
  else if (id === 'roman') { parts.push(<rect key="s" x={x} y={y} width={W} height={down} fill="#E4CFA4" />); for (let i = 1; i < 5; i++) parts.push(<rect key={`f${i}`} x={x} y={y + down - i * 11} width={W} height={2} fill="#9E7B32" />); }
  else if (id === 'honeycomb') { parts.push(<rect key="s" x={x} y={y} width={W} height={down} fill={cloth} />); for (let yy = 7, i = 0; yy < down; yy += 7, i++) parts.push(<rect key={`p${i}`} x={x} y={y + yy} width={W} height={1.5} fill="#C9C2B4" />); }
  else if (id === 'monsoon') parts.push(<rect key="s" x={x} y={y} width={W} height={H * 0.82} fill={cloth} opacity=".45" />, <rect key="b" x={x} y={y + H * 0.82 - 5} width={W} height={5} fill={cloth} />);
  else if (id === 'zipper') parts.push(<rect key="s" x={x} y={y} width={W} height={H * 0.72} fill="#1D2C4C" />, <rect key="l" x={x - 3} y={y} width={7} height={H} fill="#C59B63" />, <rect key="r" x={x + W - 4} y={y} width={7} height={H} fill="#C59B63" />);
  else if (id === 'insulated') { parts.push(<rect key="s" x={x + 10} y={y + 10} width={Math.max(W - 20, 4)} height={Math.max(down - 10, 4)} fill={cloth} />); }
  const label = (v) => `${+Number(v).toFixed(2)} ${UNIT_SHORT[unit]}`;
  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} className="block w-full h-auto" role="img" aria-label={`${name} on a window ${label(w)} wide and ${label(h)} tall, drawn to scale`}>
      <rect x={x} y={y} width={W} height={H} fill="#5B76AD" />
      <g key={id} className="draw-drop" style={{ transformOrigin: `${x + W / 2}px ${y}px` }}>{parts}</g>
      {id === 'insulated' && <rect x={x + 5} y={y + 5} width={Math.max(W - 10, 2)} height={Math.max(H - 10, 2)} fill="none" stroke="#fff" strokeWidth="1.5" />}
      <rect x={x} y={y} width={W} height={H} fill="none" stroke="#fff" strokeWidth="5" />
      <g stroke="#F2D888" strokeWidth="1.5">
        <line x1={x} x2={x + W} y1={y - 22} y2={y - 22} /><line x1={x} x2={x} y1={y - 29} y2={y - 15} /><line x1={x + W} x2={x + W} y1={y - 29} y2={y - 15} />
        <line x1={x - 22} x2={x - 22} y1={y} y2={y + H} /><line x1={x - 29} x2={x - 15} y1={y} y2={y} /><line x1={x - 29} x2={x - 15} y1={y + H} y2={y + H} />
      </g>
      <text x={x + W / 2} y={y - 31} textAnchor="middle" fill="#F2D888" fontSize="16" fontWeight="600" className="tabular-nums">{label(w)}</text>
      <text x={x - 34} y={y + H / 2} textAnchor="middle" fill="#F2D888" fontSize="16" fontWeight="600" transform={`rotate(-90 ${x - 34} ${y + H / 2})`}>{label(h)}</text>
    </svg>
  );
}

function PriceBoard({ blinds, settings, size, setSize, sel, setSel }) {
  const W = ww();
  const wFt = W.toFeet(size.w, size.unit); const hFt = W.toFeet(size.h, size.unit); const qty = Number(size.qty);
  const tooBig = wFt > 60 || hFt > 40;
  const okQty = Number.isInteger(qty) && qty >= 1 && qty <= 200;
  const ok = wFt > 0 && hFt > 0 && !tooBig && okQty;
  const unitWord = UNITS.find((u) => u[0] === size.unit)[1];
  const priced = useMemo(() => blinds.map((b) => ({ b, r: ok ? W.calc('blinds', b, [{ room: '', w: size.w, h: size.h, unit: size.unit, qty }], settings) : null })), [blinds, settings, size, ok]);
  const cur = priced.find((x) => x.b.id === sel) || priced[0];
  const round = (n) => Math.round(n * 100) / 100;
  const href = `estimate.html?cat=blinds&p=${cur.b.id}${ok ? `&w=${round(wFt)}&h=${round(hFt)}&qty=${qty}` : ''}`;
  const wa = ok ? `https://wa.me/?text=${encodeURIComponent(`Window Works rough price\n${cur.b.name}, ${size.w} × ${size.h} ${unitWord}${qty > 1 ? `, ${qty} windows` : ''}\n${W.rupees(cur.r.low)} to ${W.rupees(cur.r.high)} plus GST\nThe final price is confirmed after measuring at home.`)}` : null;
  const set = (k) => (e) => setSize({ ...size, [k]: e.target.value });
  const fieldErr = !(wFt > 0 && hFt > 0) ? 'Enter both the width and the height to see prices.' : tooBig ? `That looks very large. Is the unit set to ${unitWord}?` : !okQty ? 'How many should be a whole number, 1 or more.' : null;
  return (
    <section id="price" className="bg-linen pt-20 lg:pt-28">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-x-8 gap-y-3 items-end mb-10">
          <h2 className="rise lg:col-span-8 font-serif font-medium tracking-tight leading-[1.08] text-[2.25rem] sm:text-[2.75rem] lg:text-[3.5rem]">Price every blind for your window</h2>
          <p className="rise lg:col-span-4 text-[1.0625rem] leading-relaxed">Type your size and all 11 prices change. No number or sign-up needed for this.</p>
        </div>
        <div className="panes lg:grid-cols-12">
          <div className="pane !bg-navy text-white lg:col-span-5 p-5 lg:p-8">
            <form className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-4 mb-3" onSubmit={(e) => e.preventDefault()}>
              <label className="text-sm font-semibold">Width<input className="line-field line-field-light font-normal mt-1 tabular-nums" type="number" inputMode="decimal" min="0" step="any" value={size.w} onChange={set('w')} /></label>
              <label className="text-sm font-semibold">Height<input className="line-field line-field-light font-normal mt-1 tabular-nums" type="number" inputMode="decimal" min="0" step="any" value={size.h} onChange={set('h')} /></label>
              <label className="text-sm font-semibold">Unit<select className="line-field line-field-light unit-select font-normal mt-1" value={size.unit} onChange={set('unit')}>{UNITS.map(([v, t]) => <option key={v} value={v}>{t}</option>)}</select></label>
              <label className="text-sm font-semibold">How many<input className="line-field line-field-light font-normal mt-1 tabular-nums" type="number" inputMode="numeric" min="1" step="1" value={size.qty} onChange={set('qty')} /></label>
            </form>
            {ok ? <Drawing wFt={wFt} hFt={hFt} w={size.w} h={size.h} unit={size.unit} id={cur.b.id} name={cur.b.name} /> : <p role="alert" className="py-16 text-center text-gold-light font-medium">{fieldErr}</p>}
            <div aria-live="polite">
              <h3 className="mt-2 font-serif text-2xl font-medium leading-tight">{cur.b.name}</h3>
              <p className="font-serif font-medium tracking-tight leading-[1.1] text-[2.25rem] sm:text-[2.75rem] tabular-nums">{ok ? <>{W.rupees(cur.r.low)} <span className="text-brass">to</span> {W.rupees(cur.r.high)}</> : `from ₹${inr(cur.b.rate)} per sq ft`}</p>
              <p className="text-[.9375rem] text-[#E8E3D6] mt-2 mb-5">Plus GST. {ok ? `Counted as ${cur.r.lines[0].measure} per window. ` : ''}A guide from starting rates. The final price comes after we measure at your home.</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href={href} className="slat-btn slat-btn-gold"><span>Get a full estimate</span><span aria-hidden="true">→</span></a>
              {wa && <a href={wa} target="_blank" rel="noopener" className="line-link font-medium text-[.9375rem]">Send on WhatsApp</a>}
            </div>
          </div>
          <div className="pane !bg-navy lg:col-span-7">
            <div className="board" role="group" aria-label="Rough price for each blind">
              {priced.map(({ b, r }) => (
                <button key={b.id} type="button" className="board-row" aria-pressed={b.id === cur.b.id} onClick={() => setSel(b.id)}>
                  <span className="board-pic"><Pic id={b.id} alt="" sizes="96px" /></span>
                  <span className="min-w-0"><strong className="block font-semibold text-[1.0625rem] leading-snug">{b.name}</strong><small className="block text-[.875rem] leading-snug mt-0.5 opacity-80">from ₹{inr(b.rate)} per sq ft</small></span>
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

function ChoiceGroup({ legend, options, value, onChange }) {
  return (
    <fieldset className="border-0 p-0 m-0 mb-7">
      <legend className="font-semibold text-[1.0625rem] mb-3 p-0">{legend}</legend>
      <div className="choice-set">{options.map(([v, t]) => <button key={v} type="button" className="choice" aria-pressed={value === v} onClick={() => onChange(v)}>{t}</button>)}</div>
    </fieldset>
  );
}

function Chooser({ blinds, settings, size, setSel }) {
  const W = ww();
  const [where, setWhere] = useState('bedroom'); const [want, setWant] = useState('dark'); const [budget, setBudget] = useState('any');
  const picks = useMemo(() => suggest(blinds, where, want, budget), [blinds, where, want, budget]);
  const ok = W.toFeet(size.w, size.unit) > 0 && W.toFeet(size.h, size.unit) > 0 && W.toFeet(size.w, size.unit) <= 60 && W.toFeet(size.h, size.unit) <= 40;
  const money = (b) => { if (!ok) return `from ₹${inr(b.rate)} per sq ft`; const r = W.calc('blinds', b, [{ room: '', w: size.w, h: size.h, unit: size.unit, qty: 1 }], settings); return `${W.rupees(r.low)} to ${W.rupees(r.high)} for one window`; };
  return (
    <section id="choose" className="bg-sand mt-24 lg:mt-32 py-20 lg:py-28">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-10 grid lg:grid-cols-12 gap-x-12 gap-y-10">
        <div className="lg:col-span-5">
          <h2 className="rise font-serif font-medium tracking-tight leading-[1.08] text-[2.25rem] sm:text-[2.75rem] lg:text-[3.5rem] mb-8">Which blind suits your room?</h2>
          <ChoiceGroup legend="Where is the window?" options={Q_WHERE} value={where} onChange={setWhere} />
          <ChoiceGroup legend="What do you want most?" options={Q_WANT} value={want} onChange={setWant} />
          <ChoiceGroup legend="And the budget?" options={Q_BUDGET} value={budget} onChange={setBudget} />
        </div>
        <div className="lg:col-span-7" aria-live="polite">
          <div className="panes">
            {picks.map((b, i) => (
              <article key={b.id} className={`pane sm:!grid ${i === 0 ? 'sm:grid-cols-[3fr_2fr]' : 'sm:grid-cols-[2fr_3fr]'}`}>
                <div className="pane-photo aspect-[16/10] sm:aspect-auto sm:min-h-[210px] relative"><Pic id={b.id} alt={INFO[b.id].alt} sizes="(min-width: 1024px) 30vw, 100vw" className="sm:absolute sm:inset-0" /></div>
                <div className="p-5 lg:p-7">
                  <h3 className="font-serif text-2xl font-medium leading-tight mb-1">{b.name}</h3>
                  <p className="font-bold text-[.9375rem] tabular-nums mb-3">{money(b)}</p>
                  <p className="text-[.9375rem] leading-relaxed mb-4">{INFO[b.id].best}. {INFO[b.id].light}.</p>
                  <a href="#price" onClick={() => setSel(b.id)} className="line-link font-semibold text-[.9375rem]">See it on my window →</a>
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

function TypePane({ b, setSel, span = '', dark, tall, wide }) {
  const i = INFO[b.id];
  return (
    <article id={b.id} className={`pane ${span} ${dark ? '!bg-navy text-white' : ''} ${wide ? 'lg:!grid lg:grid-cols-[7fr_5fr]' : ''} scroll-mt-24`}>
      <div className={`pane-photo blind ${wide ? 'aspect-[4/3] lg:aspect-[16/9]' : tall ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}><Pic id={b.id} alt={i.alt} /></div>
      <div className="p-6 lg:p-8 flex flex-col flex-1">
        <div className="flex items-baseline justify-between gap-4 mb-3">
          <h3 className="font-serif text-[1.75rem] font-medium leading-tight">{b.name}</h3>
          <p className={`shrink-0 font-bold text-[.9375rem] tabular-nums ${dark ? 'text-gold-light' : ''}`}>₹{inr(b.rate)}<span className="font-medium"> / sq ft</span></p>
        </div>
        <p className="text-[1rem] leading-relaxed mb-3 flex-1">{i.long}</p>
        <p className={`text-[.9375rem] font-medium mb-4 ${dark ? 'text-[#E8E3D6]' : 'text-muted'}`}>Best for: {i.best.toLowerCase()}</p>
        <div className="flex flex-wrap gap-x-6 gap-y-1">
          <a href="#price" onClick={() => setSel(b.id)} className={`line-link font-semibold text-[.9375rem] ${dark ? 'text-gold-light' : ''}`}>Price this blind →</a>
        </div>
      </div>
    </article>
  );
}

const SPANS = [['lg:col-span-7', 'lg:col-span-5', 'lg:col-span-5', 'lg:col-span-7'], ['lg:col-span-5', 'lg:col-span-7', 'lg:col-span-12'], ['lg:col-span-7', 'lg:col-span-5', 'lg:col-span-5', 'lg:col-span-7']];

function Types({ blinds, setSel }) {
  const by = (id) => blinds.find((b) => b.id === id);
  return (
    <section id="types" className="bg-linen pt-24 lg:pt-32">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-10">
        <h2 className="rise font-serif font-medium tracking-tight leading-[1.08] text-[2.25rem] sm:text-[2.75rem] lg:text-[3.5rem] mb-14">All 11 blinds, explained</h2>
        {GROUPS.map((g, gi) => (
          <div key={g.title} className={gi ? 'mt-16 lg:mt-24' : ''}>
            <div className="grid lg:grid-cols-12 gap-x-8 gap-y-1 mb-6 items-baseline">
              <h3 className="rise lg:col-span-5 font-serif text-[1.75rem] lg:text-[2.25rem] font-medium leading-tight">{g.title}</h3>
              <p className="rise lg:col-span-7 text-[1.0625rem] leading-relaxed">{g.note}</p>
            </div>
            <div className="panes md:grid-cols-2 lg:grid-cols-12">
              {g.ids.map((id, i) => <TypePane key={id} b={by(id)} setSel={setSel} span={SPANS[gi][i]} dark={gi === 2 && (i === 0 || i === 3)} tall={SPANS[gi][i] !== 'lg:col-span-5'} wide={SPANS[gi][i] === 'lg:col-span-12'} />)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Printed() {
  return (
    <section className="mt-24 lg:mt-32 grid lg:grid-cols-12 bg-navy text-white">
      <div className="lg:col-span-7 blind relative min-h-[300px] lg:min-h-[480px] overflow-hidden"><Swatch className="absolute inset-0 w-full h-full" /></div>
      <div className="lg:col-span-5 p-7 lg:p-14 flex flex-col justify-center">
        <h2 className="rise font-serif text-[2rem] lg:text-[2.75rem] font-medium leading-[1.1] mb-4">Printed to your own theme</h2>
        <p className="rise text-[1.0625rem] leading-relaxed">Window Works prints blinds, curtains and sheers to your choice, with a range of designs to match your room. Tell us the look you want when we visit.</p>
      </div>
    </section>
  );
}

function Compare({ blinds, setSel }) {
  return (
    <section id="compare" className="bg-linen py-24 lg:py-32">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-10">
        <h2 className="rise font-serif font-medium tracking-tight leading-[1.08] text-[2.25rem] sm:text-[2.75rem] lg:text-[3.5rem] mb-10">Compare them side by side</h2>
        <div className="spec-wrap" role="region" aria-label="Comparison of all 11 blinds" tabIndex={0}>
          <table className="spec">
            <thead><tr><th scope="col">Blind</th><th scope="col" className="n">From, per sq ft</th><th scope="col">How it controls light</th><th scope="col">Best for</th><th scope="col">Outdoors</th></tr></thead>
            <tbody>
              {blinds.map((b) => (
                <tr key={b.id}>
                  <th scope="row"><a href="#price" onClick={() => setSel(b.id)} className="line-link font-semibold">{b.name}</a></th>
                  <td data-label="From, per sq ft" className="n tabular-nums font-semibold">₹{inr(b.rate)}</td>
                  <td data-label="How it controls light">{INFO[b.id].light}</td>
                  <td data-label="Best for">{INFO[b.id].best}</td>
                  <td data-label="Outdoors">{INFO[b.id].outdoor ? 'Yes' : 'No'}</td>
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
    <svg viewBox="0 0 420 300" className="block w-full h-auto" role="img" aria-label="A window with its width measured across the frame and its height from top to bottom">
      <rect x="110" y="60" width="210" height="205" fill="#5B76AD" /><rect x="110" y="60" width="210" height="205" fill="none" stroke="#081C45" strokeWidth="6" />
      <line x1="215" x2="215" y1="60" y2="265" stroke="#081C45" strokeWidth="4" />
      <g stroke="#9E7B32" strokeWidth="2"><line x1="110" x2="320" y1="34" y2="34" /><line x1="110" x2="110" y1="24" y2="44" /><line x1="320" x2="320" y1="24" y2="44" /><line x1="80" x2="80" y1="60" y2="265" /><line x1="70" x2="90" y1="60" y2="60" /><line x1="70" x2="90" y1="265" y2="265" /></g>
      <text x="215" y="22" textAnchor="middle" fill="#081C45" fontSize="17" fontWeight="600">Width</text>
      <text x="58" y="162" textAnchor="middle" fill="#081C45" fontSize="17" fontWeight="600" transform="rotate(-90 58 162)">Height</text>
    </svg>
  );
}

function Measure() {
  const steps = [
    ['Measure the width', 'Run a tape across the window, from one side of the frame to the other.'],
    ['Measure the height', 'Then go from the top of the frame to the bottom. A rough figure is fine.'],
    ['Do each window', 'Windows that look the same often differ a little, so measure each one if you can.'],
  ];
  return (
    <section id="measure" className="bg-sand py-20 lg:py-28">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-10 grid lg:grid-cols-12 gap-x-12 gap-y-10 items-center">
        <div className="lg:col-span-7">
          <h2 className="rise font-serif font-medium tracking-tight leading-[1.08] text-[2.25rem] sm:text-[2.75rem] lg:text-[3.5rem] mb-8">How to measure your window</h2>
          <ul className="list-none p-0 m-0 grid sm:grid-cols-3 gap-6">{steps.map(([t, d]) => <li key={t} className="rise rail pt-3"><h3 className="font-semibold text-lg mb-1">{t}</h3><p className="text-[1rem] leading-relaxed">{d}</p></li>)}</ul>
          <p className="rise text-[1.0625rem] leading-relaxed mt-8">Your figure is only for the rough price. We measure again at your home before the final price.</p>
        </div>
        <div className="rise lg:col-span-5 relative pb-16 sm:pb-20">
          <Pic id="measure" alt="A tape measure, pencil and notepad on a granite window sill under a linen Roman blind" sizes="(min-width: 1024px) 40vw, 100vw" full={1376} className="block w-full aspect-[4/3] object-cover" />
          <div className="absolute left-0 bottom-0 w-[58%] sm:w-[48%] lg:w-[58%] bg-white border-[3px] border-navy p-3 sm:p-4"><MeasureDiagram /></div>
        </div>
      </div>
    </section>
  );
}

function Works() {
  const [cur, setCur] = useState(0); const [playing, setPlaying] = useState(false);
  const [id, title] = VIDEOS[cur];
  return (
    <section id="works" className="bg-linen py-24 lg:py-32">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-x-8 gap-y-3 items-end mb-10">
          <h2 className="rise lg:col-span-7 font-serif font-medium tracking-tight leading-[1.08] text-[2.25rem] sm:text-[2.75rem] lg:text-[3.5rem]">See our blinds on real jobs</h2>
          <p className="rise lg:col-span-5 text-[1.0625rem] leading-relaxed">Videos from Window Works, including a look inside our factory.</p>
        </div>
        <div className="panes lg:grid-cols-12">
          <div className="pane !bg-navy lg:col-span-8">
            <div className="relative aspect-video bg-navy">
              {playing ? <iframe className="absolute inset-0 w-full h-full" src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`} title={title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
                : (
                  <button type="button" className="video-cover" onClick={() => setPlaying(true)} aria-label={`Play video: ${title}`}>
                    <img src={`img/yt-${id}.jpg`} alt="" width="480" height="360" loading="lazy" />
                    <span className="video-play" aria-hidden="true"><svg viewBox="0 0 24 24" width="28" height="28"><path d="M6 3l15 9-15 9z" fill="currentColor" /></svg></span>
                  </button>
                )}
            </div>
            <p className="text-white font-serif text-2xl font-medium p-5 lg:p-7">{title}</p>
          </div>
          <div className="pane !bg-navy lg:col-span-4">
            <div className="board h-full">
              {VIDEOS.map(([vid, t], i) => (
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

function Faq({ settings }) {
  return (
    <section id="faq" className="bg-sand py-20 lg:py-28">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-10 grid lg:grid-cols-12 gap-x-12 gap-y-8">
        <h2 className="rise lg:col-span-4 font-serif font-medium tracking-tight leading-[1.08] text-[2.25rem] sm:text-[2.75rem] lg:text-[3.5rem]">Questions people ask</h2>
        <div className="lg:col-span-8">
          {faqs(settings).map(([q, a]) => (
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

function Visit() {
  const steps = [
    ['Catalogues at your door', 'See everything against your own wall colours before you order.'],
    ['Measured in front of you', 'Our team visits and takes every measurement with you there.'],
    ['Made by our own team', 'Processed and checked at our factory, then fitted and inspected at your home.'],
    ['No outlet costs', 'We don’t carry the cost of running an outlet, and that benefits you.'],
  ];
  return (
    <section id="visit" className="relative bg-navy text-white">
      <div className="absolute inset-0 pane-photo"><Pic id="evening" alt="" sizes="100vw" full={1376} /></div>
      <div className="absolute inset-0 bg-navy/80" />
      <div className="relative max-w-[1440px] mx-auto px-4 lg:px-10 py-24 lg:py-32 grid lg:grid-cols-12 gap-x-12 gap-y-12">
        <div className="lg:col-span-6">
          <h2 className="rise font-serif font-medium tracking-tight leading-[1.08] text-[2.25rem] sm:text-[2.75rem] lg:text-[3.5rem] mb-5">We bring the blinds to you</h2>
          <p className="rise text-[1.0625rem] leading-relaxed text-[#F4F1E9] max-w-xl mb-8">Get your rough price, then our team will call to book a visit at your home in Coimbatore. There’s no charge for the estimate.</p>
          <div className="rise flex flex-wrap items-center gap-x-6 gap-y-4">
            <a href="estimate.html?cat=blinds" className="slat-btn slat-btn-gold"><span>Start my estimate</span><span aria-hidden="true">→</span></a>
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

export default function BlindsPage() {
  const [rates, setRates] = useState(() => ww().DEFAULTS);
  const [size, setSize] = useState({ w: '5', h: '6', unit: 'ft', qty: '1' });
  const [sel, setSel] = useState('roller');
  const blinds = rates.blinds;

  // The server page uses the published rates and a sample size. Saved ones are applied once in the browser.
  useEffect(() => {
    setRates(ww().rates());
    const saved = ww().store.get('ww-size', null);
    if (saved && saved.w !== undefined && saved.h !== undefined && UNITS.some((u) => u[0] === saved.unit)) setSize({ w: String(saved.w), h: String(saved.h), unit: saved.unit, qty: String(saved.qty || 1) });
  }, []);
  const first = useMemo(() => ({ done: false }), []);
  useEffect(() => { if (!first.done) { first.done = true; return; } ww().store.set('ww-size', size); }, [size, first]);

  return (
    <>
      <p className="bg-midnight text-white text-sm px-4 lg:px-10 py-2">Preview only. Rates are real starting rates, but nothing you enter reaches Window Works, and product advice is still to be checked by them.</p>
      <Header links={LINKS} current="blinds.html" />
      <main>
        <section className="bg-sand">
          <div className="max-w-[1440px] mx-auto px-4 lg:px-10 pt-5 lg:pt-7">
            <nav aria-label="Breadcrumb" className="text-[.9375rem] mb-4 lg:mb-5"><a href="./" className="line-link">Home</a> <span aria-hidden="true" className="mx-1.5">/</span> <span aria-current="page" className="font-medium">Blinds</span></nav>
            <div className="grid lg:grid-cols-12 gap-x-10 gap-y-4 items-end pb-7 lg:pb-9">
              <h1 className="lg:col-span-8 font-serif font-medium tracking-tight text-[2.75rem] leading-[1.05] sm:text-[4rem] lg:text-[5rem] xl:text-[5.75rem]">Window blinds in Coimbatore</h1>
              <div className="lg:col-span-4">
                <p className="text-[1.0625rem] sm:text-lg leading-relaxed mb-5">Eleven kinds, made to measure, from ₹55 per sq ft before GST. See the price for your own window right here.</p>
                <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
                  <a href="#price" className="slat-btn"><span>Price my window</span><span aria-hidden="true">→</span></a>
                  <a href="#choose" className="line-link font-semibold">Help me choose</a>
                </div>
              </div>
            </div>
          </div>
          <div className="hero-roll bg-navy aspect-[4/3] sm:aspect-[16/8] lg:aspect-auto lg:h-[58vh] lg:min-h-[420px] overflow-hidden"><Pic id="hero" alt="Cream zebra blinds in a bright Coimbatore living room with coconut palms outside" sizes="100vw" eager full={1376} className="w-full h-full object-cover" /></div>
        </section>
        <PriceBoard blinds={blinds} settings={rates.settings} size={size} setSize={setSize} sel={sel} setSel={setSel} />
        <Chooser blinds={blinds} settings={rates.settings} size={size} setSel={setSel} />
        <Types blinds={blinds} setSel={setSel} />
        <Printed />
        <Compare blinds={blinds} setSel={setSel} />
        <Measure />
        <Works />
        <Faq settings={rates.settings} />
        <Visit />
      </main>
      <Footer links={FOOT} />
      <div className="phone-bar">
        <a href={TEL} className="phone-bar-call">Call us</a>
        <a href="#price" className="phone-bar-price">Price my window</a>
      </div>
    </>
  );
}
