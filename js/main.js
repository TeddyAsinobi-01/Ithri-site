(function () {
  'use strict';
  var cfg = window.ITHRI || {};
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  document.documentElement.classList.add('js');

  /* ---------- helpers ---------- */
  var toastEl = $('#toast'), toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2800);
  }
  function waLink(text) {
    return 'https://wa.me/' + cfg.whatsapp + (text ? '?text=' + encodeURIComponent(text) : '');
  }

  /* ---------- WhatsApp order buttons ---------- */
  function wireOrder(el) {
    var product = el.getAttribute('data-order');
    var custom = el.getAttribute('data-msg');
    var msg = custom || (product
      ? 'Hello Ithri Fresh Juice, I would like to order: ' + product + '.'
      : 'Hello Ithri Fresh Juice, I would like to place an order.');
    el.href = waLink(msg);
    el.target = '_blank';
    el.rel = 'noopener';
  }
  $$('[data-order]').forEach(wireOrder);

  /* ---------- "coming soon" links (pages built after client feedback) ---------- */
  $$('[data-soon]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      toast(a.getAttribute('data-soon') + ' is coming soon.');
      closeNav();
    });
  });

  /* ---------- mobile nav ---------- */
  var nav = $('#main-nav'), toggle = $('#nav-toggle');
  function closeNav() {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  }
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  $$('a', nav).forEach(function (a) { a.addEventListener('click', closeNav); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });

  /* ---------- hero slider ---------- */
  var slides = $$('.slide'), n = slides.length, cur = 0, timer = null;
  var dotsBox = $('#dots'), capName = $('#cap-name'), capDesc = $('#cap-desc'), capOrder = $('#cap-order');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var dots = slides.map(function (s, i) {
    var b = document.createElement('button');
    b.className = 'dot'; b.type = 'button'; b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', s.getAttribute('data-name'));
    b.addEventListener('click', function () { go(i, true); });
    dotsBox.appendChild(b);
    return b;
  });

  function render() {
    slides.forEach(function (s, i) {
      var d = (i - cur + n) % n;
      s.classList.toggle('is-active', d === 0);
      s.classList.toggle('is-next', d === 1);
      s.classList.toggle('is-prev', d === n - 1);
      s.setAttribute('aria-hidden', d === 0 ? 'false' : 'true');
    });
    dots.forEach(function (b, i) { b.setAttribute('aria-selected', i === cur ? 'true' : 'false'); });
    var a = slides[cur];
    capName.textContent = a.getAttribute('data-name');
    capDesc.textContent = a.getAttribute('data-desc');
    capOrder.setAttribute('data-order', a.getAttribute('data-name'));
    wireOrder(capOrder);
  }
  function go(i, user) {
    cur = (i + n) % n; render();
    if (user) restart();
  }
  function start() { if (!reduce && !timer) timer = setInterval(function () { go(cur + 1); }, 4500); }
  function stop() { clearInterval(timer); timer = null; }
  function restart() { stop(); start(); }

  $('#next').addEventListener('click', function () { go(cur + 1, true); });
  $('#prev').addEventListener('click', function () { go(cur - 1, true); });
  slides.forEach(function (s, i) { s.addEventListener('click', function () { if (i !== cur) go(i, true); }); });

  var stage = $('.hero-stage');
  stage.addEventListener('mouseenter', stop);
  stage.addEventListener('mouseleave', start);
  stage.addEventListener('focusin', stop);
  stage.addEventListener('focusout', start);
  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
  stage.setAttribute('tabindex', '0');
  stage.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') go(cur + 1, true);
    if (e.key === 'ArrowLeft') go(cur - 1, true);
  });
  // swipe
  var sx = null;
  stage.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; stop(); }, { passive: true });
  stage.addEventListener('touchend', function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1), true); else start();
    sx = null;
  });
  render(); start();

  /* ---------- reveal on scroll ---------- */
  var rev = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    rev.forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(el); });
  } else { rev.forEach(function (el) { el.classList.add('in'); }); }

  /* ---------- config-driven bits ---------- */
  var wa = $('#foot-wa');
  wa.href = waLink('Hello Ithri Fresh Juice');
  wa.textContent = 'WhatsApp · ' + (cfg.phoneDisplay || cfg.whatsapp);

  if (cfg.email) {
    var li = $('#foot-email-li'), em = $('#foot-email');
    em.href = 'mailto:' + cfg.email; em.textContent = cfg.email; li.hidden = false;
  }
  $('#foot-address').textContent = cfg.address || '';
  if (cfg.hours) { var h = $('#foot-hours'); h.textContent = cfg.hours; h.hidden = false; }

  if (cfg.instagram) {
    var url = 'https://instagram.com/' + cfg.instagram;
    $('#instagram').hidden = false;
    var il = $('#insta-link'); il.href = url; il.textContent = '@' + cfg.instagram;
    $$('.insta-tile').forEach(function (a) { a.href = url; a.target = '_blank'; a.rel = 'noopener'; });
    var fi = $('#foot-ig'); fi.href = url; fi.textContent = '@' + cfg.instagram; fi.hidden = false;
  }

  if (cfg.formEmail) {
    $('#newsletter').hidden = false;
    var form = $('#news-form'), msg = $('#news-msg');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = $('#news-email').value.trim();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { msg.textContent = 'Please enter a valid email address.'; return; }
      msg.textContent = 'Subscribing…';
      fetch('https://formsubmit.co/ajax/' + encodeURIComponent(cfg.formEmail), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email: email, _subject: 'New Ithri Fresh Juice subscriber' })
      }).then(function (r) { if (!r.ok) throw new Error(); return r.json(); })
        .then(function () { msg.textContent = 'Thank you! You are on the list.'; form.reset(); })
        .catch(function () { msg.textContent = 'Something went wrong. Please try again.'; });
    });
  }
})();
