(function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const { esc } = WW;
  const next = WW.safeNext(new URLSearchParams(location.search).get('next'));

  if (WW.me()) { location.replace(next); return; }

  const st = { step: 'mobile', mobile: '', errors: {}, about: { name: '', area: '', consent: false } };
  const box = $('#step');
  const err = (k) => (st.errors[k] ? `<p class="field-err" role="alert" id="err-${k}">${st.errors[k]}</p>` : '');
  const bad = (k) => (st.errors[k] ? `aria-invalid="true" aria-describedby="err-${k}"` : '');

  const views = {
    mobile: () => `<h1>Log in</h1><p class="step-sub">Use your mobile number. We'll text you a 4-digit code. There's no password to remember.</p>
      <form class="contact-form" novalidate data-form="mobile">
        <label class="field">Mobile number<input name="mobile" type="tel" inputmode="numeric" maxlength="14" autocomplete="tel" value="${esc(st.mobile)}" ${bad('mobile')}></label>${err('mobile')}
        <div class="step-nav"><button type="submit" class="btn">Text me the code</button></div>
        <p class="demo-otp">Preview: to see an account that already has estimates, use <strong>90000 00003</strong>.</p>
      </form>`,
    code: () => `<h1>Enter the code</h1><p class="step-sub">We sent a 4-digit code to ${esc(WW.showMobile(st.mobile))}.</p>
      <form class="contact-form" novalidate data-form="code">
        <p class="demo-otp">Preview: no text was sent. The code is <strong>1234</strong>.</p>
        <label class="field">Code from the text message<input name="otp" inputmode="numeric" maxlength="4" autocomplete="one-time-code" ${bad('otp')}></label>${err('otp')}
        <div class="step-nav"><button type="submit" class="btn">Log in</button><button type="button" class="linkish" data-change>Change the number</button></div>
      </form>`,
    about: () => `<h1>Welcome to Window Works</h1><p class="step-sub">This is your first time here. Tell us who you are, so our team knows who to call.</p>
      <form class="contact-form" novalidate data-form="about">
        <label class="field">Your name<input name="name" autocomplete="name" value="${esc(st.about.name)}" ${bad('name')}></label>${err('name')}
        <label class="field">Mobile number<input value="${esc(WW.showMobile(st.mobile))}" readonly></label>
        <label class="field">Area or PIN code<input name="area" placeholder="RS Puram" value="${esc(st.about.area)}" ${bad('area')}></label>${err('area')}
        <label class="check"><input type="checkbox" name="consent" ${st.about.consent ? 'checked' : ''} ${bad('consent')}><span>Window Works may call or message me about my estimates.</span></label>${err('consent')}
        <div class="step-nav"><button type="submit" class="btn">Open my account</button></div>
      </form>`
  };

  function render(focus) {
    box.innerHTML = views[st.step]();
    const first = $('[aria-invalid=true]', box) || (focus && $('input:not([readonly])', box));
    if (first) first.focus();
  }
  function go(step) { st.step = step; st.errors = {}; render(true); window.scrollTo({ top: 0 }); }
  function finish() { WW.signIn(st.mobile); location.replace(next); }

  WW.clearErrorOnInput(box);
  box.addEventListener('click', (e) => { if (e.target.closest('[data-change]')) go('mobile'); });
  box.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(e.target), kind = e.target.dataset.form;
    st.errors = {};
    if (kind === 'mobile') {
      st.mobile = (f.get('mobile') || '').toString().trim();
      if (!WW.validMobile(st.mobile)) { st.errors.mobile = 'Please enter a 10-digit Indian mobile number.'; return render(); }
      st.mobile = WW.digits(st.mobile);
      return go('code');
    }
    if (kind === 'code') {
      if ((f.get('otp') || '').toString().trim() !== '1234') { st.errors.otp = 'That code is not right. In this preview it is 1234.'; return render(); }
      if (WW.findUser(st.mobile)) return finish();
      /* A number that already sent an estimate: fill in what we know. */
      const last = WW.myLeads(st.mobile)[0];
      if (last) st.about = { name: last.name, area: last.area, consent: false };
      return go('about');
    }
    if (kind === 'about') {
      const a = st.about;
      a.name = (f.get('name') || '').toString().trim();
      a.area = (f.get('area') || '').toString().trim();
      a.consent = !!f.get('consent');
      if (!a.name) st.errors.name = 'Please tell us your name.';
      if (!a.area) st.errors.area = 'Please add your area or PIN code.';
      if (!a.consent) st.errors.consent = 'Please tick this so our team can contact you.';
      if (Object.keys(st.errors).length) return render();
      WW.saveUser({ mobile: st.mobile, name: a.name, area: a.area, address: '', email: '', consent: true });
      return finish();
    }
  });

  render(false);
})();
