(function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const R = WW.rates();

  /* The window you size in the first screen. */
  const size = { w: 6, h: 7, kind: 'blinds' };
  function paintSizer() {
    $('#sizer-draw').innerHTML = WW.drawWindow(size.w, size.h, size.kind, { frame: '#ffffff', glass: '#6f9be0', cloth: '#ffffff' });
    $('#sizer-read').textContent = `${size.w} ft wide, ${size.h} ft tall`;
    const first = size.kind === 'blinds' ? 'roller' : 'eyelet';
    $('#hero-go').href = `estimate.html?cat=${size.kind}&w=${size.w}&h=${size.h}&from=${first}`;
  }
  $('#sizer-w').addEventListener('input', (e) => { size.w = +e.target.value; paintSizer(); });
  $('#sizer-h').addEventListener('input', (e) => { size.h = +e.target.value; paintSizer(); });
  $$('.kind').forEach((b) => b.addEventListener('click', () => {
    size.kind = b.dataset.kind;
    $$('.kind').forEach((x) => { const on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on); });
    paintSizer();
  }));
  paintSizer();

  /* Products: choosing a name swaps the picture. */
  const SHOW = [
    { img: 'roller', alt: 'Patterned roller blinds on a window in a study', fact: 'Eleven kinds, from ₹55 per sq ft plus GST.', tone: 'blue' },
    { img: 'room-1', alt: 'Teal and yellow eyelet curtains on a tall window', fact: 'Sheers, eyelet, pleated, recess, LED and motorised, from ₹250 per metre plus GST.', tone: 'deep' },
    { img: 'skylight-indoor', alt: 'Honeycomb blinds on a sloped skylight above a kitchen', fact: 'Indoor and outdoor skylights, pergolas and louvers, priced after a visit.', tone: 'mid' },
    { img: 'screen', alt: 'A black framed insect screen door', fact: 'Magnetic, sliding and pleated screens for windows and doors, priced after a visit.', tone: 'pale' }
  ];
  const slat = $('#show-slat'), img = $('#show-img'), fact = $('#show-fact');
  const names = $$('.show-name');
  function pick(i) {
    const s = SHOW[i];
    names.forEach((n, k) => { n.classList.toggle('on', k === i); n.setAttribute('aria-pressed', k === i); });
    slat.dataset.tone = s.tone;
    img.classList.add('swap');
    setTimeout(() => { img.src = `img/${s.img}.webp`; img.alt = s.alt; fact.textContent = s.fact; img.classList.remove('swap'); }, 180);
  }
  names.forEach((n, i) => n.addEventListener('click', () => pick(i)));
  slat.dataset.tone = 'blue';

  /* Price lists. */
  const row = (name, price, desc, photo, href) => `<a class="item" href="${href}"><span class="item-photo">${photo ? `<img src="img/${photo}.webp" width="600" height="600" loading="lazy" alt="">` : ''}</span><span class="item-text"><span class="item-top"><strong>${name}</strong><b>${price}</b></span><span class="item-desc">${desc}</span></span></a>`;
  const blinds = R.blinds.map((p) => row(p.name, `₹${p.rate.toLocaleString('en-IN')} / sq ft`, p.desc, p.id, `estimate.html?cat=blinds&p=${p.id}`)).join('');
  const curtains = R.curtains.map((p) => row(p.name, `₹${p.rate} / m`, p.desc, p.id, `estimate.html?cat=curtains&p=${p.id}`)).join('');
  const sky = [
    ['Indoor skylights', 'Blinds for sloped and roof glass inside the home.', 'skylight-indoor'],
    ['Outdoor skylights', 'Retractable shade for terraces and open courtyards.', 'skylight-outdoor'],
    ['Pergoroof', 'A covered roof system for outdoor seating.', 'pergoroof'],
    ['Louvers', 'Adjustable overhead slats that control sun and air.', 'louvers']
  ].map((a) => row(a[0], 'After a visit', a[1], a[2], '#contact')).join('');
  const screens = [
    ['Sleek window system', 'A slim internal screen for windows.'],
    ['Magpro magnetic', 'A magnetic screen for windows.'],
    ['Sliding system', 'A sliding screen for windows and doors.'],
    ['Smart door magnetic', 'A magnetic screen door.'],
    ['Pleated Super Glide', 'A pleated screen that folds away.'],
    ['Motorised screens', 'Screens that open at the press of a button.']
  ].map((a) => row(a[0], 'After a visit', a[1], null, '#contact')).join('');
  const cat = (id, name, count, items) => `<div class="cat" id="${id}"><div class="cat-head"><h3>${name}</h3><span>${count}</span></div><div class="items">${items}</div></div>`;
  $('#price-lists').innerHTML = cat('list-blinds', 'Blinds', '11 kinds', blinds) + cat('list-curtains', 'Curtains', '6 kinds', curtains) + cat('list-skylights', 'Skylights', '4 of our range', sky) + cat('list-screens', 'Insect screens', '6 systems', screens);

  /* How it works. */
  const stages = $$('.stage');
  stages.forEach((s) => $('button', s).addEventListener('click', () => {
    stages.forEach((x) => { const on = x === s; x.classList.toggle('open', on); $('button', x).setAttribute('aria-expanded', on); });
  }));

  /* Contact is a demo in this preview. */
  $('#contact-form').addEventListener('submit', (e) => { e.preventDefault(); $('#contact-done').hidden = false; });

  /* Entrances. Content stays visible if this never runs. */
  const parts = $$('.showcase h2, .show-name, .show-fact, .prices-title, .prices-note, .cat-head, .item, .how-intro > *, .stage, .about h2, .about-photo, .about-right > *, .works h2, .tile, .coupon, .foot-mark, .foot-grid > *');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    parts.forEach((p) => p.classList.add('rise'));
    const seen = new IntersectionObserver((es) => es.forEach((en) => {
      if (!en.isIntersecting) return;
      const sibs = Array.from(en.target.parentElement.children);
      en.target.style.transitionDelay = Math.min(sibs.indexOf(en.target), 5) * 70 + 'ms';
      en.target.classList.add('in');
      seen.unobserve(en.target);
    }), { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });
    parts.forEach((p) => seen.observe(p));
    const sh = $('.shutter');
    const open = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { sh.classList.add('opened'); open.disconnect(); } }), { threshold: 0.3 });
    sh.classList.add('armed'); open.observe($('.show-visual'));
  }
})();
