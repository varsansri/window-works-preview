import { useEffect, useState } from 'react';

export const PHONE = '+91 91590 30465';
export const TEL = 'tel:+919159030465';
const HOME_LINKS = [['Blinds', 'blinds.html'], ['Curtains', 'curtains.html'], ['Motorisation', 'motorisation.html'], ['Skylights', 'skylights.html'], ['Prices', '#prices'], ['Our works', '#works'], ['Contact', '#contact']];
const FOOTER_LINKS = [['Blinds', 'blinds.html'], ['Curtains', 'curtains.html'], ['Motorisation', 'motorisation.html'], ['Skylights', 'skylights.html'], ['Prices', '#prices'], ['Gallery', '#gallery']];

/* "Log in" until someone logs in, then their first name. Read after mount, so the prerendered HTML always matches. */
function useAccount() {
  const [acc, setAcc] = useState({ href: 'login.html', label: 'Log in' });
  useEffect(() => {
    const me = globalThis.WW && globalThis.WW.me();
    if (me) setAcc({ href: 'account.html', label: me.name.replace(/^Sample:\s*/, '').split(/\s+/)[0] || 'My account', mine: true });
  }, []);
  return acc;
}

export function Header({ links = HOME_LINKS, current }) {
  const [open, setOpen] = useState(false);
  const acc = useAccount();
  return (
    <header className="sticky top-0 z-50 bg-linen border-b-[3px] border-navy">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-10 flex items-stretch gap-6 h-[68px]">
        <a href="./" className="bg-brand px-3 flex items-center shrink-0"><img src="img/logo-white.png" width="520" height="324" alt="Window Works" className="h-[54px] w-auto" /></a>
        <nav aria-label="Main" className="hidden xl:flex items-center gap-7 text-[.9375rem] font-medium ml-2">
          {links.map(([t, h]) => <a key={h} href={h} className="line-link" aria-current={h === current ? 'page' : undefined}>{t}</a>)}
        </nav>
        <div className="flex items-center gap-4 ml-auto">
          <a href={TEL} className="hidden md:inline-block line-link font-semibold text-[.9375rem] tabular-nums">{PHONE}</a>
          <a href={TEL} className="md:hidden font-semibold px-1 py-3">Call</a>
          <a href={acc.href} className="hidden sm:inline-block line-link font-semibold text-[.9375rem] max-w-[10rem] truncate" aria-label={acc.mine ? `My account, ${acc.label}` : undefined}>{acc.label}</a>
          <a href="estimate.html" className="slat-btn !py-3 hidden sm:inline-flex"><span>Get a rough price</span></a>
          <button type="button" className="xl:hidden font-semibold px-1 py-3 underline underline-offset-4 decoration-2 decoration-gold" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}</button>
        </div>
      </div>
      {open && (
        <nav aria-label="Mobile" className="xl:hidden bg-linen border-t border-rule px-4 py-3 grid gap-1 text-lg font-medium">
          {links.map(([t, h]) => <a key={h} href={h} className="py-2.5" onClick={() => setOpen(false)}>{t}</a>)}
          <a href={acc.href} className="py-2.5">{acc.mine ? `My account (${acc.label})` : 'Log in'}</a>
          <a href={TEL} className="py-2.5 font-semibold">Call {PHONE}</a>
          <a href="estimate.html" className="slat-btn mt-2 w-full">Get a rough price</a>
        </nav>
      )}
    </header>
  );
}

export function Footer({ links = FOOTER_LINKS }) {
  return (
    <footer className="bg-midnight text-[#E8E3D6]">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-10 pt-14 pb-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-12 gap-10 text-[.9375rem]">
          <div className="lg:col-span-5">
            <span className="inline-block bg-brand p-3 mb-5"><img src="img/logo-white.png" width="520" height="324" loading="lazy" alt="Window Works" className="h-16 w-auto" /></span>
            <p className="max-w-sm leading-relaxed">Curtains, sheers, blinds, skylights and insect screens, made to measure in Coimbatore since 2015.</p>
          </div>
          <nav aria-label="Footer" className="lg:col-span-2 grid gap-1 content-start">{links.map(([t, h]) => <a key={h} href={h} className="line-link w-fit">{t}</a>)}</nav>
          <div className="lg:col-span-2 grid gap-1 content-start"><a href="estimate.html" className="line-link w-fit">Rough price</a><a href="account.html" className="line-link w-fit">My account</a><a href="https://www.instagram.com/windowworksindia/" target="_blank" rel="noopener" className="line-link w-fit">Instagram</a><a href="https://www.facebook.com/Window-Works-109946690354712/" target="_blank" rel="noopener" className="line-link w-fit">Facebook</a><a href="admin.html" className="line-link w-fit">Team view (demo)</a></div>
          <address className="lg:col-span-3 not-italic leading-relaxed">19, G.R.D Layout, A.A. Scheme Road<br />RS Puram, Coimbatore 641002<br /><a href={TEL} className="line-link">{PHONE}</a><br /><a href="mailto:admin@windowworks.in" className="line-link">admin@windowworks.in</a></address>
        </div>
        <p className="mt-12 text-sm">Copyright 2026 Window Works. Preview by Mi Media Labs. Nothing entered on this preview reaches Window Works.</p>
      </div>
    </footer>
  );
}

export function Swatch({ className = '' }) {
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
