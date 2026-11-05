/* Design preview only: fixed sample screens. The menu switches screens. Nothing filters, saves or exports. */
(function () {
  const sheet = document.querySelector('#sheet');
  const ROWS = [
    ['Sample: Priya', 'RS Puram', 'Roller blinds', 3, '₹6,400+', 'New', 'Today'],
    ['Sample: Arun', 'Saibaba Colony', 'Eyelet curtains', 1, '₹2,750+', 'New', 'Today'],
    ['Sample: Meena', 'Peelamedu', 'Zebra blinds', 2, '₹10,100+', 'Contacted', 'Yesterday'],
    ['Sample: Karthik', 'Race Course', 'Sheers', 3, '₹11,350+', 'Site visit booked', '3 Nov'],
    ['Sample: Deepa', 'Vadavalli', 'Wooden blinds', 1, '₹4,500+', 'Contacted', '2 Nov'],
    ['Sample: Suresh', 'Saravanampatti', 'External zipper blinds', 1, '₹74,900+', 'New', '2 Nov'],
    ['Sample: Lakshmi', 'RS Puram', 'Pleated curtains', 3, '₹5,500+', 'Closed', '30 Oct'],
    ['Sample: Vignesh', 'Ganapathy', 'Vertical blinds', 4, '₹13,900+', 'Closed', '28 Oct'],
  ];
  const pill = (s) => `<span class="pill p-${s.split(' ')[0]}">${s}</span>`;
  const tile = (w, h, room, size) => {
    let slats = '';
    const left = 70 - w, top = 60 - h;
    for (let y = 0; y < h * 1.2; y += 9) slats += `<rect x="${left}" y="${top + y}" width="${w * 2}" height="6" fill="#081C45"/>`;
    return `<div class="win"><svg viewBox="0 0 140 120" aria-hidden="true"><rect x="${left}" y="${top}" width="${w * 2}" height="${h * 2}" fill="#D9D2C2"/>${slats}<rect x="${left}" y="${top}" width="${w * 2}" height="${h * 2}" fill="none" stroke="#081C45" stroke-width="3"/></svg><p>${room}<small>${size}</small></p></div>`;
  };

  const ENQUIRIES = `<div class="title-row"><div><h1>Enquiries</h1><p>Everyone who asked for a rough price</p></div><button type="button" class="btn">Export to Excel (CSV)</button></div>
    <div class="kpis">
      <div class="kpi"><span>Waiting for a call</span><strong>3</strong></div>
      <div class="kpi"><span>Enquiries in the last 7 days</span><strong>7</strong></div>
      <div class="kpi"><span>Site visits booked</span><strong>1</strong></div>
      <div class="kpi"><span>Most asked for</span><strong class="long">Roller blinds</strong></div>
    </div>
    <div class="tabs"><button type="button" class="tab on">All<b>8</b></button><button type="button" class="tab">New<b>3</b></button><button type="button" class="tab">Contacted<b>2</b></button><button type="button" class="tab">Site visit booked<b>1</b></button><button type="button" class="tab">Closed<b>2</b></button></div>
    <div class="tools"><input type="search" aria-label="Search" placeholder="Search name, area or number"><select aria-label="Product"><option>All products</option></select><span class="count">8 enquiries</span></div>
    <div class="split"><div><table><thead><tr><th>Customer</th><th class="hide-s">Product</th><th class="hide-s num">Windows</th><th class="num">Rough price</th><th>Status</th><th class="hide-s">Received</th></tr></thead><tbody>
      ${ROWS.map((r, i) => `<tr class="${i === 0 ? 'sel' : ''}"><td class="who">${r[0]}<small>${r[1]}</small></td><td class="hide-s">${r[2]}</td><td class="hide-s num">${r[3]}</td><td class="num">${r[4]}</td><td>${pill(r[5])}</td><td class="hide-s">${r[6]}</td></tr>`).join('')}
    </tbody></table></div>
    <aside class="detail" aria-label="Enquiry details"><h2>Sample: Priya</h2><p class="sub">RS Puram · 90000 00000</p>
      <p class="price">₹6,400 to ₹8,350</p><p class="sub">Roller blinds, shown to the customer before GST</p>
      <div class="row"><button type="button" class="btn btn-main" style="flex:1">Call</button><button type="button" class="btn">WhatsApp</button></div>
      <h3>Windows, to scale</h3><div class="wins">${tile(30, 36, 'Bedroom', '5 × 6 ft, 2 of these')}${tile(24, 30, 'Study', '4 × 5 ft')}</div>
      <label class="f">Status<select><option>New</option><option>Contacted</option><option>Site visit booked</option><option>Closed</option></select></label>
      <label class="f">Team note<textarea rows="3">Wants a visit on Saturday.</textarea></label>
    </aside></div>`;

  const rate = (name, value, unit) => `<label class="rate"><span>${name}<small style="display:block;color:var(--muted);font-size:13px">₹ per ${unit}</small></span><input value="${value}" inputmode="numeric"></label>`;
  const rule = (name, value) => `<label class="rate"><span>${name}</span><input value="${value}" inputmode="numeric"></label>`;
  const PRICES = `<div class="title-row"><div><h1>Prices</h1><p>Where the team would change rates without a developer</p></div><div><button type="button" class="btn">Reset</button> <button type="button" class="btn btn-main">Save prices</button></div></div>
    <div class="price-grid"><div><h2>Blinds</h2>${[['Vertical blinds', 55], ['Roller blinds', 80], ['Zebra blinds', 120], ['Venetian blinds', 150], ['Roman blinds', 225], ['Wooden blinds', 280], ['Monsoon blinds', 280], ['Honeycomb blinds', 300], ['Panel blinds', 420], ['External zipper blinds', 780], ['Insulated glass blinds', 1200]].map((p) => rate(p[0], p[1], 'sq ft')).join('')}</div>
    <div><h2>Curtains</h2>${[['Sheers', 300], ['Eyelet curtains', 250], ['Pleated curtains', 250], ['Recess curtains', 250], ['LED curtains', 250], ['Motorised curtains', 250]].map((p) => rate(p[0], p[1], 'metre')).join('')}</div>
    <div><h2>How the estimate works</h2><p class="hint">Placeholder values, for Window Works to confirm.</p>${rule('Smallest blind billed (sq ft)', 10)}${rule('Curtain fullness (times the width)', 2)}${rule('Fabric roll width (inches)', 54)}${rule('Hem allowance per drop (ft)', 1)}${rule('Top of price range (% above base)', 30)}${rule('Motor starts from (₹)', 15000)}</div></div>`;

  const show = (view) => { sheet.innerHTML = view === 'prices' ? PRICES : ENQUIRIES; };
  document.querySelector('.side nav').addEventListener('click', (e) => {
    const b = e.target.closest('.nav');
    if (!b) return;
    document.querySelectorAll('.nav').forEach((n) => { const on = n === b; n.classList.toggle('on', on); if (on) n.setAttribute('aria-current', 'page'); else n.removeAttribute('aria-current'); });
    show(b.dataset.view);
  });
  show('leads');
})();
