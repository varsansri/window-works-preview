/* Rates, sums and demo storage. The rates are the starting prices on windowworks.in, before GST. */
(function (root) {
  const DEFAULTS = {
    blinds: [
      { id: 'vertical', name: 'Vertical blinds', rate: 55, desc: 'Long slats that part sideways. A good fit for tall windows and sliding doors.' },
      { id: 'roller', name: 'Roller blinds', rate: 80, desc: 'One flat sheet of fabric that rolls up out of sight.' },
      { id: 'zebra', name: 'Zebra blinds', rate: 120, desc: 'Sheer and solid bands that slide past each other to set the light.' },
      { id: 'venetian', name: 'Venetian blinds', rate: 150, desc: 'Horizontal slats you tilt to let in as much light as you want.' },
      { id: 'roman', name: 'Roman blinds', rate: 225, desc: 'Soft fabric that folds up in neat, even pleats.' },
      { id: 'wooden', name: 'Wooden blinds', rate: 280, desc: 'Wide wooden slats with a warm, solid look.' },
      { id: 'monsoon', name: 'Monsoon blinds', rate: 280, desc: 'Made for balconies and verandas that catch the rain.' },
      { id: 'honeycomb', name: 'Honeycomb blinds', rate: 300, desc: 'Pleated cells that hold air, for softer light and a cooler room.' },
      { id: 'panel', name: 'Panel blinds', rate: 420, desc: 'Wide fabric panels that glide along a track.' },
      { id: 'zipper', name: 'External zipper blinds', rate: 780, desc: 'Outdoor blinds, zipped into side channels against wind and weather.' },
      { id: 'insulated', name: 'Insulated glass blinds', rate: 1200, desc: 'Blinds built into the glass unit, so there is nothing to dust.' }
    ],
    curtains: [
      { id: 'sheers', name: 'Sheers', rate: 300, desc: 'Light, see-through fabric that softens the daylight.' },
      { id: 'eyelet', name: 'Eyelet curtains', rate: 250, desc: 'Metal rings slide straight onto the rod, with deep, even folds.' },
      { id: 'pleated', name: 'Pleated curtains', rate: 250, desc: 'Stitched pleats at the top for a tailored finish.' },
      { id: 'recess', name: 'Recess curtains', rate: 250, desc: 'Hung from a ceiling recess, so the fabric runs floor to ceiling.' },
      { id: 'led', name: 'LED curtains', rate: 250, desc: 'Curtains lit from above with a concealed strip of light.' },
      { id: 'motorised', name: 'Motorised curtains', rate: 250, motor: true, desc: 'Open and close by remote. The motor starts from ₹15,000 plus GST.' }
    ],
    settings: { minArea: 10, fullness: 2, fabricWidthIn: 54, hemFt: 1, rangeTopPct: 30, motorFrom: 15000 }
  };

  const FT = { ft: 1, in: 1 / 12, cm: 1 / 30.48, m: 1 / 0.3048 };
  const toFeet = (v, unit) => Number(v) * (FT[unit] || 1);
  const up50 = (n) => Math.ceil(Math.round(n * 100) / 100 / 50) * 50;
  const rupees = (n) => '₹' + Math.round(n).toLocaleString('en-IN');

  /* windows: [{room,w,h,unit,qty}]. Rough on purpose: never below the starting rate. */
  function calc(cat, product, windows, s) {
    const lines = windows.map((win) => {
      const w = toFeet(win.w, win.unit), h = toFeet(win.h, win.unit), qty = Number(win.qty) || 1;
      if (cat === 'blinds') {
        const area = Math.max(w * h, s.minArea);
        return { ...win, wFt: w, hFt: h, qty, measure: Math.round(area * 10) / 10 + ' sq ft', cost: area * product.rate * qty };
      }
      const widths = Math.ceil(Math.round(((w * s.fullness) / (s.fabricWidthIn / 12)) * 1000) / 1000);
      const metres = widths * (h + s.hemFt) * 0.3048;
      return { ...win, wFt: w, hFt: h, qty, measure: Math.round(metres * 10) / 10 + ' m', cost: metres * product.rate * qty };
    });
    const raw = lines.reduce((t, l) => t + l.cost, 0);
    return { lines, raw, low: up50(raw), high: up50(raw * (1 + s.rangeTopPct / 100)) };
  }

  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* preview only */ } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* preview only */ } }
  };

  function rates() {
    const out = JSON.parse(JSON.stringify(DEFAULTS));
    const saved = store.get('ww-rates', null);
    if (!saved) return out;
    out.settings = { ...out.settings, ...saved.settings };
    ['blinds', 'curtains'].forEach((c) => out[c].forEach((p) => { if (saved[p.id] > 0) p.rate = saved[p.id]; }));
    return out;
  }

  const day = (n) => new Date(Date.now() - n * 864e5).toISOString();
  const SAMPLE = [
    ['Sample: Priya', 'RS Puram', 'blinds', 'roller', [['Bedroom', 5, 6, 2], ['Study', 4, 5, 1]], 'New', 0, 'Wants a visit on Saturday.'],
    ['Sample: Arun', 'Saibaba Colony', 'curtains', 'eyelet', [['Living room', 8, 8, 1]], 'New', 0, ''],
    ['Sample: Meena', 'Peelamedu', 'blinds', 'zebra', [['Living room', 7, 6, 2]], 'Contacted', 1, 'Asked for grey shades. Call after 6 pm.'],
    ['Sample: Karthik', 'Race Course', 'curtains', 'sheers', [['Hall', 10, 9, 2], ['Bedroom', 6, 7, 1]], 'Site visit booked', 2, 'Visit fixed for Friday, 11 am.'],
    ['Sample: Deepa', 'Vadavalli', 'blinds', 'wooden', [['Study', 4, 4, 1]], 'Contacted', 3, ''],
    ['Sample: Suresh', 'Saravanampatti', 'blinds', 'zipper', [['Balcony', 12, 8, 1]], 'New', 3, 'Balcony faces west.'],
    ['Sample: Lakshmi', 'RS Puram', 'curtains', 'pleated', [['Bedroom', 6, 7, 3]], 'Closed', 6, 'Order placed.'],
    ['Sample: Vignesh', 'Ganapathy', 'blinds', 'vertical', [['Office', 9, 7, 4]], 'Closed', 8, 'Went with another quote.']
  ];

  function leads() {
    let list = store.get('ww-leads', null);
    if (list) return list;
    const r = rates();
    list = SAMPLE.map((a, i) => {
      const product = r[a[2]].find((p) => p.id === a[3]);
      const windows = a[4].map((x) => ({ room: x[0], w: x[1], h: x[2], unit: 'ft', qty: x[3] }));
      const res = calc(a[2], product, windows, r.settings);
      return { id: 'S' + (i + 1), name: a[0], mobile: '90000 0000' + i, area: a[1], cat: a[2], product: product.name, windows, low: res.low, high: res.high, status: a[5], at: day(a[6]), note: a[7] };
    });
    store.set('ww-leads', list);
    return list;
  }
  const addLead = (lead) => { const l = leads(); l.unshift(lead); store.set('ww-leads', l); };

  /* Demo accounts: one per mobile number, kept in this browser only. The real build keeps them on the server. */
  const digits = (m) => String(m || '').replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '');
  const validMobile = (m) => /^[6-9]\d{9}$/.test(digits(m));
  const showMobile = (m) => { const d = digits(m); return d.length === 10 ? d.slice(0, 5) + ' ' + d.slice(5) : d; };
  const users = () => store.get('ww-users', {});
  const findUser = (mobile) => users()[digits(mobile)] || null;
  function saveUser(u) {
    const all = users(), key = digits(u.mobile);
    all[key] = { ...(all[key] || { at: new Date().toISOString() }), ...u, mobile: key };
    store.set('ww-users', all);
    return all[key];
  }
  function me() { const m = store.get('ww-session', null); return m ? findUser(m) : null; }
  const signIn = (mobile) => store.set('ww-session', digits(mobile));
  const signOut = () => store.del('ww-session');
  const myLeads = (mobile) => { const d = digits(mobile); return leads().filter((l) => digits(l.mobile) === d); };
  /* What the customer sees for each team-view status. */
  const CUSTOMER_STATUS = { New: 'Waiting for our call', Contacted: 'We have called you', 'Site visit booked': 'Visit booked', Closed: 'Closed' };
  /* Only same-site pages may be the "next" page after logging in. */
  const safeNext = (n) => (n && /^[a-z][a-z0-9-]*\.html(\?[^#]*)?$/i.test(n) ? n : 'account.html');

  function findProduct(lead, r) {
    const list = r[lead.cat] || [];
    return list.find((p) => p.id === lead.pid) || list.find((p) => p.name === lead.product) || null;
  }
  /* The estimate as a WhatsApp message. */
  function waText(lead) {
    const r = rates(), product = findProduct(lead, r);
    const lines = product ? calc(lead.cat, product, lead.windows, r.settings).lines : lead.windows;
    return [
      'Window Works rough estimate',
      lead.product,
      ...lines.map((l) => `${l.room || 'Window'}: ${l.w} × ${l.h} ${l.unit}${l.measure ? `, about ${l.measure}` : ''}${l.qty > 1 ? `, ${l.qty} of these` : ''}`),
      `Rough price: ${rupees(lead.low)} to ${rupees(lead.high)} plus GST`,
      ...(product && product.motor ? [`The motor is extra, starting from ${rupees(r.settings.motorFrom)} plus GST`] : []),
      'The final price is confirmed after measuring at home.'
    ].join('\n');
  }

  /* The window drawn to scale, with the chosen blind or curtain on it. */
  function drawWindow(wFt, hFt, cat, opts) {
    const o = Object.assign({ frame: '#ffffff', glass: '#8fa6cf', cloth: '#ffffff', w: 420, h: 340 }, opts);
    const scale = Math.min((o.w - 24) / Math.max(wFt, 12), (o.h - 24) / Math.max(hFt, 10));
    const W = Math.max(wFt * scale, 14), H = Math.max(hFt * scale, 14);
    const x = (o.w - W) / 2, y = (o.h - H) / 2;
    let cloth = '';
    if (cat === 'curtains') {
      const n = Math.max(4, Math.round(W / 11)), fw = W / n;
      for (let i = 0; i < n; i++) if (i < n * 0.32 || i >= n * 0.68) cloth += `<rect x="${(x + i * fw).toFixed(1)}" y="${y}" width="${(fw * 0.72).toFixed(1)}" height="${H}" fill="${o.cloth}"/>`;
    } else {
      const n = Math.max(2, Math.round((H * 0.62) / 9));
      for (let i = 0; i < n; i++) cloth += `<rect x="${x}" y="${(y + i * 9).toFixed(1)}" width="${W}" height="6.5" fill="${o.cloth}"/>`;
    }
    return `<svg viewBox="0 0 ${o.w} ${o.h}" role="img" aria-label="Window ${+wFt.toFixed(1)} feet wide and ${+hFt.toFixed(1)} feet tall, drawn to scale"><rect x="${x}" y="${y}" width="${W}" height="${H}" fill="${o.glass}"/>${cloth}<rect x="${x}" y="${y}" width="${W}" height="${H}" fill="none" stroke="${o.frame}" stroke-width="5"/></svg>`;
  }

  /* Once someone types in a field marked wrong, take the mark and its message away. */
  function clearErrorOnInput(root) {
    const off = (e) => {
      const f = e.target; if (!f.matches || f.getAttribute('aria-invalid') !== 'true') return;
      f.removeAttribute('aria-invalid');
      const msg = f.getAttribute('aria-describedby') && document.getElementById(f.getAttribute('aria-describedby'));
      if (msg && msg.classList.contains('field-err')) msg.hidden = true;
    };
    root.addEventListener('input', off); root.addEventListener('change', off);
  }

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const api = { DEFAULTS, toFeet, calc, rates, rupees, leads, addLead, store, drawWindow, esc,
    digits, validMobile, showMobile, findUser, saveUser, me, signIn, signOut, myLeads, CUSTOMER_STATUS, safeNext, findProduct, waText, clearErrorOnInput };
  if (typeof module !== 'undefined') module.exports = api; else root.WW = api;
})(typeof window !== 'undefined' ? window : globalThis);
