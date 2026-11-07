(function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const { esc, rupees } = WW;
  const R = WW.rates();
  const q = new URLSearchParams(location.search);
  const num = (k) => { const v = parseFloat(q.get(k)); return v > 0 && v < 100 ? v : ''; };

  const st = {
    step: 0, cat: null, product: null, active: 0,
    windows: [{ room: '', w: num('w'), h: num('h'), unit: 'ft', qty: (() => { const n = Number(q.get('qty')); return Number.isInteger(n) && n >= 1 && n <= 200 ? n : 1; })() }],
    person: { name: '', mobile: '', area: '', email: '', visit: '', consent: false },
    otpSent: false, result: null, errors: {}
  };
  const qCat = q.get('cat');
  if (qCat === 'blinds' || qCat === 'curtains') {
    st.cat = qCat; st.step = 1;
    const p = R[qCat].find((x) => x.id === q.get('p'));
    if (p) { st.product = p; st.step = 2; }
  }

  function bar() {
    $$('#progress li').forEach((li, i) => {
      li.className = i < st.step ? 'done' : i === st.step ? 'now' : '';
      if (i === st.step) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });
  }
  function go(n) {
    st.step = n; st.errors = {}; render();
    const top = $('#step'); top.focus({ preventScroll: true }); window.scrollTo({ top: 0 });
  }

  const views = [
    function product() {
      return `<h1>What's going on your window?</h1><p class="step-sub">Choose one for now. You can start another estimate for the other rooms.</p>
      <div class="big-pick">
        <button type="button" data-cat="blinds"><img src="img/dining.webp" width="502" height="336" alt="Roman blinds in a dining room"><span><strong>Blinds</strong>From ₹${Math.min(...R.blinds.map((p) => p.rate))} per sq ft</span></button>
        <button type="button" data-cat="curtains"><img src="img/room-1.webp" width="600" height="600" alt="Teal and yellow eyelet curtains on a tall window"><span><strong>Curtains</strong>From ₹${Math.min(...R.curtains.map((p) => p.rate))} per metre</span></button>
      </div>`;
    },
    function style() {
      const unit = st.cat === 'blinds' ? 'sq ft' : 'metre';
      return `<h1>Which style do you like?</h1><p class="step-sub">The price under each one is its starting rate, before GST.</p>
      <div class="style-grid">${R[st.cat].map((p) => `<button type="button" data-p="${p.id}"><img src="img/${p.id}.webp" width="600" height="600" loading="lazy" alt=""><strong>${esc(p.name)}</strong><small>from ₹${p.rate.toLocaleString('en-IN')} per ${unit}</small></button>`).join('')}</div>
      <div class="step-nav"><button type="button" class="linkish" data-back>Back</button></div>`;
    },
    function windows() {
      const rows = st.windows.map((w, i) => {
        const err = st.errors[i];
        return `<div class="win-row ${i === st.active ? 'is-active' : ''}" data-i="${i}">
          <label class="field field-room">Room<input data-f="room" value="${esc(w.room)}" placeholder="Bedroom" autocomplete="off"></label>
          <label class="field">Width<input data-f="w" type="number" inputmode="decimal" min="0" step="any" value="${esc(w.w)}" ${err ? 'aria-invalid="true"' : ''}></label>
          <label class="field">Height<input data-f="h" type="number" inputmode="decimal" min="0" step="any" value="${esc(w.h)}" ${err ? 'aria-invalid="true"' : ''}></label>
          <label class="field">Unit<select data-f="unit">${[['ft', 'feet'], ['in', 'inches'], ['cm', 'cm'], ['m', 'metres']].map((u) => `<option value="${u[0]}" ${w.unit === u[0] ? 'selected' : ''}>${u[1]}</option>`).join('')}</select></label>
          <label class="field">How many<input data-f="qty" type="number" inputmode="numeric" min="1" step="1" value="${esc(w.qty)}"></label>
          ${st.windows.length > 1 ? `<button type="button" class="remove" data-remove="${i}" aria-label="Remove window ${esc(w.room) || i + 1}">Remove</button>` : '<span></span>'}
          ${err ? `<p class="field-err" role="alert">${err}</p>` : ''}
        </div>`;
      }).join('');
      return `<h1>How big are your windows?</h1><p class="step-sub">${esc(st.product.name)}, from ₹${st.product.rate.toLocaleString('en-IN')} ${st.cat === 'blinds' ? 'per sq ft' : 'per metre'}. A rough measurement is fine.</p>
      <div class="win-layout"><div class="win-rows">${rows}<button type="button" class="add-win" data-add>Add another window</button>
        <div class="tip"><h2>How to measure</h2><p>Run a tape across the window from one side of the frame to the other, then from top to bottom. We'll measure again at your home before the final price.</p></div>
      </div><aside class="win-side" aria-label="Your window to scale"><div id="win-draw"></div><p id="win-read"></p></aside></div>
      <div class="step-nav"><button type="button" class="btn" data-next>See my rough price</button><button type="button" class="linkish" data-back>Back</button></div>`;
    },
    function reveal() {
      if (st.result) return result();
      const p = st.person, e = st.errors;
      const total = st.windows.reduce((t, w) => t + (Number(w.qty) || 1), 0);
      return `<h1>Your price is ready</h1><p class="step-sub">Tell us who it's for. We'll text a code to confirm your mobile number.</p>
      <div class="reveal-layout"><form class="contact-form" id="who" novalidate>
        <label class="field">Your name<input name="name" value="${esc(p.name)}" autocomplete="name" ${e.name ? 'aria-invalid="true"' : ''}></label>${e.name ? `<p class="field-err" role="alert">${e.name}</p>` : ''}
        <label class="field">Mobile number<input name="mobile" type="tel" inputmode="numeric" maxlength="14" value="${esc(p.mobile)}" autocomplete="tel" ${e.mobile ? 'aria-invalid="true"' : ''} ${st.otpSent ? 'readonly' : ''}></label>${e.mobile ? `<p class="field-err" role="alert">${e.mobile}</p>` : ''}
        <label class="field">Area or PIN code<input name="area" value="${esc(p.area)}" placeholder="RS Puram" ${e.area ? 'aria-invalid="true"' : ''}></label>${e.area ? `<p class="field-err" role="alert">${e.area}</p>` : ''}
        <label class="field">Email, if you'd like a copy (optional)<input name="email" type="email" value="${esc(p.email)}" autocomplete="email"></label>
        <label class="field">Best day for a visit (optional)<input name="visit" type="date" value="${esc(p.visit)}"></label>
        <label class="check"><input type="checkbox" name="consent" ${p.consent ? 'checked' : ''}><span>Window Works may call or message me about this estimate.</span></label>${e.consent ? `<p class="field-err" role="alert">${e.consent}</p>` : ''}
        ${st.otpSent ? `<p class="demo-otp">Preview: no text was sent. The code is <strong>1234</strong>.</p>
        <label class="field">Code from the text message<input name="otp" inputmode="numeric" maxlength="4" autocomplete="one-time-code" ${e.otp ? 'aria-invalid="true"' : ''}></label>${e.otp ? `<p class="field-err" role="alert">${e.otp}</p>` : ''}` : ''}
        <div class="step-nav"><button type="submit" class="btn">${st.otpSent ? 'Show my price' : 'Text me the code'}</button><button type="button" class="linkish" data-back>Back</button></div>
      </form><div class="blur-card"><p>${esc(st.product.name)}</p><p class="locked">${total} window${total > 1 ? 's' : ''} measured</p>
      <ul>${st.windows.map((w) => `<li>${esc(w.room) || 'Window'}: ${esc(w.w)} × ${esc(w.h)} ${esc(w.unit)}${Number(w.qty) > 1 ? `, ${esc(w.qty)} of these` : ''}</li>`).join('')}</ul></div></div>`;
    }
  ];

  function result() {
    const r = st.result, motor = st.product.motor;
    return `<p class="print-head">Window Works: rough estimate</p><div class="result-price"><p>Your rough price for ${esc(st.product.name.toLowerCase())}</p><strong>${rupees(r.low)} to ${rupees(r.high)}</strong><p class="gst">Plus GST. This is a guide based on starting rates. The final price depends on your fabric and fittings, and we confirm it after measuring at your home.</p></div>
    ${motor ? `<p class="motor-note">The motor is extra, starting from ${rupees(R.settings.motorFrom)} plus GST.</p>` : ''}
    <table class="result-table"><thead><tr><th>Window</th><th class="hide-phone">Size</th><th>Billed</th><th class="n">How many</th></tr></thead><tbody>
    ${r.lines.map((l) => `<tr><td>${esc(l.room) || 'Window'}</td><td class="hide-phone">${esc(l.w)} × ${esc(l.h)} ${esc(l.unit)}</td><td>about ${esc(l.measure)}</td><td class="n">${l.qty}</td></tr>`).join('')}</tbody></table>
    <p class="next-line">Thanks, ${esc(st.person.name)}. Our team will call ${esc(st.person.mobile)} to book a visit.</p>
    <div class="step-nav"><button type="button" class="btn" data-print>Save as PDF</button><button type="button" class="linkish" data-wa>Send to WhatsApp</button><a class="linkish" href="estimate.html">Start another estimate</a><a class="linkish" href="admin.html">See it in the team view</a></div>
    <p class="toast" id="toast" role="status" hidden></p>`;
  }

  function paintDraw() {
    const d = $('#win-draw'); if (!d) return;
    const w = st.windows[st.active] || st.windows[0];
    const wf = WW.toFeet(w.w, w.unit), hf = WW.toFeet(w.h, w.unit);
    if (wf > 0 && hf > 0) {
      d.innerHTML = WW.drawWindow(wf, hf, st.cat, { glass: '#5b76ad' });
      $('#win-read').textContent = `${w.room || 'This window'}: ${+wf.toFixed(1)} ft wide, ${+hf.toFixed(1)} ft tall`;
    } else {
      d.innerHTML = WW.drawWindow(4, 5, st.cat, { glass: '#5b76ad' });
      $('#win-read').textContent = 'Type a size and it appears here to scale';
    }
  }

  function render() { bar(); $('#step').innerHTML = views[st.step](); paintDraw(); }

  function checkWindows() {
    st.errors = {};
    st.windows.forEach((w, i) => {
      const wf = WW.toFeet(w.w, w.unit), hf = WW.toFeet(w.h, w.unit);
      if (!(wf > 0 && hf > 0)) st.errors[i] = 'Please enter both the width and the height.';
      else if (wf > 60 || hf > 40) st.errors[i] = `That looks very large. Is the unit set to ${{ ft: 'feet', in: 'inches', cm: 'cm', m: 'metres' }[w.unit]}?`;
      const qty = Number(w.qty);
      if (!st.errors[i] && !(Number.isInteger(qty) && qty >= 1 && qty <= 200)) st.errors[i] = 'How many should be a whole number, 1 or more.';
    });
    return Object.keys(st.errors).length === 0;
  }

  const main = $('#step');
  main.addEventListener('input', (e) => {
    const row = e.target.closest('.win-row');
    if (row && e.target.dataset.f) {
      const i = +row.dataset.i;
      st.windows[i][e.target.dataset.f] = e.target.value;
      if (st.errors[i]) {
        delete st.errors[i];
        $$('[aria-invalid]', row).forEach((x) => x.removeAttribute('aria-invalid'));
        const msg = $('.field-err', row);
        if (msg) msg.hidden = true;
      }
      if (st.active !== i) { st.active = i; $$('.win-row').forEach((r, k) => r.classList.toggle('is-active', k === i)); }
      paintDraw();
    }
  });
  main.addEventListener('focusin', (e) => {
    const row = e.target.closest('.win-row');
    if (row && +row.dataset.i !== st.active) { st.active = +row.dataset.i; $$('.win-row').forEach((r, k) => r.classList.toggle('is-active', k === st.active)); paintDraw(); }
  });
  main.addEventListener('click', (e) => {
    const t = e.target.closest('button'); if (!t) return;
    if (t.dataset.cat) { st.cat = t.dataset.cat; st.product = null; go(1); }
    else if (t.dataset.p) { st.product = R[st.cat].find((p) => p.id === t.dataset.p); go(2); }
    else if ('back' in t.dataset) {
      st.otpSent = false;
      go(st.step - 1);
    }
    else if ('add' in t.dataset) { st.windows.push({ room: '', w: '', h: '', unit: st.windows[st.windows.length - 1].unit, qty: 1 }); st.active = st.windows.length - 1; render(); const r = $$('.win-row')[st.active]; $('input', r).focus(); }
    else if (t.dataset.remove !== undefined) { st.windows.splice(+t.dataset.remove, 1); st.active = 0; render(); }
    else if ('next' in t.dataset) { if (checkWindows()) go(3); else { render(); const bad = $('[aria-invalid=true]'); if (bad) bad.focus(); } }
    else if ('print' in t.dataset) window.print();
    else if ('wa' in t.dataset) {
      const r = st.result;
      const text = [
        'Window Works rough estimate',
        st.product.name,
        ...r.lines.map((l) => `${l.room || 'Window'}: ${l.w} × ${l.h} ${l.unit}, about ${l.measure}${l.qty > 1 ? `, ${l.qty} of these` : ''}`),
        `Rough price: ${rupees(r.low)} to ${rupees(r.high)} plus GST`,
        ...(st.product.motor ? [`The motor is extra, starting from ${rupees(R.settings.motorFrom)} plus GST`] : []),
        'The final price is confirmed after measuring at home.'
      ].join('\n');
      window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank', 'noopener');
    }
  });
  main.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(e.target), p = st.person;
    ['name', 'mobile', 'area', 'email', 'visit'].forEach((k) => { p[k] = (f.get(k) || '').toString().trim(); });
    p.consent = !!f.get('consent');
    const digits = p.mobile.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '');
    const err = {};
    if (!p.name) err.name = 'Please tell us your name.';
    if (!/^[6-9]\d{9}$/.test(digits)) err.mobile = 'Please enter a 10-digit Indian mobile number.';
    if (!p.area) err.area = 'Please add your area or PIN code.';
    if (!p.consent) err.consent = 'Please tick this so our team can contact you.';
    if (!Object.keys(err).length && st.otpSent && (f.get('otp') || '').toString().trim() !== '1234') err.otp = 'That code is not right. In this preview it is 1234.';
    st.errors = err;
    if (Object.keys(err).length) { render(); const bad = $('[aria-invalid=true]'); if (bad) bad.focus(); return; }
    if (!st.otpSent) { st.otpSent = true; render(); $('input[name=otp]').focus(); return; }
    p.mobile = digits;
    const windows = st.windows.map((w) => ({ ...w, w: +w.w, h: +w.h, qty: +w.qty, room: w.room || 'Window' }));
    st.result = WW.calc(st.cat, st.product, windows, R.settings);
    WW.addLead({ id: 'L' + Date.now(), name: p.name, mobile: digits, area: p.area, email: p.email, visit: p.visit, cat: st.cat, product: st.product.name, windows, low: st.result.low, high: st.result.high, status: 'New', at: new Date().toISOString(), note: '' });
    render(); main.focus({ preventScroll: true }); window.scrollTo({ top: 0 });
  });

  render();
})();
