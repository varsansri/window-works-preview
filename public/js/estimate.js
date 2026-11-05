/* Design preview only: these screens click through in order. Nothing is checked, calculated, saved or sent. */
(function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const main = $('#step');
  let step = 0;

  const STYLES = [
    ['vertical', 'Vertical blinds', '₹55 per sq ft'], ['roller', 'Roller blinds', '₹80 per sq ft'], ['zebra', 'Zebra blinds', '₹120 per sq ft'],
    ['venetian', 'Venetian blinds', '₹150 per sq ft'], ['roman', 'Roman blinds', '₹225 per sq ft'], ['wooden', 'Wooden blinds', '₹280 per sq ft'],
    ['monsoon', 'Monsoon blinds', '₹280 per sq ft'], ['honeycomb', 'Honeycomb blinds', '₹300 per sq ft'], ['panel', 'Panel blinds', '₹420 per sq ft'],
    ['zipper', 'External zipper blinds', '₹780 per sq ft'], ['insulated', 'Insulated glass blinds', '₹1,200 per sq ft'],
    ['sheers', 'Sheers', '₹300 per metre'], ['eyelet', 'Eyelet curtains', '₹250 per metre'], ['pleated', 'Pleated curtains', '₹250 per metre'],
    ['recess', 'Recess curtains', '₹250 per metre'], ['led', 'LED curtains', '₹250 per metre'], ['motorised', 'Motorised curtains', '₹250 per metre'],
  ];

  let slats = '';
  for (let i = 0; i < 14; i++) slats += `<rect x="150" y="${60 + i * 9}" width="120" height="6.5" fill="#fff"/>`;
  const DRAWING = `<svg viewBox="0 0 420 340" role="img" aria-label="A sample window with a blind"><rect x="150" y="60" width="120" height="200" fill="#5b76ad"/>${slats}<rect x="150" y="60" width="120" height="200" fill="none" stroke="#fff" stroke-width="5"/></svg>`;

  const field = (label, value, attrs) => `<label class="field">${label}<input value="${value || ''}" ${attrs || ''}></label>`;

  const VIEWS = [
    () => `<h1>What's going on your window?</h1><p class="step-sub">Choose one for now. You can start another estimate for the other rooms.</p>
      <div class="big-pick">
        <button type="button" data-next><img src="img/dining.webp" width="502" height="336" alt="Roman blinds in a dining room"><span><strong>Blinds</strong>From ₹55 per sq ft</span></button>
        <button type="button" data-next><img src="img/room-1.webp" width="600" height="600" alt="Teal and yellow eyelet curtains on a tall window"><span><strong>Curtains</strong>From ₹250 per metre</span></button>
      </div>`,
    () => `<h1>Which style do you like?</h1><p class="step-sub">The price under each one is its starting rate, before GST.</p>
      <div class="style-grid">${STYLES.map((s) => `<button type="button" data-next><img src="img/${s[0]}.webp" width="600" height="600" loading="lazy" alt=""><strong>${s[1]}</strong><small>from ${s[2]}</small></button>`).join('')}</div>
      <div class="step-nav"><button type="button" class="linkish" data-back>Back</button></div>`,
    () => `<h1>How big are your windows?</h1><p class="step-sub">A rough measurement is fine.</p>
      <div class="win-layout"><div class="win-rows">
        <div class="win-row is-active">
          <label class="field field-room">Room<input value="Bedroom"></label>${field('Width', '4')}${field('Height', '5')}
          <label class="field">Unit<select><option>feet</option><option>inches</option><option>cm</option><option>metres</option></select></label>${field('How many', '1')}<span></span>
        </div>
        <button type="button" class="add-win">Add another window</button>
        <div class="tip"><h2>How to measure</h2><p>Run a tape across the window from one side of the frame to the other, then from top to bottom. We'll measure again at your home before the final price.</p></div>
      </div><aside class="win-side" aria-label="Your window to scale">${DRAWING}<p>Bedroom: 4 ft wide, 5 ft tall</p></aside></div>
      <div class="step-nav"><button type="button" class="btn" data-next>See my rough price</button><button type="button" class="linkish" data-back>Back</button></div>`,
    () => `<h1>Your price is ready</h1><p class="step-sub">Tell us who it's for. We'll text a code to confirm your mobile number.</p>
      <div class="reveal-layout"><div class="contact-form">
        ${field('Your name', '', 'autocomplete="off"')}${field('Mobile number', '', 'type="tel" inputmode="numeric" autocomplete="off"')}${field('Area or PIN code', '', 'placeholder="RS Puram" autocomplete="off"')}
        ${field("Email, if you'd like a copy (optional)", '', 'type="email" autocomplete="off"')}${field('Best day for a visit (optional)', '', 'type="date"')}
        <label class="check"><input type="checkbox"><span>Window Works may call or message me about this estimate.</span></label>
        ${field('Code from the text message', '', 'inputmode="numeric" autocomplete="off"')}
        <div class="step-nav"><button type="button" class="btn" data-next>Show my price</button><button type="button" class="linkish" data-back>Back</button></div>
      </div><div class="blur-card"><p>Your windows</p><p class="locked">1 window measured</p><ul><li>Bedroom: 4 × 5 ft</li></ul></div></div>`,
    () => `<div class="result-price"><p>Your rough price</p><strong>₹1,600 to ₹2,100</strong><p class="gst">Plus GST. This is a guide based on starting rates. The final price depends on your fabric and fittings, and we confirm it after measuring at your home.</p></div>
      <table class="result-table"><thead><tr><th>Window</th><th class="hide-phone">Size</th><th>Billed</th><th class="n">How many</th></tr></thead><tbody><tr><td>Bedroom</td><td class="hide-phone">4 × 5 ft</td><td>about 20 sq ft</td><td class="n">1</td></tr></tbody></table>
      <p class="next-line">Thanks. Our team will call you to book a visit.</p>
      <div class="step-nav"><button type="button" class="btn">Save as PDF</button><button type="button" class="linkish">Send to WhatsApp</button><button type="button" class="linkish" data-restart>Start another estimate</button><a class="linkish" href="admin.html">See the team view</a></div>`,
  ];

  function render() {
    const bar = Math.min(step, 3);
    document.querySelectorAll('#progress li').forEach((li, i) => {
      li.className = i < bar ? 'done' : i === bar ? 'now' : '';
      if (i === bar) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });
    main.innerHTML = VIEWS[step]();
    main.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }

  main.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    if ('next' in b.dataset) step = Math.min(step + 1, VIEWS.length - 1);
    else if ('back' in b.dataset) step = Math.max(step - 1, 0);
    else if ('restart' in b.dataset) step = 0;
    else return;
    render();
  });
  render();
})();
