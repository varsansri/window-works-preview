(function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const { esc, rupees } = WW;
  const STATUSES = ['New', 'Contacted', 'Site visit booked', 'Closed'];
  const ui = { view: 'leads', status: 'All', product: 'All', search: '', selected: null, saved: false };
  const sheet = $('#sheet');
  let leads = WW.leads();
  ui.selected = leads[0] ? leads[0].id : null;

  const pillClass = (s) => 'pill p-' + s.split(' ')[0];
  const when = (iso) => {
    const d = new Date(iso), days = Math.floor((Date.now() - d) / 864e5);
    if (days <= 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };
  const save = () => WW.store.set('ww-leads', leads);

  function visible() {
    const s = ui.search.trim().toLowerCase();
    return leads.filter((l) => (ui.status === 'All' || l.status === ui.status)
      && (ui.product === 'All' || l.product === ui.product)
      && (!s || (l.name + ' ' + l.area + ' ' + l.mobile).toLowerCase().includes(s)));
  }

  function topProduct() {
    const c = {}; leads.forEach((l) => { c[l.product] = (c[l.product] || 0) + 1; });
    const best = Object.entries(c).sort((a, b) => b[1] - a[1])[0];
    return best ? best[0] : '–';
  }

  function detail(l) {
    if (!l) return `<aside class="detail"><p class="empty">Choose an enquiry to see its windows.</p></aside>`;
    const wins = l.windows.map((w) => {
      const f = WW.toFeet(w.w, w.unit), h = WW.toFeet(w.h, w.unit);
      return `<div class="win">${WW.drawWindow(f, h, l.cat, { frame: '#0b2a61', glass: '#b9cdee', cloth: '#134aa2', w: 140, h: 120 })}<p>${esc(w.room)}<small>${esc(w.w)} × ${esc(w.h)} ${esc(w.unit)}${w.qty > 1 ? ', ' + esc(w.qty) + ' of these' : ''}</small></p></div>`;
    }).join('');
    return `<aside class="detail" aria-label="Enquiry details"><h2>${esc(l.name)}</h2><p class="sub">${esc(l.area)} · ${esc(l.mobile)}</p>
      <p class="price">${rupees(l.low)} to ${rupees(l.high)}</p><p class="sub">${esc(l.product)}, shown to the customer before GST</p>
      <div class="row"><a class="btn btn-main" href="tel:${esc(l.mobile.replace(/\s/g, ''))}">Call</a><button type="button" class="btn" data-demo>WhatsApp</button></div>
      <p class="saved" id="demo-msg" role="status" hidden></p>
      <h3>Windows, to scale</h3><div class="wins">${wins}</div>
      <label class="f">Status<select data-status>${STATUSES.map((s) => `<option ${s === l.status ? 'selected' : ''}>${s}</option>`).join('')}</select></label>
      <label class="f">Team note<textarea rows="3" data-note>${esc(l.note)}</textarea></label>
      ${l.visit ? `<p class="sub" style="margin-top:10px">Asked for a visit on ${esc(l.visit)}</p>` : ''}
    </aside>`;
  }

  function leadsView() {
    const list = visible();
    if (!list.find((l) => l.id === ui.selected)) ui.selected = list[0] ? list[0].id : null;
    const sel = list.find((l) => l.id === ui.selected);
    const waiting = leads.filter((l) => l.status === 'New').length;
    const visits = leads.filter((l) => l.status === 'Site visit booked').length;
    const week = leads.filter((l) => Date.now() - new Date(l.at) < 7 * 864e5).length;
    const products = [...new Set(leads.map((l) => l.product))].sort();
    const count = (s) => s === 'All' ? leads.length : leads.filter((l) => l.status === s).length;
    return `<div class="title-row"><div><h1>Enquiries</h1><p>Everyone who asked for a rough price</p></div><button type="button" class="btn" data-export>Export to Excel (CSV)</button></div>
    <div class="kpis">
      <div class="kpi"><span>Waiting for a call</span><strong>${waiting}</strong></div>
      <div class="kpi"><span>Enquiries in the last 7 days</span><strong>${week}</strong></div>
      <div class="kpi"><span>Site visits booked</span><strong>${visits}</strong></div>
      <div class="kpi"><span>Most asked for</span><strong class="long">${esc(topProduct())}</strong></div>
    </div>
    <div class="tabs" role="group" aria-label="Filter by status">${['All', ...STATUSES].map((s) => `<button type="button" class="tab ${ui.status === s ? 'on' : ''}" data-tab="${s}" aria-pressed="${ui.status === s}">${s}<b>${count(s)}</b></button>`).join('')}</div>
    <div class="tools"><input type="search" id="search" aria-label="Search by name, area or number" placeholder="Search name, area or number" value="${esc(ui.search)}">
      <select id="pfilter" aria-label="Filter by product"><option value="All">All products</option>${products.map((p) => `<option ${ui.product === p ? 'selected' : ''}>${esc(p)}</option>`).join('')}</select>
      <span class="count">${list.length} ${list.length === 1 ? 'enquiry' : 'enquiries'}</span></div>
    <div class="split"><div>${list.length ? `<table><thead><tr><th>Customer</th><th class="hide-s">Product</th><th class="hide-s num">Windows</th><th class="num">Rough price</th><th>Status</th><th class="hide-s">Received</th></tr></thead><tbody>
      ${list.map((l) => `<tr data-id="${esc(l.id)}" class="${l.id === ui.selected ? 'sel' : ''}"><td class="who"><button type="button">${esc(l.name)}</button><small>${esc(l.area)}</small></td><td class="hide-s">${esc(l.product)}</td><td class="hide-s num">${l.windows.reduce((t, w) => t + (+w.qty || 1), 0)}</td><td class="num">${rupees(l.low)}+</td><td><span class="${pillClass(l.status)}">${esc(l.status)}</span></td><td class="hide-s">${when(l.at)}</td></tr>`).join('')}
    </tbody></table>` : '<p class="empty">No enquiries match these filters.</p>'}</div>${detail(sel)}</div>`;
  }

  function pricesView() {
    const R = WW.rates();
    const rate = (p, unit) => `<label class="rate"><span>${esc(p.name)}<small style="display:block;color:var(--muted);font-size:13px">₹ per ${unit}</small></span><input type="number" min="1" step="1" name="${p.id}" value="${p.rate}"></label>`;
    const set = (k, label) => `<label class="rate"><span>${label}</span><input type="number" min="0" step="any" name="s-${k}" value="${R.settings[k]}"></label>`;
    return `<form id="prices"><div class="title-row"><div><h1>Prices</h1><p>The team can change these without a developer. The estimator uses them straight away.</p></div><div><span class="saved" id="saved" role="status" ${ui.saved ? '' : 'hidden'}>Saved</span> <button type="button" class="btn" data-reset>Reset</button> <button class="btn btn-main">Save prices</button></div></div>
    <div class="price-grid"><div><h2>Blinds</h2>${R.blinds.map((p) => rate(p, 'sq ft')).join('')}</div><div><h2>Curtains</h2>${R.curtains.map((p) => rate(p, 'metre')).join('')}</div>
    <div><h2>How the estimate works</h2><p class="hint">Placeholder values, for Window Works to confirm.</p>${set('minArea', 'Smallest blind billed (sq ft)')}${set('fullness', 'Curtain fullness (times the width)')}${set('fabricWidthIn', 'Fabric roll width (inches)')}${set('hemFt', 'Hem allowance per drop (ft)')}${set('rangeTopPct', 'Top of price range (% above base)')}${set('motorFrom', 'Motor starts from (₹)')}</div></div></form>`;
  }

  function render() { sheet.innerHTML = ui.view === 'leads' ? leadsView() : pricesView(); }

  function csv() {
    const cell = (v) => {
      let s = String(v == null ? '' : v);
      if (/^[=+\-@]/.test(s)) s = "'" + s; /* stops Excel treating a typed value as a formula */
      return '"' + s.replace(/"/g, '""') + '"';
    };
    const rows = [['Name', 'Mobile', 'Area', 'Product', 'Windows', 'Low', 'High', 'Status', 'Received', 'Note']];
    visible().forEach((l) => rows.push([l.name, l.mobile, l.area, l.product, l.windows.map((w) => `${w.room} ${w.w}x${w.h}${w.unit} x${w.qty}`).join('; '), l.low, l.high, l.status, l.at.slice(0, 10), l.note]));
    const blob = new Blob(['﻿' + rows.map((r) => r.map(cell).join(',')).join('\r\n')], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'window-works-enquiries.csv'; a.click(); URL.revokeObjectURL(a.href);
  }

  document.querySelector('.side nav').addEventListener('click', (e) => {
    const b = e.target.closest('.nav'); if (!b) return;
    ui.view = b.dataset.view; ui.saved = false;
    document.querySelectorAll('.nav').forEach((n) => { const on = n === b; n.classList.toggle('on', on); if (on) n.setAttribute('aria-current', 'page'); else n.removeAttribute('aria-current'); });
    render();
  });
  sheet.addEventListener('click', (e) => {
    const tab = e.target.closest('[data-tab]');
    if (tab) { ui.status = tab.dataset.tab; render(); return; }
    if (e.target.closest('[data-export]')) { csv(); return; }
    if (e.target.closest('[data-demo]')) { const m = $('#demo-msg'); m.hidden = false; m.textContent = 'In the live site this opens WhatsApp.'; return; }
    if (e.target.closest('[data-reset]')) { WW.store.del('ww-rates'); ui.saved = false; render(); return; }
    const tr = e.target.closest('tbody tr');
    if (tr) { ui.selected = tr.dataset.id; render(); const f = $(`tr[data-id="${CSS.escape(ui.selected)}"] button`); if (f) f.focus(); }
  });
  sheet.addEventListener('input', (e) => {
    if (e.target.id === 'search') {
      ui.search = e.target.value; const pos = e.target.selectionStart; render();
      const s = $('#search'); s.focus(); s.setSelectionRange(pos, pos);
    }
    if (e.target.matches('[data-note]')) { const l = leads.find((x) => x.id === ui.selected); if (l) { l.note = e.target.value; save(); } }
  });
  sheet.addEventListener('change', (e) => {
    if (e.target.id === 'pfilter') { ui.product = e.target.value; render(); }
    if (e.target.matches('[data-status]')) { const l = leads.find((x) => x.id === ui.selected); if (l) { l.status = e.target.value; save(); render(); } }
  });
  sheet.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(e.target), out = { settings: {} };
    for (const [k, v] of f.entries()) {
      const n = Number(v); if (!(n >= 0) || v === '') continue;
      if (k.startsWith('s-')) out.settings[k.slice(2)] = n; else if (n > 0) out[k] = n;
    }
    if (out.settings.fabricWidthIn === 0) delete out.settings.fabricWidthIn;
    WW.store.set('ww-rates', out); ui.saved = true; render();
  });
  render();
})();
