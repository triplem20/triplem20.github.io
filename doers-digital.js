  // ── SCROLL PROGRESS ──
const prog = document.getElementById('progress');
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  prog.style.width = pct + '%';
});

// ── CUSTOM CURSOR ──
const cur = document.getElementById('cur');
const curR = document.getElementById('curR');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cur.style.left = mx+'px'; cur.style.top = my+'px'; });
(function animCur() {
  rx += (mx - rx) * .14;
  ry += (my - ry) * .14;
  curR.style.left = rx+'px';
  curR.style.top = ry+'px';
  requestAnimationFrame(animCur);
})();
document.querySelectorAll('a,button,.svc,.pkg,.mkt,.feat,.proc-step').forEach(el => {
  el.addEventListener('mouseenter', () => { cur.style.width='12px'; cur.style.height='12px'; curR.style.width='48px'; curR.style.height='48px'; curR.style.borderColor='rgba(198,255,0,.8)'; });
  el.addEventListener('mouseleave', () => { cur.style.width='7px'; cur.style.height='7px'; curR.style.width='30px'; curR.style.height='30px'; curR.style.borderColor='rgba(198,255,0,.5)'; });
});

// ── NAV SCROLL ──
window.addEventListener('scroll', () => document.getElementById('nav').classList.toggle('stuck', scrollY > 60));

// ── REVEAL ──
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('vis'); });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ── COUNTER ──
function countUp(el, target, dur = 1600) {
  let v = 0;
  const step = target / (dur / 16);
  const t = setInterval(() => {
    v += step;
    if (v >= target) { el.textContent = target; clearInterval(t); return; }
    el.textContent = Math.floor(v);
  }, 16);
}
const statsIO = new IntersectionObserver(entries => {
  if(entries[0].isIntersecting) {
    document.querySelectorAll('[data-count]').forEach(el => countUp(el, +el.dataset.count));
    statsIO.disconnect();
  }
}, { threshold: .5 });
const hs = document.querySelector('.h-stats');
if(hs) statsIO.observe(hs);

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if(t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// ── PROCESS STEP LIGHTING ──
const procIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting) {
      const steps = document.querySelectorAll('.proc-step');
      steps.forEach((s, i) => setTimeout(() => s.classList.add('lit'), i * 200));
      procIO.disconnect();
    }
  });
}, { threshold: .3 });
const proc = document.querySelector('.proc-g');
if(proc) procIO.observe(proc);

// ── TILT EFFECT ON PHONES ──
document.querySelector('.hero-r')?.addEventListener('mousemove', e => {
  const rect = e.currentTarget.getBoundingClientRect();
  const cx = (e.clientX - rect.left) / rect.width - .5;
  const cy = (e.clientY - rect.top) / rect.height - .5;
  const ph1 = document.querySelector('.ph1');
  if(ph1) ph1.style.transform = `translate(-50%,-50%) rotateY(${cx*12}deg) rotateX(${-cy*8}deg)`;
});
document.querySelector('.hero-r')?.addEventListener('mouseleave', () => {
  const ph1 = document.querySelector('.ph1');
  if(ph1) ph1.style.transform = '';
  setTimeout(() => { if(ph1) ph1.style.transform = ''; }, 100);
});

// ── BILINGUAL ENGINE ──
let currentLang = 'en';

function toggleLang() {
  currentLang = currentLang === 'en' ? 'ar' : 'en';
  applyLang(currentLang);
}

function applyLang(lang) {
  const isAr = lang === 'ar';

  // Set HTML dir and lang
  document.documentElement.lang = lang;
  document.documentElement.dir = isAr ? 'rtl' : 'ltr';

  // Font swap
  document.body.style.fontFamily = isAr
    ? "'Cairo', 'Tajawal', sans-serif"
    : "var(--font-b)";

  // Toggle button highlight
  const toggle = document.getElementById('langToggle');
  toggle.classList.toggle('ar-active', isAr);

  // Translate all elements with data-en / data-ar
  document.querySelectorAll('[data-en][data-ar]').forEach(el => {
    const text = isAr ? el.dataset.ar : el.dataset.en;
    if (text !== undefined) {
      el.innerHTML = text;
    }
  });

  // Hero title special treatment
  const heroTitle = document.querySelector('.h-title');
  if (heroTitle) {
    if (isAr) {
      heroTitle.innerHTML = `
        <span class="hl"><span class="hl-i">نحن <span class="acc">نبني.</span></span></span>
        <span class="hl"><span class="hl-i">نحن نُنجز.</span></span>
      `;
    } else {
      heroTitle.innerHTML = `
        <span class="hl"><span class="hl-i">WE <span class="acc">BUILD.</span></span></span>
        <span class="hl"><span class="hl-i">WE DELIVER.</span></span>
      `;
    }
  }

  // Marquee items with diamond separator
  document.querySelectorAll('.mitem').forEach(el => {
    const text = isAr ? el.dataset.ar : el.dataset.en;
    if (text) {
      el.innerHTML = text.replace('◆', '<em>◆</em>');
    }
  });

  // Page title
  document.title = isAr
    ? 'DOERS Digital — نبني. نُنجز.'
    : 'DOERS Digital — We Build. We Deliver.';

  // RTL-specific layout adjustments
  document.querySelectorAll('.h-eye').forEach(el => {
    el.style.flexDirection = isAr ? 'row-reverse' : 'row';
  });
  document.querySelectorAll('.stag').forEach(el => {
    el.style.flexDirection = isAr ? 'row-reverse' : 'row';
  });
  document.querySelectorAll('.j-tag').forEach(el => {
    el.style.flexDirection = isAr ? 'row-reverse' : 'row';
  });

  // Store preference
  localStorage.setItem('doers-lang', lang);
}

// Load saved preference
(function init() {
  const saved = localStorage.getItem('doers-lang');
  if (saved && saved !== 'en') {
    currentLang = saved;
    applyLang(saved);
  }
})();
