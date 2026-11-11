import { useEffect, useMemo, useState } from 'react';
import { Header, Footer } from '../site/Chrome';
import { ww, inr, H2, LINKS, FOOT, Pic, useSizeCheck, SizeForm, Hero, Works, Faq, Visit, Related, PreviewNote, PhoneBar, rememberedSize } from './common';
import CurtainDrawing from './CurtainDrawing';

// Videos from the Window Works YouTube channel. Titles are shortened from theirs.
export const VIDEOS = [
  ['qwkmWc47FBs', 'Blinds controlled from a phone app'],
  ['L4cqZRJlWSI', 'Motorised patio blinds'],
  ['muNrgheCUis', 'Blinds for a single window'],
  ['Ki4EEmg8DaM', 'Blinds for a corner window'],
  ['D8hxc0vXg7U', 'Kitchen blinds'],
  ['KVRXYsUQVrs', 'Pergoflex over a sit-out'],
];

export const faqs = (s, curtainRate) => [
  ['How much do motorised curtains cost in Coimbatore?', `The motor starts from ₹${inr(s.motorFrom)} plus GST. The curtain fabric is priced like any other curtain, from ₹${inr(curtainRate)} per metre plus GST. Enter your window size on this page to see both.`],
  ['Can I open them from my phone?', 'Yes, we have fitted blinds that are controlled from a mobile app. There is a video of one on this page. Ask our team which motor suits your windows.'],
  ['What can be motorised?', 'Curtains, blinds including outdoor patio blinds, skylight shades and Pergoflex roofs.'],
  ['Can my existing curtains be motorised?', 'Ask our team. It depends on your track and window, and we check it when we visit.'],
  ['Who fits the motor?', 'Our own team. Everything is checked at our factory before it leaves, and we inspect it again at your home after fitting.'],
  ['Is the price on this page final?', 'No, it is a rough guide based on our starting rates, plus GST. The motor, fabric and fittings you choose decide the final figure, and we confirm it after measuring at your home.'],
];

function PriceBoard({ settings, motorised, size, setSize }) {
  const W = ww();
  const { wFt, hFt, qty, ok, unitWord, err } = useSizeCheck(size);
  const r = ok ? W.calc('curtains', motorised, [{ room: '', w: size.w, h: size.h, unit: size.unit, qty }], settings) : null;
  const motors = settings.motorFrom * (ok ? qty : 1);
  const round = (n) => Math.round(n * 100) / 100;
  const href = `estimate.html?cat=curtains&p=motorised${ok ? `&w=${round(wFt)}&h=${round(hFt)}&qty=${qty}` : ''}`;
  const wa = ok ? `https://wa.me/?text=${encodeURIComponent(`Window Works rough price\nMotorised curtains, ${size.w} × ${size.h} ${unitWord}${qty > 1 ? `, ${qty} windows` : ''}\nFabric ${W.rupees(r.low)} to ${W.rupees(r.high)} plus GST\nMotor from ${W.rupees(motors)} plus GST\nThe final price is confirmed after measuring at home.`)}` : null;
  return (
    <section id="price" className="bg-linen pt-20 lg:pt-28">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-x-8 gap-y-3 items-end mb-10">
          <h2 className={`rise lg:col-span-8 ${H2}`}>Price motorised curtains for your window</h2>
          <p className="rise lg:col-span-4 text-[1.0625rem] leading-relaxed">Two parts make the price: the curtain fabric, by the metre, and the motor. Type your size to see both.</p>
        </div>
        <div className="panes lg:grid-cols-12">
          <div className="pane !bg-navy text-white lg:col-span-6 p-5 lg:p-8">
            <SizeForm size={size} setSize={setSize} />
            {ok ? <CurtainDrawing wFt={wFt} hFt={hFt} w={size.w} h={size.h} unit={size.unit} id="motorised" name="Motorised curtains" /> : <p role="alert" className="py-16 text-center text-gold-light font-medium">{err}</p>}
          </div>
          <div className="pane lg:col-span-6 p-6 lg:p-10" aria-live="polite">
            <h3 className="font-serif text-2xl font-medium leading-tight mb-6">Motorised curtains{ok && qty > 1 ? `, ${qty} windows` : ''}</h3>
            <dl className="text-[1.0625rem] border-t-[3px] border-navy">
              <div className="flex justify-between gap-4 py-4 border-b border-rule"><dt>Curtain fabric{ok ? `, about ${r.lines[0].measure} a window` : ''}</dt><dd className="font-semibold tabular-nums text-right">{ok ? `${W.rupees(r.low)} to ${W.rupees(r.high)}` : `from ₹${inr(motorised.rate)} per metre`}</dd></div>
              <div className="flex justify-between gap-4 py-4 border-b border-rule"><dt>Motor{ok && qty > 1 ? `, one a window` : ''}</dt><dd className="font-semibold tabular-nums text-right">from {W.rupees(motors)}</dd></div>
              <div className="flex justify-between gap-4 py-4 border-b-[3px] border-navy"><dt className="font-semibold">Together, from</dt><dd className="font-serif font-medium text-[2rem] sm:text-[2.5rem] leading-none tabular-nums text-right">{ok ? W.rupees(r.low + motors) : '–'}</dd></div>
            </dl>
            <p className="text-[.9375rem] text-muted mt-4 mb-7">All plus GST. A guide from starting rates. The motor, fabric and fittings you choose decide the final price, which comes after we measure at your home.</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href={href} className="slat-btn"><span>Get a full estimate</span><span aria-hidden="true">→</span></a>
              {wa && <a href={wa} target="_blank" rel="noopener" className="line-link font-medium text-[.9375rem]">Send on WhatsApp</a>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhatWeMotorise({ settings, curtainRate }) {
  const items = [
    ['Curtains', `Sheers and curtains on a motorised track. Fabric from ₹${inr(curtainRate)} per metre, motor from ₹${inr(settings.motorFrom)}.`, 'curtains.html#motorised', 'See curtains', <img src="img/p-motor.webp" alt="A curtain track with a motor, hidden in a ceiling cove" width="1024" height="1024" loading="lazy" />],
    ['Blinds', 'Roller and other blinds that rise and fall at a touch, on single windows, corner windows and kitchens.', 'blinds.html', 'See blinds', <Pic dir="blinds" id="roller" alt="An ivory roller blind half lowered on a bedroom window" sizes="(min-width: 1024px) 25vw, 100vw" />],
    ['Patio and outdoor blinds', 'Large outdoor blinds for patios and sit-outs, lowered and raised by motor.', '#works', 'Watch the video', <Pic dir="blinds" id="zipper" alt="A dark outdoor zipper blind half lowered around a covered terrace" sizes="(min-width: 1024px) 25vw, 100vw" />],
    ['Skylights and Pergoflex', 'Fabric roofs and skylight shades that open and close over a terrace or sit-out.', 'skylights.html', 'See skylights', <img src="img/skylight-outdoor.webp" alt="A retractable fabric shade on a terrace of an apartment block" width="600" height="600" loading="lazy" />],
  ];
  return (
    <section id="what" className="bg-sand py-24 lg:py-32">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-x-8 gap-y-3 items-end mb-12">
          <h2 className={`rise lg:col-span-7 ${H2}`}>What we motorise</h2>
          <p className="rise lg:col-span-5 text-[1.0625rem] leading-relaxed">Inside the house and out. Each motor is fitted by our own team.</p>
        </div>
        <div className="panes sm:grid-cols-2 lg:grid-cols-4">
          {items.map(([t, d, href, more, img], i) => (
            <article key={t} className={`pane ${i === 1 ? '!bg-navy text-white' : ''}`}>
              <div className="pane-photo slide aspect-[4/3]">{img}</div>
              <div className="p-6 lg:p-7 flex flex-col flex-1">
                <h3 className="font-serif text-[1.625rem] font-medium leading-tight mb-2">{t}</h3>
                <p className="text-[1rem] leading-relaxed mb-4 flex-1">{d}</p>
                <a href={href} className={`line-link font-semibold text-[.9375rem] w-fit ${i === 1 ? 'text-gold-light' : ''}`}>{more} →</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Control() {
  return (
    <section className="grid lg:grid-cols-12 bg-navy text-white">
      <div className="lg:col-span-6 slide relative min-h-[300px] lg:min-h-[520px] overflow-hidden pane-photo"><Pic dir="pages" id="motor-remote" alt="A plain white remote on a teak side table, with sheer curtains behind" sizes="(min-width: 1024px) 50vw, 100vw" className="absolute inset-0" /></div>
      <div className="lg:col-span-6 p-7 lg:p-14 flex flex-col justify-center">
        <h2 className="rise font-serif text-[2rem] lg:text-[2.75rem] font-medium leading-[1.1] mb-8">Open them from the sofa, or from your phone</h2>
        <ul className="list-none p-0 m-0 grid gap-7">
          <li className="rise border-t-[3px] border-gold pt-3"><h3 className="font-semibold text-lg mb-1">By remote</h3><p className="text-[1rem] leading-relaxed text-[#E8E3D6]">Open and close the curtains at a touch, with no pulling and no reaching behind furniture.</p></li>
          <li className="rise border-t-[3px] border-gold pt-3"><h3 className="font-semibold text-lg mb-1">From a phone app</h3><p className="text-[1rem] leading-relaxed text-[#E8E3D6]">We have fitted blinds that are run from a mobile app. Ask us which motors suit your windows.</p></li>
          <li className="rise border-t-[3px] border-gold pt-3"><h3 className="font-semibold text-lg mb-1">For the windows you can’t reach</h3><p className="text-[1rem] leading-relaxed text-[#E8E3D6]">Tall glass, double-height halls, wide doors and skylights are where a motor helps most.</p></li>
        </ul>
      </div>
    </section>
  );
}

function Steps() {
  const steps = [
    ['We visit and measure', 'Our team measures each window in front of you and shows you the fabrics and motors.'],
    ['Made and checked', 'The fabric, track and motor are processed and checked at our factory.'],
    ['Fitted and inspected', 'Our own team fits everything, then inspects it before handing over.'],
  ];
  return (
    <section className="bg-linen py-20 lg:py-28">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-10">
        <h2 className={`rise ${H2} mb-10`}>How it’s done</h2>
        <ol className="list-none p-0 m-0 grid sm:grid-cols-3 gap-8">
          {steps.map(([t, d], i) => <li key={t} className="rise rail pt-3"><p className="font-serif text-[2.5rem] leading-none text-brass mb-2 tabular-nums">{i + 1}</p><h3 className="font-semibold text-lg mb-1">{t}</h3><p className="text-[1rem] leading-relaxed">{d}</p></li>)}
        </ol>
      </div>
    </section>
  );
}

export default function MotorisationPage() {
  const [rates, setRates] = useState(() => ww().DEFAULTS);
  const [size, setSize] = useState({ w: '8', h: '9', unit: 'ft', qty: '1' });
  const motorised = rates.curtains.find((c) => c.id === 'motorised');

  useEffect(() => { setRates(ww().rates()); setSize((s) => rememberedSize(s)); }, []);
  const first = useMemo(() => ({ done: false }), []);
  useEffect(() => { if (!first.done) { first.done = true; return; } ww().store.set('ww-size', size); }, [size, first]);

  return (
    <>
      <PreviewNote />
      <Header links={LINKS} current="motorisation.html" />
      <main>
        <Hero crumb="Motorisation" title="Motorised curtains and blinds in Coimbatore" reveal="hero-slide"
          intro={`Open and close by remote or from your phone. Motors start from ₹${inr(rates.settings.motorFrom)} plus GST, and we fit them to curtains, blinds and skylight shades.`}
          primary={['Price my curtains', '#price']} secondary={['What we motorise', '#what']}
          pic="motor-hero" alt="Ivory sheer curtains on a hidden ceiling track, half open on a wide glass door to a garden" />
        <PriceBoard settings={rates.settings} motorised={motorised} size={size} setSize={setSize} />
        <WhatWeMotorise settings={rates.settings} curtainRate={motorised.rate} />
        <Control />
        <Steps />
        <Works videos={VIDEOS} title="See motorised jobs" note="Videos from Window Works: app control, patio blinds and more." />
        <Faq items={faqs(rates.settings, motorised.rate)} />
        <Related items={[
          ['Curtains', 'Six kinds of curtain, from ₹250 per metre.', 'curtains.html', 'img/eyelet.webp', 'Grey patterned eyelet curtains'],
          ['Blinds', 'Eleven kinds of blind, from ₹55 per sq ft.', 'blinds.html', 'img/blinds/zebra-640.webp', 'Cream zebra blinds in a dining room'],
          ['Skylights', 'Skylight shades, pergolas and louvers for terraces and sit-outs.', 'skylights.html', 'img/skylight-indoor.webp', 'Honeycomb blinds on a sloped skylight'],
        ]} />
        <Visit title="See the motors at your home" pic="motor-hero" cta={['Start my estimate', 'estimate.html?cat=curtains&p=motorised']}
          text="Get your rough price, then our team will call to book a visit at your home in Coimbatore. We bring the fabrics and talk you through the motors, and there’s no charge for the estimate." />
      </main>
      <Footer links={FOOT} />
      <PhoneBar priceLabel="Price my curtains" />
    </>
  );
}
