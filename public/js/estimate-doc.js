/* "Save as PDF": prints a proper A4 estimate (letterhead, number, customer, line items, total, terms)
   instead of the web page. Used by the quote tool and My account. Needs data.js first. */
(function () {
  const WW = window.WW; if (!WW) return;
  const { esc, rupees } = WW;
  const BIZ = {
    name: 'Window Works', tag: 'Curtains · Blinds · Skylights',
    address: ['19, G.R.D Layout, A.A. Scheme Road', 'RS Puram, Coimbatore 641002'],
    phone: '+91 91590 30465', email: 'admin@windowworks.in', web: 'windowworks.in'
  };
  const day = (iso) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const visitDay = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const money = (n) => '₹' + Math.round(n).toLocaleString('en-IN');

  function number(lead) {
    const d = new Date(lead.at || Date.now());
    const ymd = String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
    const tail = String(lead.id || '').replace(/\D/g, '').slice(-4).padStart(4, '0');
    return 'WW-' + ymd + '-' + tail;
  }

  function build(lead) {
    const r = WW.rates(), mixed = lead.cat === 'mixed', product = mixed ? null : WW.findProduct(lead, r);
    const res = mixed ? WW.calcMixed(lead.windows, r) : product ? WW.calc(lead.cat, product, lead.windows, r.settings) : { lines: lead.windows, raw: 0, low: lead.low, high: lead.high };
    const unit = lead.cat === 'blinds' ? 'sq ft' : 'metre';
    const rate = product ? `${money(product.rate)} / ${unit}` : '';
    const rows = res.lines.map((l, i) => `<tr>
        <td class="c">${i + 1}</td>
        <td><strong>${esc(l.room) || 'Window'}</strong><span>${esc(mixed ? l.pname || l.product || '' : lead.product)}</span></td>
        <td>${esc(l.w)} × ${esc(l.h)} ${esc(l.unit)}</td>
        <td>${l.measure ? esc(l.measure) : ''}</td>
        <td class="c">${esc(l.qty)}</td>
        <td class="r">${mixed ? (l.rate ? `${money(l.rate)} / ${l.unitName}` : '') : rate}</td>
        <td class="r">${l.cost ? money(l.cost) : ''}</td></tr>`).join('');
    const motor = mixed ? res.motor : product && product.motor;
    const kinds = mixed ? [...new Set(res.lines.map((l) => l.product).filter(Boolean))] : [];
    const who = [lead.name && `<strong>${esc(String(lead.name).replace(/^Sample:\s*/, ''))}</strong>`, lead.mobile && esc(WW.showMobile(lead.mobile)), lead.area && esc(lead.area), lead.email && esc(lead.email)].filter(Boolean).join('<br>');
    return `<div class="ed-page">
  <header class="ed-head">
    <div class="ed-brand"><span class="ed-logo"><img src="img/logo-white.png" alt="Window Works"></span>
      <div><p class="ed-biz">${BIZ.name}</p><p class="ed-tag">${BIZ.tag}</p></div></div>
    <div class="ed-from">${BIZ.address.join('<br>')}<br>${BIZ.phone}<br>${BIZ.email} · ${BIZ.web}</div>
  </header>
  <div class="ed-titlebar"><h1>Estimate</h1>
    <dl><div><dt>Estimate no.</dt><dd>${number(lead)}</dd></div><div><dt>Date</dt><dd>${day(lead.at || Date.now())}</dd></div></dl></div>
  <section class="ed-parties">
    <div><h2>Prepared for</h2><p>${who || 'Customer'}</p></div>
    <div><h2>${mixed ? 'Products' : 'Product'}</h2><p>${mixed ? `<strong>${kinds.length} product${kinds.length > 1 ? 's' : ''}</strong><br>${kinds.map(esc).join(', ')}` : `<strong>${esc(lead.product)}</strong><br>Starting rate ${rate || 'on request'}`}${lead.visit ? `<br>Visit asked for: ${esc(visitDay(lead.visit))}` : ''}</p></div>
  </section>
  <table class="ed-items">
    <thead><tr><th class="c">#</th><th>Window</th><th>Size</th><th>Billed as</th><th class="c">Qty</th><th class="r">Rate</th><th class="r">Amount</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="ed-sum">
    <div class="ed-terms"><h2>Terms</h2><ol>
      <li>This is a rough estimate at our starting rates, not a final quote or a tax invoice.</li>
      <li>The final price depends on the fabric and fittings you choose, and is confirmed after we measure at your home.</li>
      <li>GST is extra.${motor ? ` The motor is extra, from ${money(r.settings.motorFrom)} plus GST.` : ''}</li>
    </ol></div>
    <table class="ed-totals"><tbody>
      ${res.raw ? `<tr><th>At starting rates</th><td>${money(res.raw)}</td></tr>` : ''}
      <tr><th>Rough range, before GST</th><td>${rupees(res.low)} to ${rupees(res.high)}</td></tr>
      <tr class="ed-grand"><th>Estimate from</th><td>${rupees(res.low)}<span>+ GST</span></td></tr>
    </tbody></table>
  </div>
  <section class="ed-next"><h2>What happens next</h2>
    <ol><li><b>1</b>We call you to fix a visit.</li><li><b>2</b>We bring catalogues and measure every window.</li><li><b>3</b>You get the exact price for what you choose.</li><li><b>4</b>Our tailors stitch it and our team fits it.</li></ol></section>
  <footer class="ed-foot"><span>Thank you for choosing ${BIZ.name}. Questions? Call ${BIZ.phone}.</span><span>${number(lead)}</span></footer>
</div>`;
  }

  WW.estimateNumber = number;
  WW.estimateDocHTML = build;
  WW.printEstimate = function (lead) {
    if (!lead) return window.print();
    let doc = document.getElementById('est-doc');
    if (!doc) { doc = document.createElement('div'); doc.id = 'est-doc'; doc.setAttribute('aria-hidden', 'true'); document.body.appendChild(doc); }
    doc.innerHTML = build(lead);
    const was = document.title;
    document.title = 'Window Works estimate ' + number(lead); /* the PDF's suggested file name */
    document.documentElement.classList.add('printing-doc');
    const done = () => { document.documentElement.classList.remove('printing-doc'); document.title = was; window.removeEventListener('afterprint', done); };
    window.addEventListener('afterprint', done);
    const img = doc.querySelector('img');
    const ready = img && img.decode ? img.decode().catch(() => {}) : Promise.resolve();
    ready.then(() => window.print());
  };
})();
