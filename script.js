(() => {
  'use strict';

  /* =====================================================================
     Helpers
     ===================================================================== */
  const doc = document;
  const root = doc.documentElement;
  const body = doc.body;
  const $ = (s, c = doc) => c.querySelector(s);
  const $$ = (s, c = doc) => [...c.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (a, b, v) => {
    const t = clamp((v - a) / (b - a));
    return t * t * (3 - 2 * t);
  };
  const esc = (s = '') =>
    String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* =====================================================================
     Translations  (uz / en / ru)
     "hero.roles" — roles separated with "|" (typing effect)
     ===================================================================== */
  const I18N = {
    uz: {
      'meta.title': 'Mustafo — Web dasturchi',
      'meta.desc': "Mustafo — web dasturchi. Zamonaviy, tez va responsiv veb-saytlar yarataman.",
      'nav.home': 'Bosh sahifa',
      'nav.about': 'Men haqimda',
      'nav.projects': 'Loyihalar',
      'nav.contact': 'Aloqa',
      'nav.menu': 'Menyu',

      'hero.badge': 'Web dasturchi',
      'hero.hello': 'Salom, men',
      'hero.roles': 'Web dasturchi|Frontend developer|Node.js developer',
      'hero.desc': "Zamonaviy, tez va responsiv veb-saytlar yarataman. G'oyangizni chiroyli va ishlaydigan mahsulotga aylantiraman.",
      'hero.cta1': "Loyihalarni ko'rish",
      'hero.cta2': "Bog'lanish",
      'hero.scroll': 'Pastga suring',
      'hero.caption': 'Keling, birgalikda ajoyib narsa yaratamiz',

      'about.eyebrow': 'Men haqimda',
      'about.title': "Kod orqali g'oyalarni jonlantiraman",
      'about.role': 'Web dasturchi',
      'about.p1': "Men Mustafo — web dasturchiman. Har bir loyihada toza kod, qulay interfeys va silliq animatsiyalarga e'tibor beraman.",
      'about.p2': "Sayt faqat chiroyli bo'lmasligi kerak — u har qanday qurilmada tez va qulay ishlashi kerak. Shuning uchun responsiv dizayn va zamonaviy texnologiyalardan foydalanaman.",
      'about.info.name': 'Ism',
      'about.info.job': 'Kasb',
      'about.info.langs': 'Tillar',
      'about.stat1': 'Til',
      'about.stat2': 'Loyiha',
      'about.stat3': 'Responsiv',
      'about.s1.t': 'Frontend ishlab chiqish',
      'about.s1.d': "HTML, SCSS va JavaScript yordamida aniq va toza interfeyslar yarataman.",
      'about.s2.t': 'Responsiv va animatsiya',
      'about.s2.d': "Telefon, planshet va kompyuterda mukammal ko'rinadigan jonli saytlar.",
      'about.s3.t': 'Backend asoslari',
      'about.s3.d': "Node.js va Express bilan server, API va formalar bilan ishlayman.",
      'about.skills': 'Texnologiyalar',

      'projects.eyebrow': 'Loyihalar',
      'projects.title': 'Tanlangan ishlarim',
      'projects.sub': "Yaqinda yaratgan loyihalarimdan namunalar.",
      'projects.live': "Saytni ko'rish",
      'projects.code': 'Kod',
      'projects.next': 'Yangi loyiha tez orada...',

      'contact.eyebrow': 'Aloqa',
      'contact.title': 'Keling, gaplashamiz',
      'contact.text': "Loyiha g'oyangiz bormi? Xabar qoldiring — tez orada javob beraman.",
      'contact.f.name': 'Ismingiz',
      'contact.f.namePh': 'Ismingizni yozing',
      'contact.f.msg': 'Xabaringiz',
      'contact.f.msgPh': 'Loyiha haqida yozing...',
      'contact.f.send': 'Yuborish',
      'contact.f.sending': 'Yuborilmoqda...',
      'contact.f.ok': 'Rahmat! Xabaringiz yuborildi.',
      'contact.f.err': "Server bilan aloqa o'rnatilmadi. Xabarni quyidagi tugmalar orqali yuboring.",
      'contact.f.viaTg': 'Telegram orqali yuborish',
      'contact.f.viaMail': 'Email orqali yuborish',
      'contact.f.invalid': "Iltimos, barcha maydonlarni to'g'ri to'ldiring.",

      'footer.rights': 'Barcha huquqlar himoyalangan.',
      'footer.top': 'Tepaga',
    },

    en: {
      'meta.title': 'Mustafo — Web Developer',
      'meta.desc': 'Mustafo — web developer. I build modern, fast and responsive websites.',
      'nav.home': 'Home',
      'nav.about': 'About me',
      'nav.projects': 'Projects',
      'nav.contact': 'Contact',
      'nav.menu': 'Menu',

      'hero.badge': 'Web developer',
      'hero.hello': "Hi, I'm",
      'hero.roles': 'Web Developer|Frontend Developer|Node.js Developer',
      'hero.desc': 'I build modern, fast and responsive websites. I turn your idea into a beautiful product that actually works.',
      'hero.cta1': 'View projects',
      'hero.cta2': 'Get in touch',
      'hero.scroll': 'Scroll down',
      'hero.caption': "Let's build something great together",

      'about.eyebrow': 'About me',
      'about.title': 'I bring ideas to life with code',
      'about.role': 'Web developer',
      'about.p1': "I'm Mustafo, a web developer. In every project I care about clean code, a comfortable interface and smooth animations.",
      'about.p2': 'A website should not only look good — it must work fast and feel great on any device. That is why I rely on responsive design and modern technologies.',
      'about.info.name': 'Name',
      'about.info.job': 'Profession',
      'about.info.langs': 'Languages',
      'about.stat1': 'Languages',
      'about.stat2': 'Projects',
      'about.stat3': 'Responsive',
      'about.s1.t': 'Frontend development',
      'about.s1.d': 'Pixel-perfect, clean interfaces built with HTML, SCSS and JavaScript.',
      'about.s2.t': 'Responsive & animation',
      'about.s2.d': 'Lively websites that look perfect on phones, tablets and desktops.',
      'about.s3.t': 'Backend basics',
      'about.s3.d': 'Servers, APIs and forms with Node.js and Express.',
      'about.skills': 'Technologies',

      'projects.eyebrow': 'Projects',
      'projects.title': 'Selected work',
      'projects.sub': 'A few samples of the projects I have built recently.',
      'projects.live': 'Live site',
      'projects.code': 'Code',
      'projects.next': 'A new project is coming soon...',

      'contact.eyebrow': 'Contact',
      'contact.title': "Let's talk",
      'contact.text': 'Got a project idea? Leave a message and I will get back to you soon.',
      'contact.f.name': 'Your name',
      'contact.f.namePh': 'Enter your name',
      'contact.f.msg': 'Your message',
      'contact.f.msgPh': 'Tell me about your project...',
      'contact.f.send': 'Send message',
      'contact.f.sending': 'Sending...',
      'contact.f.ok': 'Thank you! Your message has been sent.',
      'contact.f.err': 'Could not reach the server. Please send your message using the buttons below.',
      'contact.f.viaTg': 'Send via Telegram',
      'contact.f.viaMail': 'Send via email',
      'contact.f.invalid': 'Please fill in all fields correctly.',

      'footer.rights': 'All rights reserved.',
      'footer.top': 'Back to top',
    },

    ru: {
      'meta.title': 'Mustafo — Веб-разработчик',
      'meta.desc': 'Mustafo — веб-разработчик. Создаю современные, быстрые и адаптивные сайты.',
      'nav.home': 'Главная',
      'nav.about': 'Обо мне',
      'nav.projects': 'Проекты',
      'nav.contact': 'Контакты',
      'nav.menu': 'Меню',

      'hero.badge': 'Веб-разработчик',
      'hero.hello': 'Привет, я',
      'hero.roles': 'Веб-разработчик|Frontend-разработчик|Node.js-разработчик',
      'hero.desc': 'Создаю современные, быстрые и адаптивные сайты. Превращаю вашу идею в красивый и работающий продукт.',
      'hero.cta1': 'Смотреть проекты',
      'hero.cta2': 'Связаться',
      'hero.scroll': 'Листайте вниз',
      'hero.caption': 'Давайте создадим что-то классное вместе',

      'about.eyebrow': 'Обо мне',
      'about.title': 'Оживляю идеи с помощью кода',
      'about.role': 'Веб-разработчик',
      'about.p1': 'Я Mustafo — веб-разработчик. В каждом проекте я уделяю внимание чистому коду, удобному интерфейсу и плавным анимациям.',
      'about.p2': 'Сайт должен не только красиво выглядеть — он должен быстро и удобно работать на любом устройстве. Поэтому я использую адаптивный дизайн и современные технологии.',
      'about.info.name': 'Имя',
      'about.info.job': 'Профессия',
      'about.info.langs': 'Языки',
      'about.stat1': 'Языка',
      'about.stat2': 'Проектов',
      'about.stat3': 'Адаптивность',
      'about.s1.t': 'Frontend-разработка',
      'about.s1.d': 'Точные и аккуратные интерфейсы на HTML, SCSS и JavaScript.',
      'about.s2.t': 'Адаптивность и анимации',
      'about.s2.d': 'Живые сайты, которые идеально выглядят на телефоне, планшете и компьютере.',
      'about.s3.t': 'Основы backend',
      'about.s3.d': 'Серверы, API и формы на Node.js и Express.',
      'about.skills': 'Технологии',

      'projects.eyebrow': 'Проекты',
      'projects.title': 'Избранные работы',
      'projects.sub': 'Несколько примеров проектов, которые я недавно создал.',
      'projects.live': 'Открыть сайт',
      'projects.code': 'Код',
      'projects.next': 'Новый проект скоро появится...',

      'contact.eyebrow': 'Контакты',
      'contact.title': 'Давайте поговорим',
      'contact.text': 'Есть идея проекта? Оставьте сообщение — я скоро отвечу.',
      'contact.f.name': 'Ваше имя',
      'contact.f.namePh': 'Введите имя',
      'contact.f.msg': 'Ваше сообщение',
      'contact.f.msgPh': 'Расскажите о проекте...',
      'contact.f.send': 'Отправить',
      'contact.f.sending': 'Отправка...',
      'contact.f.ok': 'Спасибо! Ваше сообщение отправлено.',
      'contact.f.err': 'Не удалось связаться с сервером. Отправьте сообщение с помощью кнопок ниже.',
      'contact.f.viaTg': 'Отправить через Telegram',
      'contact.f.viaMail': 'Отправить по email',
      'contact.f.invalid': 'Пожалуйста, заполните все поля правильно.',

      'footer.rights': 'Все права защищены.',
      'footer.top': 'Наверх',
    },
  };

  let lang = 'uz';
  const t = (key) => (I18N[lang] && I18N[lang][key]) || I18N.uz[key] || key;

  const detectLang = () => {
    try {
      const saved = localStorage.getItem('lang');
      if (saved && I18N[saved]) return saved;
    } catch (_) {}
    const nav = (navigator.language || '').slice(0, 2).toLowerCase();
    return I18N[nav] ? nav : 'uz';
  };

  function applyLang(next, initial = false) {
    lang = I18N[next] ? next : 'uz';
    root.lang = lang;
    try {
      localStorage.setItem('lang', lang);
    } catch (_) {}

    $$('[data-i18n]').forEach((el) => (el.textContent = t(el.dataset.i18n)));
    $$('[data-i18n-placeholder]').forEach((el) => (el.placeholder = t(el.dataset.i18nPlaceholder)));
    $$('[data-i18n-aria]').forEach((el) => el.setAttribute('aria-label', t(el.dataset.i18nAria)));

    doc.title = t('meta.title');
    const md = $('meta[name="description"]');
    if (md) md.content = t('meta.desc');

    $$('.lang button').forEach((b) => {
      const on = b.dataset.lang === lang;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on);
    });

    renderProjects(!initial);
    startTyping();
    setStatus('');
  }

  /* =====================================================================
     Typing effect
     ===================================================================== */
  let typingToken = 0;
  function startTyping() {
    const el = $('#typed');
    if (!el) return;
    const roles = t('hero.roles').split('|');
    const token = ++typingToken;
    if (reduceMotion) {
      el.textContent = roles[0];
      return;
    }
    let i = 0;
    let j = 0;
    let deleting = false;
    const tick = () => {
      if (token !== typingToken) return;
      const word = roles[i % roles.length];
      j += deleting ? -1 : 1;
      el.textContent = word.slice(0, j);
      let wait = deleting ? 35 : 85;
      if (!deleting && j === word.length) {
        deleting = true;
        wait = 1700;
      } else if (deleting && j === 0) {
        deleting = false;
        i++;
        wait = 420;
      }
      setTimeout(tick, wait);
    };
    tick();
  }

  /* =====================================================================
     Projects (rendered from projects.js)
     ===================================================================== */
  const iconArrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';
  const iconCode = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/></svg>';

  function cardHTML(p, i) {
    const pick = (obj) => (obj && (obj[lang] || obj.uz || obj.en)) || '';
    const tags = (p.tags || []).map((x) => `<li>${esc(x)}</li>`).join('');
    const links = [
      p.live && `<a href="${esc(p.live)}" target="_blank" rel="noopener">${esc(t('projects.live'))} ${iconArrow}</a>`,
      p.code && `<a href="${esc(p.code)}" target="_blank" rel="noopener">${esc(t('projects.code'))} ${iconCode}</a>`,
    ]
      .filter(Boolean)
      .join('');
    return `
      <article class="card reveal" data-tilt style="--d:${(i % 3) * 0.1}s">
        <div class="card__media${p.fit === 'contain' ? ' is-contain' : ''}">
          <img src="${esc(p.image)}" alt="${esc(pick(p.title))}" loading="lazy">
        </div>
        <div class="card__body">
          <ul class="card__tags">${tags}</ul>
          <h3 class="card__title">${esc(pick(p.title))}</h3>
          <p class="card__text">${esc(pick(p.description))}</p>
          ${links ? `<div class="card__links">${links}</div>` : ''}
        </div>
      </article>`;
  }

  function renderProjects(instant) {
    const grid = $('#projectGrid');
    if (!grid) return;
    const items = Array.isArray(window.PROJECTS) ? window.PROJECTS : [];
    const placeholder = `
      <article class="card card--placeholder reveal" style="--d:${(items.length % 3) * 0.1}s">
        <span class="plus">+</span>
        <p>${esc(t('projects.next'))}</p>
      </article>`;
    grid.innerHTML = items.map(cardHTML).join('') + placeholder;

    const stat = $('#statProjects');
    if (stat) {
      stat.dataset.count = items.length;
      if (stat.dataset.done) stat.textContent = items.length;
    }

    $$('[data-tilt]', grid).forEach(bindTilt);
    $$('.reveal', grid).forEach((el) => (instant ? el.classList.add('is-in') : revealObserver.observe(el)));
  }

  /* =====================================================================
     Reveal on scroll + counters
     ===================================================================== */
  function countUp(el) {
    const to = Number(el.dataset.count) || 0;
    const suffix = el.dataset.suffix || '';
    el.dataset.done = '1';
    if (reduceMotion || to === 0) {
      el.textContent = to + suffix;
      return;
    }
    const dur = 1300;
    const start = performance.now();
    const step = (now) => {
      const k = clamp((now - start) / dur);
      el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))) + suffix;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        if (e.target.dataset.count !== undefined) countUp(e.target);
        revealObserver.unobserve(e.target);
      });
    },
    { threshold: 0.14, rootMargin: '0px 0px -6% 0px' }
  );

  // children of [data-stagger] reveal one after another
  $$('[data-stagger]').forEach((parent) =>
    [...parent.children].forEach((c, i) => {
      c.classList.add('reveal');
      c.style.setProperty('--d', `${i * 0.12}s`);
    })
  );

  /* =====================================================================
     Tilt + magnetic buttons (desktop only)
     ===================================================================== */
  function bindTilt(el) {
    if (!finePointer || reduceMotion || el.dataset.tiltBound) return;
    el.dataset.tiltBound = '1';
    const max = Number(el.dataset.tiltMax) || 6;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      el.style.setProperty('--ry', ((px - 0.5) * max * 2).toFixed(2) + 'deg');
      el.style.setProperty('--rx', ((0.5 - py) * max * 2).toFixed(2) + 'deg');
      el.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
      el.style.setProperty('--my', (py * 100).toFixed(1) + '%');
    });
    el.addEventListener('pointerleave', () => {
      el.style.setProperty('--ry', '0deg');
      el.style.setProperty('--rx', '0deg');
    });
  }

  function bindMagnetic(el) {
    if (!finePointer || reduceMotion) return;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * 0.22;
      const y = (e.clientY - (r.top + r.height / 2)) * 0.32;
      el.style.translate = `${x}px ${y}px`;
    });
    el.addEventListener('pointerleave', () => (el.style.translate = ''));
  }

  $$('[data-tilt]').forEach(bindTilt);
  $$('[data-magnetic]').forEach(bindMagnetic);

  /* =====================================================================
     SCROLL-DRIVEN BACKGROUND
     The three portraits are stacked; as you scroll, they cross-fade
     profile -> three-quarter -> front, while the stage scales down and
     rotates slightly, so the face turns and looks straight at you.
     ===================================================================== */
  const hero = $('#home');
  const heroSticky = $('#heroSticky');
  const heroContent = $('#heroContent');
  const heroCaption = $('#heroCaption');
  const heroScroll = $('#heroScroll');
  const stage = $('#bgStage');
  const layerDown = $('#bgDown');
  const layerFront = $('#bgFront');
  const shade = $('#bgShade');
  const header = $('#header');
  const progress = $('#progress');
  const glow = $('#cursorGlow');

  let vw = innerWidth;
  let vh = innerHeight;
  let range = 1; // scroll distance that drives the face animation
  let docMax = 1;

  const measure = () => {
    vw = innerWidth;
    vh = innerHeight;
    range = Math.max(1, hero.offsetHeight - vh);
    docMax = Math.max(1, doc.documentElement.scrollHeight - vh);
  };

  const target = { p: 0, s: 0, mx: 0, my: 0 };
  const cur = { p: 0, s: 0, mx: 0, my: 0 };
  let raf = 0;

  function readScroll() {
    const y = scrollY;
    target.p = clamp(y / range);
    target.s = smooth(range * 0.8, range + vh * 0.9, y);
    header.classList.toggle('is-scrolled', y > 40);
    progress.style.setProperty('--p', clamp(y / docMax).toFixed(4));
  }

  function render() {
    const p = cur.p;
    const e = p * p * (3 - 2 * p); // ease-in-out

    // cross-fade: profile (bottom) -> 3/4 view -> front view
    const t1 = smooth(0.04, 0.42, p);
    const t2 = smooth(0.52, 0.92, p);
    layerDown.style.opacity = t1.toFixed(3);
    layerFront.style.opacity = t2.toFixed(3);

    // soft blur only while two poses overlap -> no "double face" ghosting
    const blur = Math.max(Math.sin(Math.PI * t1), Math.sin(Math.PI * t2)) * (finePointer ? 5 : 3);
    stage.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : 'none';

    // the "turn": subtle 3D rotation + zoom-out + drift towards the centre
    const portrait = vh > vw;
    const scale = (portrait ? 1.05 : 1.12) - (portrait ? 0.05 : 0.12) * e;
    const rotY = (1 - e) * 6;
    // landscape: profile sits a bit right (away from the text), then slides to the centre
    const tx = (portrait ? 0 : (1 - e) * vw * 0.035) + cur.mx * 16;
    const ty = cur.my * 10;
    stage.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) rotateY(${rotY.toFixed(2)}deg) scale(${scale.toFixed(4)})`;

    // hero text leaves while the face turns
    const f = 1 - smooth(0.04, 0.42, p);
    heroContent.style.opacity = f.toFixed(3);
    heroContent.style.translate = `${(-(1 - f) * 90).toFixed(1)}px ${(-(1 - f) * 30).toFixed(1)}px`;
    heroContent.style.visibility = f < 0.02 ? 'hidden' : 'visible';
    heroSticky.style.setProperty('--fade', f.toFixed(3));
    heroScroll.style.opacity = (1 - smooth(0, 0.1, p)).toFixed(3);

    // caption appears once the face looks straight at the viewer
    const c = smooth(0.82, 0.98, p);
    heroCaption.style.opacity = c.toFixed(3);
    heroCaption.style.translate = `0 ${((1 - c) * 30).toFixed(1)}px`;

    // darker overlay behind the content sections
    shade.style.opacity = (cur.s * 0.8).toFixed(3);
  }

  function frame() {
    raf = 0;
    const k = reduceMotion ? 1 : 0.085;
    cur.p = lerp(cur.p, target.p, k);
    cur.s = lerp(cur.s, target.s, k);
    cur.mx = lerp(cur.mx, target.mx, 0.06);
    cur.my = lerp(cur.my, target.my, 0.06);
    render();
    const moving =
      Math.abs(cur.p - target.p) > 0.0004 ||
      Math.abs(cur.s - target.s) > 0.0004 ||
      Math.abs(cur.mx - target.mx) > 0.001 ||
      Math.abs(cur.my - target.my) > 0.001;
    if (moving) raf = requestAnimationFrame(frame);
  }
  const kick = () => {
    if (!raf) raf = requestAnimationFrame(frame);
  };

  addEventListener(
    'scroll',
    () => {
      readScroll();
      kick();
    },
    { passive: true }
  );
  addEventListener('resize', () => {
    measure();
    readScroll();
    kick();
  });

  // gentle mouse parallax + cursor glow (desktop)
  if (finePointer && !reduceMotion) {
    addEventListener(
      'pointermove',
      (e) => {
        target.mx = (e.clientX / vw - 0.5) * -1;
        target.my = (e.clientY / vh - 0.5) * -1;
        glow.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        glow.classList.add('is-on');
        kick();
      },
      { passive: true }
    );
    doc.addEventListener('pointerleave', () => glow.classList.remove('is-on'));
  }

  measure();
  readScroll();
  // start exactly where the page is (e.g. after reload mid-page)
  cur.p = target.p;
  cur.s = target.s;
  render();

  /* =====================================================================
     Navigation: active link, mobile menu
     ===================================================================== */
  const links = $$('[data-link]');
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => a.classList.toggle('is-active', a.dataset.link === e.target.id));
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  ['home', 'about', 'projects', 'contact'].forEach((id) => {
    const s = doc.getElementById(id);
    if (s) sectionObserver.observe(s);
  });

  const nav = $('#nav');
  const burger = $('#burger');
  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open);
    body.classList.toggle('is-locked', open);
  };
  burger.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  links.forEach((a) => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', (e) => e.key === 'Escape' && setMenu(false));
  addEventListener('resize', () => innerWidth > 768 && setMenu(false));

  $$('.lang button').forEach((b) => b.addEventListener('click', () => applyLang(b.dataset.lang)));
  $('#toTop').addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
  $('#year').textContent = new Date().getFullYear();

  /* =====================================================================
     Contact form  ->  POST /api/contact  (see server.js)
     ===================================================================== */
  const form = $('#contactForm');
  const statusEl = $('#formStatus');
  const sendBtn = $('#sendBtn');
  const fallback = $('#formFallback');

  function setStatus(key, kind) {
    statusEl.textContent = key ? t(key) : '';
    statusEl.className = 'form__status' + (kind ? ' is-' + kind : '');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const valid =
      data.name.trim().length >= 2 && /^\S+@\S+\.\S+$/.test(data.email.trim()) && data.message.trim().length >= 5;
    if (!valid) return setStatus('contact.f.invalid', 'err');

    sendBtn.disabled = true;
    setStatus('contact.f.sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      form.reset();
      fallback.hidden = true;
      setStatus('contact.f.ok', 'ok');
    } catch (_) {
      // no server / API error -> let the visitor send the same text via Telegram or email
      const text = `${data.name} (${data.email}):\n${data.message}`;
      $('#fbTelegram').href = 'https://t.me/Notshaxa11?text=' + encodeURIComponent(text);
      $('#fbMail').href =
        'mailto:mustaforasulov52@gmail.com?subject=' + encodeURIComponent('Portfolio: ' + data.name) + '&body=' + encodeURIComponent(text);
      fallback.hidden = false;
      setStatus('contact.f.err', 'err');
    } finally {
      sendBtn.disabled = false;
    }
  });

  /* =====================================================================
     Marquee (duplicate the group for a seamless loop)
     ===================================================================== */
  const track = $('#marqueeTrack');
  if (track && track.children.length === 1) {
    const clone = track.firstElementChild.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  }

  /* =====================================================================
     Init + intro (wait for the portraits, then lift the preloader)
     ===================================================================== */
  // observe everything that reveals / counts (project cards are added in renderProjects)
  const observeStatic = () => $$('.reveal:not(#projectGrid .reveal), [data-count]').forEach((el) => revealObserver.observe(el));

  applyLang(detectLang(), true);
  observeStatic();

  const preloader = $('#preloader');
  const decode = (img) => (img.decode ? img.decode().catch(() => {}) : Promise.resolve());
  const imagesReady = Promise.all($$('.bg__layer').map(decode));
  const timeout = new Promise((r) => setTimeout(r, 5000));
  const minWait = new Promise((r) => setTimeout(r, 900));

  Promise.all([Promise.race([imagesReady, timeout]), minWait]).then(() => {
    body.classList.add('is-loaded');
    body.classList.remove('is-locked');
    setTimeout(() => preloader && preloader.remove(), 1400);
  });
})();
/* =====================================================================
     Contact form  ->  POST /api/contact  (see server.js)
     ===================================================================== */
  const form = $('#contactForm');
  const statusEl = $('#formStatus');
  const sendBtn = $('#sendBtn');
  const fallback = $('#formFallback');

  function setStatus(key, kind) {
    statusEl.textContent = key ? t(key) : '';
    statusEl.className = 'form__status' + (kind ? ' is-' + kind : '');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const raw = Object.fromEntries(new FormData(form));
    const payload = {
      name: String(raw.name || '').trim(),
      email: String(raw.email || '').trim(),
      message: String(raw.message || '').trim(),
      website: String(raw.website || '').trim(),
    };

    const valid =
      payload.name.length >= 2 &&
      /^\S+@\S+\.\S+$/.test(payload.email) &&
      payload.message.length >= 5;

    if (!valid) {
      fallback.hidden = true;
      return setStatus('contact.f.invalid', 'err');
    }

    sendBtn.disabled = true;
    setStatus('contact.f.sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.ok) {
        const err = new Error(body.error || 'HTTP ' + res.status);
        err.status = res.status;
        throw err;
      }
      form.reset();
      fallback.hidden = true;
      setStatus('contact.f.ok', 'ok');
    } catch (_) {
      const text = `${payload.name} (${payload.email}):\n${payload.message}`;
      $('#fbTelegram').href = 'https://t.me/Notshaxa11?text=' + encodeURIComponent(text);
      $('#fbMail').href =
        'mailto:mustaforasulov52@gmail.com?subject=' +
        encodeURIComponent('Portfolio: ' + payload.name) +
        '&body=' +
        encodeURIComponent(text);
      fallback.hidden = false;
      setStatus('contact.f.err', 'err');
    } finally {
      sendBtn.disabled = false;
    }
  });