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
  /* Styles we commonly make for each product. Every style starts at the same rate; the real samples come to the home visit. */
  const STYLES = {
    vertical: [['Fabric slats', 'Soft, light-filtering'], ['PVC slats', 'Wipe-clean'], ['Blackout fabric', 'Dark rooms']],
    roller: [['Blackout', 'Shuts out light'], ['Sunscreen', 'See out, cut glare'], ['Dim-out', 'Softens light'], ['Printed', 'Your own design']],
    zebra: [['Standard', 'Sheer + solid bands'], ['Blackout bands', 'Darker when closed'], ['Wood-look', 'Textured bands'], ['Printed', 'Your own design']],
    venetian: [['25 mm aluminium', 'Slim slats'], ['50 mm aluminium', 'Wide slats'], ['Faux wood', 'Wood look']],
    roman: [['Flat fold', 'Neat, even pleats'], ['Relaxed fold', 'Soft curve at the base'], ['Lined blackout', 'For bedrooms']],
    wooden: [['35 mm slats', 'Classic'], ['50 mm slats', 'Wide, bold'], ['With tapes', 'Cloth tapes over cords']],
    monsoon: [['Clear PVC', 'Keep the view'], ['Tinted PVC', 'Less glare'], ['Outdoor fabric', 'More shade']],
    honeycomb: [['Light filtering', 'Soft daylight'], ['Blackout', 'Shuts out light'], ['Day-night', 'Two fabrics in one']],
    panel: [['Sheer panels', 'Light through'], ['Solid panels', 'Privacy'], ['Mixed', 'Sheer and solid']],
    zipper: [['Sunscreen mesh', 'See out, cut heat'], ['Blackout', 'Full shade'], ['Clear PVC', 'Rain cover, keep the view']],
    insulated: [['Venetian slats', 'Tilt for light'], ['Pleated', 'Folds up']],
    sheers: [['Plain', 'Classic voile'], ['Textured', 'Linen look'], ['Printed', 'Your own design']],
    eyelet: [['Plain', 'Solid colour'], ['Textured', 'Woven look'], ['Blackout lined', 'For bedrooms'], ['Printed', 'Your own design']],
    pleated: [['Pinch pleat', 'Classic'], ['Box pleat', 'Flat, tailored'], ['Pencil pleat', 'Gathered']],
    recess: [['Sheer', 'Light through'], ['Blackout', 'Shuts out light'], ['Sheer + blackout', 'Two layers']],
    led: [['Warm light', 'Yellow glow'], ['Cool light', 'White glow']],
    motorised: [['Single panel', 'Opens to one side'], ['Pair', 'Opens from the middle']]
  };
  const COLOURS = [['White', '#FFFFFF'], ['Ivory', '#F4EEDC'], ['Beige', '#D9C7A7'], ['Grey', '#9AA1A9'], ['Charcoal', '#3E434A'], ['Blue', '#3C5F95'], ['Brown', '#7A5638'], ['Choose at visit', '']];
  const CAP = 'Colour and fabric shown may differ from what you choose.';
  const GALLERY = (cat, id) => {
    const own = [['img/' + id + '.webp', '']];
    if (cat === 'blinds') return own.concat([['img/blinds/' + id + '.webp', ''], ['img/blinds/measure.webp', 'We measure every window at your home'], ['img/blinds/evening.webp', 'A finished room']]);
    const extra = id === 'motorised' ? [['img/pages/motor-hero.webp', ''], ['img/pages/motor-remote.webp', 'Opened by remote']] : [['img/pages/curtains-hero.webp', 'A finished room']];
    return own.concat(extra, [['img/pages/curtains-measure.webp', 'We measure every window at your home']]);
  };
  const ABOUT = {
    blinds: ['Made to the exact size of your window by our own team in Coimbatore.', 'We measure at your home and bring real samples of every style and colour.', 'Fitted and checked by our team.', 'Priced per square foot of window, 10 sq ft at least per blind. GST is extra.'],
    curtains: ['Stitched to your window by our own tailors.', 'We bring the fabric catalogues to your home and measure every window.', 'Curtains need about twice the window width in fabric so they hang in folds; the price includes this.', 'Priced per metre of fabric. GST is extra.']
  };
  const label = (i) => [i.style, i.colour && i.colour !== 'Choose at visit' ? i.colour : ''].filter(Boolean).join(', ');
  const per = (cat) => (cat === 'blinds' ? 'sq ft' : 'metre');
  const find = (cat, pid) => (R[cat] || []).find((p) => p.id === pid);

  const st = { tab: 'blinds', items: WW.store.get('ww-cart', []).filter((i) => find(i.cat, i.pid)), errors: {}, asking: false, lead: null, formErr: {} };
  let seq = st.items.reduce((m, i) => Math.max(m, i.key || 0), 0);
  const save = () => WW.store.set('ww-cart', st.items);

  function add(cat, pid, size) {
    const last = st.items[st.items.length - 1], o = size || {};
    st.items.push({ key: ++seq, cat, pid, room: o.room || '', w: o.w || '', h: o.h || '', unit: o.unit || (last ? last.unit : 'ft'), qty: o.qty || 1, style: o.style || (STYLES[pid] ? STYLES[pid][0][0] : ''), colour: o.colour || '' });
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
      const ns = (STYLES[p.id] || []).length;
      return `<article class="prod"><a class="open" href="#/${st.tab}/${p.id}"><img src="img/${p.id}.webp" width="600" height="600" loading="lazy" alt=""></a>
        <div class="body"><a class="open" href="#/${st.tab}/${p.id}"><h3>${esc(p.name)}</h3></a><p class="desc">${esc(p.desc)}</p>
        <p class="rate">From ₹${p.rate.toLocaleString('en-IN')} / ${per(st.tab)}</p>
        <button type="button" class="btn" data-add="${p.id}">Add window</button>
        <a class="see" href="#/${st.tab}/${p.id}">See ${ns} styles and colours →</a>
        <p class="count" aria-live="polite">${n ? `${n} in your list` : ''}</p></div></article>`;
    }).join('');
  }

  function itemHTML(i, n) {
    const p = find(i.cat, i.pid), err = st.errors[i.key], c = lineCost(i);
    return `<div class="item" data-key="${i.key}">
      <div class="item-top"><strong>${n}. ${esc(p.name)}${label(i) ? `<small class="item-style">${esc(label(i))}</small>` : ''}</strong><span class="line-price">${c ? rupees(c.cost) : '–'}</span></div>
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
    const windows = st.items.map((i) => ({ room: i.room.trim() || 'Window', w: +i.w, h: +i.h, unit: i.unit, qty: +i.qty, cat: i.cat, pid: i.pid, pname: find(i.cat, i.pid).name + (label(i) ? ' (' + label(i) + ')' : ''), style: i.style || '', colour: i.colour || '' }));
    const res = WW.calcMixed(windows, R);
    const names = [...new Set(windows.map((w) => find(w.cat, w.pid).name))];
    st.lead = { id: 'L' + Date.now(), name: v.name, mobile: digits, area: v.area, email: v.email, visit: '', cat: 'mixed',
      product: names.length === 1 ? names[0] : names.length + ' products: ' + names.join(', '), windows, low: res.low, high: res.high, status: 'New', at: new Date().toISOString(), note: '' };
    WW.addLead(st.lead);
    showDone();
  });

  /* ---------- Product page: opens at #/blinds/zebra ---------- */
  const pd = { pic: 0, style: '', colour: '', w: '', h: '', unit: 'ft', qty: 1, room: '', added: false, err: '' };
  function openProduct(cat, pid) {
    if (!find(cat, pid)) return false;
    if (pd.cat === cat && pd.pid === pid) return true;
    const last = st.items[st.items.length - 1];
    Object.assign(pd, { cat, pid, pic: 0, style: STYLES[pid] ? STYLES[pid][0][0] : '', colour: 'Choose at visit', w: '', h: '', unit: last ? last.unit : 'ft', qty: 1, room: '', added: false, err: '' });
    return true;
  }
  const pdpPrice = () => lineCost({ cat: pd.cat, pid: pd.pid, w: pd.w, h: pd.h, unit: pd.unit, qty: pd.qty });
  function buyHTML() {
    const p = find(pd.cat, pd.pid), c = pdpPrice(), t = totals();
    return `${pd.added ? `<div class="added" role="status">✓ Added to your list: ${st.items.length} line${st.items.length > 1 ? 's' : ''}${t ? `, ${rupees(t.low)} to ${rupees(t.high)}` : ''}.</div>` : ''}
      <p class="bb-price" id="bb-price">${c ? rupees(c.cost) : `₹${p.rate.toLocaleString('en-IN')} / ${per(pd.cat)}`}</p>
      <p class="bb-sub" id="bb-sub">${c ? `About ${c.measure} × ${c.qty}, before GST` : 'Type your window size to see your price'}</p>
      <div class="bb-fields">
        <label>Width<input data-b="w" type="number" inputmode="decimal" min="0" step="any" value="${esc(pd.w)}" ${pd.err ? 'aria-invalid="true"' : ''}></label>
        <label>Height<input data-b="h" type="number" inputmode="decimal" min="0" step="any" value="${esc(pd.h)}" ${pd.err ? 'aria-invalid="true"' : ''}></label>
        <label>Unit<select data-b="unit">${UNITS.map((u) => `<option value="${u[0]}" ${pd.unit === u[0] ? 'selected' : ''}>${u[1]}</option>`).join('')}</select></label>
        <label>Qty<select data-b="qty">${Array.from({ length: 20 }, (_, k) => `<option ${+pd.qty === k + 1 ? 'selected' : ''}>${k + 1}</option>`).join('')}</select></label>
        <label class="wide">Room (optional)<input data-b="room" value="${esc(pd.room)}" placeholder="Bedroom"></label>
      </div>
      ${pd.err ? `<p class="err" role="alert">${pd.err}</p>` : ''}
      <button type="button" class="btn btn-amber" data-addpd>Add to estimate</button>
      <button type="button" class="btn btn-orange" data-buynow>Get estimate now</button>
      ${st.items.length ? `<a class="btn btn-line" href="#" data-golist>View your list (${st.items.length})</a>` : ''}
      <dl class="bb-meta"><dt>Made by</dt><dd>Window Works, Coimbatore</dd><dt>Fitting</dt><dd>By our own team</dd><dt>Estimate</dt><dd>Free, no obligation</dd></dl>`;
  }
  function pdpHTML() {
    const p = find(pd.cat, pd.pid), pics = GALLERY(pd.cat, pd.pid), styles = STYLES[pd.pid] || [];
    const others = R[pd.cat].filter((x) => x.id !== pd.pid);
    const catName = pd.cat === 'blinds' ? 'Blinds' : 'Curtains';
    return `<p class="crumbs"><a href="#">All products</a> › <a href="#" data-cat="${pd.cat}">${catName}</a> › ${esc(p.name)}</p>
      ${st.items.length ? `<div class="listbar"><strong>Your list: ${st.items.length} line${st.items.length > 1 ? 's' : ''}</strong><a href="#" data-golist>View list and get estimate →</a></div>` : ''}
      <div class="pdp-grid">
        <div class="gallery">
          <div class="thumbs" role="group" aria-label="Pictures">${pics.map((g, k) => `<button type="button" data-pic="${k}" aria-pressed="${k === pd.pic}" aria-label="Picture ${k + 1}"><img src="${g[0]}" alt="" loading="lazy"></button>`).join('')}</div>
          <div class="main-pic"><img id="main-pic" src="${pics[pd.pic][0]}" alt="${esc(p.name)}"></div>
          <p class="pic-cap" id="pic-cap">${esc(pics[pd.pic][1] || CAP)}</p>
        </div>
        <div class="info">
          <h1>${esc(p.name)}</h1>
          <p class="by"><a href="./">Made by Window Works, Coimbatore</a></p>
          <hr>
          <div class="pricebox"><span class="from">Starting rate</span>
            <p class="amt"><sup>₹</sup>${p.rate.toLocaleString('en-IN')} <small>/ ${per(pd.cat)}</small></p>
            <p class="tax">Plus GST. The same starting rate for every style below.${p.motor ? ` The motor is extra, from ${rupees(R.settings.motorFrom)}.` : ''}</p></div>
          <hr>
          ${styles.length ? `<div class="opt"><p class="opt-label">Style: <b id="style-name">${esc(pd.style)}</b></p>
            <div class="tiles">${styles.map((x) => `<button type="button" data-style="${esc(x[0])}" aria-pressed="${pd.style === x[0]}">${esc(x[0])}<small>${esc(x[1])}</small></button>`).join('')}</div></div>` : ''}
          <div class="opt"><p class="opt-label">Colour: <b id="colour-name">${esc(pd.colour)}</b></p>
            <div class="swatches">${COLOURS.map((c) => `<button type="button" data-colour="${c[0]}" aria-pressed="${pd.colour === c[0]}" aria-label="${c[0]}" title="${c[0]}" class="${c[1] ? '' : 'any'}"><span ${c[1] ? `style="background:${c[1]}"` : ''}></span></button>`).join('')}</div></div>
          <hr>
          <div class="about"><h2>About this item</h2><ul><li>${esc(p.desc)}</li>${ABOUT[pd.cat].map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
        </div>
        <aside class="buybox" id="buybox" aria-label="Your size and price">${buyHTML()}</aside>
      </div>
      <section class="more"><h2>More ${catName.toLowerCase()}</h2>
        <div class="strip">${others.map((x) => `<a href="#/${pd.cat}/${x.id}"><img src="img/${x.id}.webp" alt="" loading="lazy" width="180" height="180"><strong>${esc(x.name)}</strong><span>From ₹${x.rate.toLocaleString('en-IN')} / ${per(pd.cat)}</span></a>`).join('')}</div></section>`;
  }
  const paintPdp = () => { $('#pdp').innerHTML = pdpHTML(); };

  function showList() {
    if (location.hash) history.pushState(null, '', location.pathname);
    route();
  }
  function route() {
    const m = location.hash.match(/^#\/(blinds|curtains)\/([a-z]+)$/);
    const isPdp = !!(m && openProduct(m[1], m[2]));
    $('#done').hidden = true;
    $('#pdp').hidden = !isPdp; $('#shop').hidden = isPdp; $('.intro').hidden = isPdp;
    if (isPdp) { paintPdp(); document.title = find(pd.cat, pd.pid).name + ' | Window Works'; }
    else { document.title = 'Get your estimate | Window Works'; grid(); cart(); }
    mbar(); window.scrollTo({ top: 0 });
  }
  addEventListener('hashchange', route);

  const pdp = $('#pdp');
  pdp.addEventListener('click', (e) => {
    const t = e.target.closest('button, a'); if (!t) return;
    if (t.dataset.pic) {
      pd.pic = +t.dataset.pic; const g = GALLERY(pd.cat, pd.pid)[pd.pic];
      $('#main-pic').src = g[0]; $('#pic-cap').textContent = g[1] || CAP;
      pdp.querySelectorAll('[data-pic]').forEach((b) => b.setAttribute('aria-pressed', String(b === t)));
    } else if (t.dataset.style) {
      pd.style = t.dataset.style; $('#style-name').textContent = pd.style;
      pdp.querySelectorAll('[data-style]').forEach((b) => b.setAttribute('aria-pressed', String(b === t)));
    } else if (t.dataset.colour) {
      pd.colour = t.dataset.colour; $('#colour-name').textContent = pd.colour;
      pdp.querySelectorAll('[data-colour]').forEach((b) => b.setAttribute('aria-pressed', String(b === t)));
    } else if (t.dataset.cat) { e.preventDefault(); st.tab = t.dataset.cat; showList(); }
    else if (t.getAttribute('href') === '#' && !('golist' in t.dataset)) { e.preventDefault(); showList(); }
    else if ('golist' in t.dataset) { e.preventDefault(); showList(); $('#cart').scrollIntoView(); }
    else if ('addpd' in t.dataset || 'buynow' in t.dataset) {
      if (!sizeOK({ w: pd.w, h: pd.h, unit: pd.unit })) {
        const w = WW.toFeet(pd.w, pd.unit), h = WW.toFeet(pd.h, pd.unit);
        pd.err = w > 0 && h > 0 ? `That looks very large. Is the unit set to ${UNITS.find((u) => u[0] === pd.unit)[1]}?` : 'Please enter the width and the height.';
        $('#buybox').innerHTML = buyHTML(); const bad = $('#buybox [aria-invalid=true]'); if (bad) bad.focus(); return;
      }
      add(pd.cat, pd.pid, { w: pd.w, h: pd.h, unit: pd.unit, qty: +pd.qty, room: pd.room.trim(), style: pd.style, colour: pd.colour === 'Choose at visit' ? '' : pd.colour });
      if ('buynow' in t.dataset) {
        st.asking = !!check();
        showList(); $('#cart').scrollIntoView();
        const n = $('#who input[name=name]'); if (n) n.focus({ preventScroll: true });
        return;
      }
      Object.assign(pd, { added: true, w: '', h: '', room: '', qty: 1, err: '' });
      paintPdp(); $('#buybox').scrollIntoView({ block: 'nearest' });
    }
  });
  pdp.addEventListener('input', (e) => {
    const f = e.target.dataset.b; if (!f) return;
    pd[f] = e.target.value;
    if (pd.err) { pd.err = ''; pdp.querySelectorAll('#buybox [aria-invalid]').forEach((x) => x.removeAttribute('aria-invalid')); const m = $('#buybox .err'); if (m) m.remove(); }
    if (pd.added) { pd.added = false; const a = $('#buybox .added'); if (a) a.remove(); }
    const c = pdpPrice(), p = find(pd.cat, pd.pid);
    $('#bb-price').textContent = c ? rupees(c.cost) : `₹${p.rate.toLocaleString('en-IN')} / ${per(pd.cat)}`;
    $('#bb-sub').textContent = c ? `About ${c.measure} × ${c.qty}, before GST` : 'Type your window size to see your price';
  });
  pdp.addEventListener('change', (e) => { if (e.target.matches('select[data-b]')) e.target.dispatchEvent(new Event('input', { bubbles: true })); });

  route();
})();

