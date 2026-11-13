/* Motion for the simple test home page. Same toolkit as the main site (Lenis, GSAP ScrollTrigger + SplitText,
   and the React Bits CountUp effect via Motion), kept quick and quiet. No curtain intro, no Vanta.
   The page looks the same with or without this file; it only adds movement. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { animate, inView } from 'motion';

gsap.registerPlugin(ScrollTrigger, SplitText);
const root = document.documentElement;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const ease = 'power3.out';
const show = () => root.classList.remove('motion-wait');

if (reduced) {
  show();
} else {
  /* Lenis smooth scrolling, shared with ScrollTrigger; in-page links glide too. */
  const lenis = new Lenis({ lerp: 0.11 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute('href').length < 2) return;
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    a.closest('details')?.removeAttribute('open');
    lenis.scrollTo(target, { offset: -8 });
  });

  /* Hero: headline lines rise from a mask, then the text and buttons, while the photo rolls down like a blind. */
  const hero = gsap.timeline({ defaults: { ease } });
  hero.fromTo('.hero-photo', { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.0, ease: 'power3.inOut', clearProps: 'clipPath' }, 0)
    .fromTo('.hero-photo img', { scale: 1.08 }, { scale: 1, duration: 1.3, clearProps: 'transform' }, 0)
    .fromTo('.hero-rise', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, clearProps: 'transform,opacity' }, 0.35);
  const h1 = document.querySelector('.hero h1');
  if (h1) gsap.set(h1, { opacity: 0 });
  show();
  document.fonts.ready.then(() => {
    if (!h1) return;
    SplitText.create(h1, { type: 'lines', mask: 'lines', autoSplit: true,
      onSplit: (s) => { gsap.set(h1, { opacity: 1 }); return gsap.from(s.lines, { yPercent: 105, duration: 0.85, stagger: 0.09, ease: 'power4.out' }); } });
  });

  /* Section headings: words rise one after another as they come into view. */
  gsap.utils.toArray('main h2').forEach((h2) => {
    SplitText.create(h2, { type: 'words', mask: 'words', autoSplit: true,
      onSplit: (s) => gsap.from(s.words, { yPercent: 110, duration: 0.7, stagger: 0.05, ease: 'power4.out',
        scrollTrigger: { trigger: h2, start: 'top 90%', once: true } }) });
  });

  /* Card photos roll down like a blind being lowered. */
  gsap.utils.toArray('.blind').forEach((el) => {
    const img = el.querySelector('img');
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    tl.fromTo(el, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.9, ease: 'power3.inOut', clearProps: 'clipPath' });
    if (img) tl.fromTo(img, { scale: 1.08 }, { scale: 1, duration: 1.1, ease, clearProps: 'transform' }, 0);
  });

  /* Everything else rises gently, in small groups. */
  gsap.set('.rise', { opacity: 0 });
  ScrollTrigger.batch('.rise', {
    start: 'top 92%', once: true,
    onEnter: (els) => gsap.fromTo(els, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.06, ease, clearProps: 'transform,opacity' }),
  });

  /* Price table rows slide in one after another. */
  gsap.utils.toArray('tbody').forEach((tb) => {
    const rows = tb.querySelectorAll('tr');
    if (!rows.length) return;
    gsap.fromTo(rows, { x: -12, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, stagger: 0.035, ease, clearProps: 'transform,opacity',
      scrollTrigger: { trigger: tb, start: 'top 88%', once: true } });
  });
}

/* React Bits CountUp effect: prices count up to the real figure when they come into view.
   The real number is in the HTML first, so nothing is wrong if this never runs. */
function countUps() {
  if (reduced) return;
  document.querySelectorAll('[data-count]').forEach((el) => {
    const to = Number(el.dataset.count);
    if (!to) return;
    const fmt = (n) => '₹' + Math.round(n).toLocaleString('en-IN');
    el.textContent = fmt(0);
    const stop = inView(el, () => {
      animate(0, to, { duration: 1.1, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => { el.textContent = fmt(v); } });
      stop();
    }, { margin: '0px 0px -8% 0px' });
  });
}
countUps();
