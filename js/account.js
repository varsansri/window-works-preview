(function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const { esc, rupees } = WW;
  let user = WW.me();
  if (!user) return;

  const main = $('#acc');
  const open = new Set();
  const errors = {};
  const VISIT_STEPS = ['Waiting for our call', 'We have called you', 'Visit booked'];
  const longDate = (iso) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const visitDate = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
  const count = (l) => l.windows.reduce((t, w) => t + (+w.qty || 1), 0);
  const firstName = (n) => n.replace(/^Sample:\s*/, '').split(/\s+/)[0];

  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.hidden = false;
    clearTimeout(toast.t); toast.t = setTimeout(() => { t.hidden = true; }, 2600);
  }

  function windowsTable(l) {
    const r = WW.rates(), product = WW.findProduct(l, r);
    const lines = product ? WW.calc(l.cat, product, l.windows, r.settings).lines : l.windows;
    return `<table class="result-table"><thead><tr><th>Window</th><th class="hide-phone">Size</th><th>Billed</th><th class="n">How many</th></tr></thead><tbody>
      ${lines.map((x) => `<tr><td>${esc(x.room) || 'Window'}</td><td class="hide-phone">${esc(x.w)} × ${esc(x.h)} ${esc(x.unit)}</td><td>${x.measure ? 'about ' + esc(x.measure) : ''}</td><td class="n">${esc(x.qty)}</td></tr>`).join('')}</tbody></table>
      ${product && product.motor ? `<p class="motor-note">The motor is extra, starting from ${rupees(r.settings.motorFrom)} plus GST.</p>` : ''}`;
  }

  function card(l) {
    const isOpen = open.has(l.id), n = count(l);
    return `<article class="est-card" data-id="${esc(l.id)}">
      <p class="print-head">Window Works: rough estimate</p>
      <div class="est-card-top">
        <div><p class="est-card-date">${longDate(l.at)}</p><h3>${esc(l.product)}</h3><p class="est-card-wins">${n} window${n > 1 ? 's' : ''}</p></div>
        <div class="est-card-price"><strong>${rupees(l.low)} to ${rupees(l.high)}</strong><span>plus GST</span></div>
      </div>
      <p class="est-card-status"><span class="tag tag-${esc(l.status.split(' ')[0])}">${esc(WW.CUSTOMER_STATUS[l.status] || l.status)}</span></p>
      <div class="est-card-more" id="more-${esc(l.id)}" ${isOpen ? '' : 'hidden'}>${windowsTable(l)}<p class="gst-line">A guide based on starting rates. We confirm the final price after measuring at your home.</p></div>
      <div class="est-card-actions">
        <button type="button" class="linkish" data-toggle aria-expanded="${isOpen}" aria-controls="more-${esc(l.id)}">${isOpen ? 'Hide the windows' : 'Show the windows'}</button>
        <button type="button" class="linkish" data-wa>Send to WhatsApp</button>
        <button type="button" class="linkish" data-print>Save as PDF</button>
      </div>
    </article>`;
  }

  function visitPanel(list) {
    const l = list.find((x) => x.status !== 'Closed');
    if (!l) {
      return `<section class="acc-panel" aria-labelledby="visit-h"><h2 id="visit-h">My visit</h2>
        <p>${list.length ? 'Your estimates are closed. Start a new one any time and we will call you.' : 'Once you get a rough price, you can ask for a measuring visit here.'}</p></section>`;
    }
    const now = VISIT_STEPS.indexOf(WW.CUSTOMER_STATUS[l.status]);
    const today = new Date().toISOString().slice(0, 10);
    return `<section class="acc-panel" aria-labelledby="visit-h"><h2 id="visit-h">My visit</h2>
      <p class="acc-for">For your ${esc(l.product.toLowerCase())} estimate</p>
      <ol class="progress visit-steps" aria-label="Where your visit is">${VISIT_STEPS.map((s, i) => `<li class="${i < now ? 'done' : i === now ? 'now' : ''}" ${i === now ? 'aria-current="step"' : ''}>${s}</li>`).join('')}</ol>
      <p class="acc-visit-day">${l.visit ? `You asked for <strong>${esc(visitDate(l.visit))}</strong>.` : 'You have not picked a day yet.'}</p>
      <form class="acc-form" data-form="visit" data-id="${esc(l.id)}" novalidate>
        <label class="field">Best day for a visit<input name="visit" type="date" min="${today}" value="${esc(l.visit || '')}"></label>
        <div class="step-nav"><button type="submit" class="btn">Save the day</button></div>
      </form>
      <p class="acc-small">Our team calls to confirm the time. Or call us now on <a href="tel:+919159030465">+91 91590 30465</a>.</p></section>`;
  }

  function detailsPanel() {
    const e = errors, bad = (k) => (e[k] ? `aria-invalid="true" aria-describedby="err-${k}"` : '');
    const err = (k) => (e[k] ? `<p class="field-err" role="alert" id="err-${k}">${e[k]}</p>` : '');
    return `<section class="acc-panel" aria-labelledby="details-h"><h2 id="details-h">My details</h2>
      <form class="acc-form" data-form="details" novalidate>
        <label class="field">Your name<input name="name" autocomplete="name" value="${esc(user.name)}" ${bad('name')}></label>${err('name')}
        <label class="field">Mobile number<input value="${esc(WW.showMobile(user.mobile))}" readonly aria-describedby="mobile-note"></label>
        <p class="acc-small" id="mobile-note">To use a different number, log out and log in with the new one.</p>
        <label class="field">Area or PIN code<input name="area" value="${esc(user.area)}" ${bad('area')}></label>${err('area')}
        <label class="field">Address for the visit (optional)<textarea name="address" rows="3" autocomplete="street-address">${esc(user.address || '')}</textarea></label>
        <label class="field">Email (optional)<input name="email" type="email" autocomplete="email" value="${esc(user.email || '')}" ${bad('email')}></label>${err('email')}
        <div class="step-nav"><button type="submit" class="btn">Save my details</button></div>
      </form></section>`;
  }

  function render() {
    const list = WW.myLeads(user.mobile);
    main.innerHTML = `<h1>Hello, ${esc(firstName(user.name))}</h1>
      <p class="step-sub">Your rough prices and your measuring visit, in one place.</p>
      <div class="acc-layout">
        <section aria-labelledby="ests-h">
          <div class="acc-head"><h2 id="ests-h">My estimates</h2><a class="btn" href="estimate.html">Start a new estimate</a></div>
          ${list.length ? `<div class="est-list">${list.map(card).join('')}</div>`
            : `<div class="acc-empty"><p>You haven't worked out a price yet. It takes about a minute, and you only need rough sizes.</p><a class="btn" href="estimate.html">Get a rough price</a></div>`}
        </section>
        <div class="acc-side">${visitPanel(list)}${detailsPanel()}</div>
      </div>`;
  }

  WW.clearErrorOnInput(main);
  main.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const c = b.closest('.est-card'); if (!c) return;
    const l = WW.myLeads(user.mobile).find((x) => x.id === c.dataset.id); if (!l) return;
    if ('toggle' in b.dataset) {
      const more = $('.est-card-more', c), show = more.hidden;
      more.hidden = !show; b.setAttribute('aria-expanded', show); b.textContent = show ? 'Hide the windows' : 'Show the windows';
      if (show) open.add(l.id); else open.delete(l.id);
    } else if ('wa' in b.dataset) {
      window.open('https://wa.me/?text=' + encodeURIComponent(WW.waText(l)), '_blank', 'noopener');
    } else if ('print' in b.dataset) {
      c.classList.add('is-printing'); document.body.classList.add('printing-one');
      window.print();
    }
  });
  window.addEventListener('afterprint', () => {
    document.body.classList.remove('printing-one');
    const p = $('.is-printing'); if (p) p.classList.remove('is-printing');
  });

  main.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(e.target), kind = e.target.dataset.form;
    if (kind === 'visit') {
      const all = WW.leads(), l = all.find((x) => x.id === e.target.dataset.id);
      if (!l) return;
      l.visit = (f.get('visit') || '').toString();
      WW.store.set('ww-leads', all);
      render(); toast(l.visit ? 'Saved. Our team will see the day you picked.' : 'Saved. No day picked.');
      return;
    }
    if (kind === 'details') {
      const v = (k) => (f.get(k) || '').toString().trim();
      const next = { name: v('name'), area: v('area'), address: v('address'), email: v('email') };
      Object.keys(errors).forEach((k) => delete errors[k]);
      if (!next.name) errors.name = 'Please tell us your name.';
      if (!next.area) errors.area = 'Please add your area or PIN code.';
      if (next.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next.email)) errors.email = 'That email does not look right.';
      if (Object.keys(errors).length) {
        render(); const bad = $('[aria-invalid=true]', main); if (bad) bad.focus(); return;
      }
      user = WW.saveUser({ ...user, ...next });
      render(); toast('Your details are saved.');
    }
  });

  $('[data-out]').addEventListener('click', () => { WW.signOut(); location.href = 'index.html'; });

  render();
})();
