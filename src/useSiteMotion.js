import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText as GSAPSplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Lenis smooth scrolling, shared with ScrollTrigger. In-page links use it too. */
export function useSmoothScroll() {
  useEffect(() => {
    if (reduced()) return undefined;
    const lenis = new Lenis({ lerp: 0.11 });
    const tick = (t) => lenis.raf(t * 1000);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a || a.getAttribute('href').length < 2) return;
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: -84 }); }
    };
    document.addEventListener('click', onClick);
    return () => { document.removeEventListener('click', onClick); gsap.ticker.remove(tick); lenis.destroy(); };
  }, []);
}

/* GSAP: curtains part on load, photos roll open like blinds, the gallery moves sideways as you scroll. */
export function useSiteMotion(scope) {
  useGSAP(() => {
    if (reduced()) return;
    const ease = 'power3.out';

    gsap.to('.curtain-l', { xPercent: -101, duration: 1.6, delay: 0.2, ease: 'power3.inOut' });
    gsap.to('.curtain-r', { xPercent: 101, duration: 1.6, delay: 0.2, ease: 'power3.inOut' });
    gsap.from('.hero-photo', { scale: 1.14, duration: 2, delay: 0.2, ease });
    gsap.from('.hero-rise', { y: 22, opacity: 0, duration: 0.8, delay: 0.55, stagger: 0.09, ease });

    document.fonts.ready.then(() => {
      const h1 = document.querySelector('.hero-title');
      if (!h1) return;
      const split = GSAPSplitText.create(h1, { type: 'lines', mask: 'lines', linesClass: 'hero-line', autoSplit: true,
        onSplit: (s) => gsap.from(s.lines, { yPercent: 105, duration: 1.05, stagger: 0.11, delay: 0.15, ease: 'power4.out' }) });
      h1.dataset.split = split ? '1' : '';
      ScrollTrigger.refresh();
    });

    gsap.to('.hero-pane', { y: -46, ease: 'none', scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: 0.6 } });

    gsap.utils.toArray('.blind').forEach((el) => {
      const img = el.querySelector('img');
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
      tl.fromTo(el, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'power3.inOut', clearProps: 'clipPath' });
      if (img) tl.fromTo(img, { scale: 1.12 }, { scale: 1, duration: 1.3, ease, clearProps: 'transform' }, 0);
    });

    ScrollTrigger.batch('.rise', {
      start: 'top 92%', once: true,
      onEnter: (els) => gsap.fromTo(els, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, stagger: 0.07, ease, clearProps: 'transform,opacity' }),
    });
    gsap.set('.rise', { opacity: 0 });

    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', () => {
      const track = document.querySelector('.gallery-track');
      const section = document.querySelector('.gallery-section');
      if (!track || !section) return undefined;
      const distance = () => Math.max(0, track.scrollWidth - track.parentElement.clientWidth);
      gsap.to(track, {
        x: () => -distance(), ease: 'none',
        scrollTrigger: { trigger: section, start: 'top 72px', end: () => `+=${distance()}`, scrub: 0.7, pin: true, anticipatePin: 1, invalidateOnRefresh: true },
      });
      return undefined;
    });
  }, { scope });
}
