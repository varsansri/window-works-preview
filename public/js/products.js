/* One page for the whole home: pick products, type each window's size, get one estimate.
   Lines can mix blinds and curtains; each line keeps its own product (cat + pid). Needs data.js and estimate-doc.js. */
(function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const { esc, rupees } = WW;
  const R = WW.rates();
  const UNITS = [['ft', 'feet'], ['in', 'inches'], ['cm', 'cm'], ['m', 'metres']];
  const NOTE = {
    blinds: 'Blinds are priced per square foot of window (10 sq ft at least per blind).',
    curtains: 'Curtains are priced per metre of fabric, worked out from your window width and height.'
  };
  const per = (cat) => (cat === 'blinds' ? 'sq ft' : 'metre');
  const find = (cat, pid) => (R[cat] || []).find((p) => p.id === pid);

  const st = { tab: 'blinds', items: WW.store.get('ww-cart', []).filter((i) => find(i.cat, i.pid)), errors: {}, asking: false, lead: null, formErr: {} };
  let seq = st.items.reduce((m, i) => Math.max(m, i.key || 0), 0);
  const save = () => WW.store.set('ww-cart', st.items);

  function add(cat, pid, size) {
    const last = st.items[st.items.length - 1];
    st.items.push({ key: ++seq, cat, pid, room: '', w: size && size.w || '', h: size && size.h || '', unit: last ? last.unit : 'ft', qty: size && size.qty || 1 });
    save();
  }

  /* Links from the home page and product pages: ?cat=blinds&p=zebra&w=5&h=6&qty=2 */
  const q = new URLSearchParams(location.search);
  const qc = q.get('cat');
  if (qc === 'blinds' || qc === 'curtains') {
    st.tab = qc;
    const pid = q.get('p'), num = (k) => { const v = parseFloat(q.get(k)); return v > 0 && v < 100 ? v : ''; };
    const qty = Number(q.get('qty'));
    if (find(qc, pid)) add(qc, pid, { w: num('w'), h: num('h'), qty: Number.isInteger(qty) && qty > 0 && qty <= 200 ? qty : 1 });
    history.replaceState(null, '', location.pathname);
  }

  const sizeOK = (i) => { const w = WW.toFeet(i.w, i.unit), h = WW.toFeet(i.h, i.unit); return w > 0 && h > 0 && w <= 60 && h <= 40; };
  const qtyOK = (i) => { const n = Number(i.qty); return Number.isInteger(n) && n >= 1 && n <= 200; };
  function lineCost(i) {
    if (!sizeOK(i) || !qtyOK(i)) return null;
    return WW.calc(i.cat, find(i.cat, i.pid), [{ ...i, w: +i.w, h: +i.h, qty: +i.qty }], R.settings).lines[0];
  }
  function totals() {
    const ready = st.items.filter((i) => sizeOK(i) && qtyOK(i));
    if (!ready.length) return null;
    return WW.calcMixed(ready.map((i) => ({ ...i, w: +i.w, h: +i.h, qty: +i.qty })), R);
  }

  function grid() {
    $('#cat-note').textContent = NOTE[st.tab];
    document.querySelectorAll('.tabs button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.tab === st.tab)));
    $('#pgrid').setAttribute('aria-labelledby', 'tab-' + st.tab);
    $('#pgrid').innerHTML = R[st.tab].map((p) => {
      const n = st.items.filter((i) => i.cat === st.tab && i.pid === p.id).length;
      return `<article class="prod"><img src="img/${p.id}.webp" width="600" height="600" loading="lazy" alt="">
        <div class="body"><h3>${esc(p.name)}</h3><p class="desc">${esc(p.desc)}</p>
        <p class="rate">From ₹${p.rate.toLocaleString('en-IN')} / ${per(st.tab)}</p>
        <button type="button" class="btn" data-add="${p.id}">Add window</button>
        <p class="count" aria-live="polite">${n ? `${n} in your list` : ''}</p></div></article>`;
    }).join('');
  }

  function itemHTML(i, n) {
    const p = find(i.cat, i.pid), err = st.errors[i.key], c = lineCost(i);
    return `<div class="item" data-key="${i.key}">
      <div class="item-top"><strong>${n}. ${esc(p.name)}</strong><span class="line-price">${c ? rupees(c.cost) : '–'}</span></div>
      <div class="fields">
        <label class="f-room">Room<input data-f="room" value="${esc(i.room)}" placeholder="Bedroom" autocomplete="off"></label>
        <label>Width<input data-f="w" type="number" inputmode="decimal" min="0" step="any" value="${esc(i.w)}" ${err ? 'aria-invalid="true"' : ''}></label>
        <label>Height<input data-f="h" type="number" inputmode="decimal" min="0" step="any" value="${esc(i.h)}" ${err ? 'aria-invalid="true"' : ''}></label>
        <label>Unit<select data-f="unit">${UNITS.map((u) => `<option value="${u[0]}" ${i.unit === u[0] ? 'selected' : ''}>${u[1]}</option>`).join('')}</select></label>
        <label>Qty<input data-f="qty" type="number" inputmode="numeric" min="1" step="1" value="${esc(i.qty)}"></label>
      </div>
      ${err ? `<p class="err" role="alert">${err}</p>` : ''}
      <div class="item-foot"><span class="measure">${c ? `About ${esc(c.measure)} × ${c.qty}, from ₹${p.rate.toLocaleString('en-IN')} / ${per(i.cat)}` : 'Type the width and height'}</span>
        <button type="button" class="rm" data-rm="${i.key}" aria-label="Remove ${esc(p.name)} ${n}">Remove</button></div>
    </div>`;
  }

  function totalsHTML() {
    const t = totals(), count = st.items.reduce((s, i) => s + (qtyOK(i) ? +i.qty : 1), 0);
    const motor = st.items.some((i) => find(i.cat, i.pid).motor);
    return `<div class="totals">
      <div class="row"><span>${count} window${count === 1 ? '' : 's'}, ${new Set(st.items.map((i) => i.pid)).size} product${new Set(st.items.map((i) => i.pid)).size === 1 ? '' : 's'}</span><span>before GST</span></div>
      <p class="big" id="total">${t ? `${rupees(t.low)} to ${rupees(t.high)}` : '₹0'}</p>
      <p class="fine">A rough guide at starting rates. We confirm the final price after measuring at your home.${motor ? ` Motors are extra, from ${rupees(R.settings.motorFrom)} each.` : ''}</p>
      ${st.asking ? '' : `<button type="button" class="btn btn-amber" data-ask>Get my estimate →</button>`}
    </div>`;
  }

  function whoHTML() {
    const me = WW.me() || {}, e = st.formErr, v = st.who || { name: me.name || '', mobile: me.mobile ? WW.showMobile(me.mobile) : '', area: me.area || '', email: me.email || '' };
    return `<form class="who" id="who" novalidate><h3>Who is the estimate for?</h3>
      <label>Your name<input name="name" value="${esc(v.name)}" autocomplete="name" ${e.name ? 'aria-invalid="true"' : ''}></label>${e.name ? `<p class="err">${e.name}</p>` : ''}
      <label>Mobile number<input name="mobile" type="tel" inputmode="numeric" maxlength="14" value="${esc(v.mobile)}" autocomplete="tel" ${e.mobile ? 'aria-invalid="true"' : ''}></label>${e.mobile ? `<p class="err">${e.mobile}</p>` : ''}
      <label>Area or PIN code<input name="area" value="${esc(v.area)}" placeholder="RS Puram" ${e.area ? 'aria-invalid="true"' : ''}></label>${e.area ? `<p class="err">${e.area}</p>` : ''}
      <label>Email (optional)<input name="email" type="email" value="${esc(v.email)}" autocomplete="email"></label>
      <label class="check"><input type="checkbox" name="consent" ${v.consent || WW.me() ? 'checked' : ''}><span>Window Works may call or message me about this estimate.</span></label>${e.consent ? `<p class="err">${e.consent}</p>` : ''}
      <div class="btns"><button type="submit" class="btn btn-amber">Show my estimate</button><button type="button" class="btn btn-line" data-cancel>Back</button></div>
    </form>`;
  }

  function cart() {
    const n = st.items.length;
    $('#cart').innerHTML = `<div class="cart-head"><h2>Your list</h2><span>${n ? `${n} line${n > 1 ? 's' : ''}` : 'empty'}</span></div>
      ${n ? `<div class="items">${st.items.map((i, k) => itemHTML(i, k + 1)).join('')}</div>${totalsHTML()}${st.asking ? whoHTML() : ''}`
        : '<p class="cart-empty">Nothing yet. Press <strong>Add window</strong> on a product to add it here. Add one line for each window or room, and mix blinds and curtains as you like.</p>'}`;
    mbar();
  }

  /* Update prices without re-drawing the fields being typed in. */
  function refreshNumbers() {
    st.items.forEach((i) => {
      const el = document.querySelector(`.item[data-key="${i.key}"]`); if (!el) return;
      const c = lineCost(i), p = find(i.cat, i.pid);
      $('.line-price', el).textContent = c ? rupees(c.cost) : '–';
      $('.measure', el).textContent = c ? `About ${c.measure} × ${c.qty}, from ₹${p.rate.toLocaleString('en-IN')} / ${per(i.cat)}` : 'Type the width and height';
    });
    const box = $('.totals');
    if (box) { const tmp = document.createElement('div'); tmp.innerHTML = totalsHTML(); box.replaceWith(tmp.firstElementChild); }
    mbar();
  }

  function mbar() {
    const t = totals(), bar = $('#mbar');
    bar.hidden = !st.items.length || !$('#done').hidden;
    $('#mbar-n').textContent = `${st.items.length} in your list`;
    $('#mbar-t').textContent = t ? `${rupees(t.low)} to ${rupees(t.high)} + GST` : 'Add sizes for a price';
  }

  function check() {
    st.errors = {};
    st.items.forEach((i) => {
      if (!sizeOK(i)) {
        const w = WW.toFeet(i.w, i.unit), h = WW.toFeet(i.h, i.unit);
        st.errors[i.key] = w > 0 && h > 0 ? `That looks very large. Is the unit set to ${UNITS.find((u) => u[0] === i.unit)[1]}?` : 'Please enter both the width and the height.';
      } else if (!qtyOK(i)) st.errors[i.key] = 'Qty should be a whole number, 1 or more.';
    });
    return !Object.keys(st.errors).length;
  }

  function showDone() {
    const lead = st.lead;
    $('#shop').hidden = true; $('.intro').hidden = true;
    const done = $('#done'); done.hidden = false;
    done.innerHTML = `<div class="done-bar"><h2>Your estimate is ready</h2>
        <button type="button" class="btn btn-amber" data-print>Save as PDF</button>
        <button type="button" class="btn btn-line" data-wa>Send to WhatsApp</button>
        <button type="button" class="btn btn-line" data-edit>Change the list</button></div>
      <div class="sheet-wrap"><div class="sheet ed-screen" id="sheet">${WW.estimateDocHTML(lead)}</div></div>
      <p class="done-note">Thanks, ${esc(lead.name)}. Our team will call ${esc(WW.showMobile(lead.mobile))} to fix a visit. <a href="admin.html">See it in the team view</a> (preview only).</p>`;
    fit(); mbar();
    window.scrollTo({ top: 0 }); $('#done h2').setAttribute('tabindex', '-1'); $('#done h2').focus({ preventScroll: true });
  }
  /* Shrink the A4 sheet to fit narrow screens. */
  function fit() {
    const wrap = $('.sheet-wrap'), sheet = $('#sheet'); if (!wrap || !sheet) return;
    sheet.style.transform = ''; wrap.style.height = '';
    const room = wrap.clientWidth - parseFloat(getComputedStyle(wrap).paddingLeft) * 2, w = sheet.offsetWidth;
    if (w > room) {
      const s = room / w;
      sheet.style.transform = `scale(${s})`; sheet.style.margin = '0';
      wrap.style.height = sheet.offsetHeight * s + parseFloat(getComputedStyle(wrap).paddingTop) * 2 + 'px';
    } else sheet.style.margin = '0 auto';
  }
  addEventListener('resize', fit);

  document.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.tab) { st.tab = b.dataset.tab; grid(); }
    else if (b.dataset.add) {
      add(st.tab, b.dataset.add); grid(); cart();
      const last = document.querySelector('.item:last-child');
      if (last) { if (matchMedia('(max-width: 860px)').matches) last.scrollIntoView({ block: 'center' }); else last.scrollIntoView({ block: 'nearest' }); $('input[data-f="w"]', last).focus({ preventScroll: true }); }
    } else if (b.dataset.rm) {
      st.items = st.items.filter((i) => String(i.key) !== b.dataset.rm); delete st.errors[b.dataset.rm];
      if (!st.items.length) st.asking = false;
      save(); grid(); cart();
    } else if ('ask' in b.dataset) {
      if (!check()) { cart(); const bad = $('[aria-invalid=true]'); if (bad) bad.focus(); return; }
      st.asking = true; st.formErr = {}; cart(); $('#who input[name=name]').focus();
    } else if ('cancel' in b.dataset) { st.asking = false; cart(); }
    else if ('print' in b.dataset) WW.printEstimate(st.lead);
    else if ('wa' in b.dataset) window.open('https://wa.me/?text=' + encodeURIComponent(WW.waText(st.lead)), '_blank', 'noopener');
    else if ('edit' in b.dataset) { $('#done').hidden = true; $('#shop').hidden = false; $('.intro').hidden = false; st.asking = false; grid(); cart(); window.scrollTo({ top: 0 }); }
  });

  document.addEventListener('input', (e) => {
    const f = e.target, row = f.closest('.item');
    if (row && f.dataset.f) {
      const item = st.items.find((i) => String(i.key) === row.dataset.key); if (!item) return;
      item[f.dataset.f] = f.value; save();
      if (st.errors[item.key]) { delete st.errors[item.key]; row.querySelectorAll('[aria-invalid]').forEach((x) => x.removeAttribute('aria-invalid')); const m = $('.err', row); if (m) m.remove(); }
      refreshNumbers();
    } else if (f.closest('#who')) { st.who = st.who || {}; }
  });
  document.addEventListener('change', (e) => { if (e.target.matches('.item select')) e.target.dispatchEvent(new Event('input', { bubbles: true })); });

  document.addEventListener('submit', (e) => {
    if (e.target.id !== 'who') return;
    e.preventDefault();
    const f = new FormData(e.target), v = {};
    ['name', 'mobile', 'area', 'email'].forEach((k) => { v[k] = String(f.get(k) || '').trim(); });
    v.consent = !!f.get('consent');
    st.who = v;
    const err = {};
    if (!v.name) err.name = 'Please tell us your name.';
    if (!WW.validMobile(v.mobile)) err.mobile = 'Please enter a 10-digit Indian mobile number.';
    if (!v.area) err.area = 'Please add your area or PIN code.';
    if (!v.consent) err.consent = 'Please tick this so our team can contact you.';
    st.formErr = err;
    if (Object.keys(err).length) { cart(); const bad = $('#who [aria-invalid=true]') || $('#who input[name=consent]'); if (bad) bad.focus(); return; }
    if (!check()) { st.asking = false; cart(); return; }
    const digits = WW.digits(v.mobile);
    const windows = st.items.map((i) => ({ room: i.room.trim() || 'Window', w: +i.w, h: +i.h, unit: i.unit, qty: +i.qty, cat: i.cat, pid: i.pid, pname: find(i.cat, i.pid).name }));
    const res = WW.calcMixed(windows, R);
    const names = [...new Set(windows.map((w) => w.pname))];
    st.lead = { id: 'L' + Date.now(), name: v.name, mobile: digits, area: v.area, email: v.email, visit: '', cat: 'mixed',
      product: names.length === 1 ? names[0] : names.length + ' products: ' + names.join(', '), windows, low: res.low, high: res.high, status: 'New', at: new Date().toISOString(), note: '' };
    WW.addLead(st.lead);
    showDone();
  });

  grid(); cart();
})();
