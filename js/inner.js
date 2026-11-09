(function () {
  'use strict';
  var cfg = window.ITHRI || {};
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  document.documentElement.classList.add('js');

  var toastEl = $('#toast'), toastTimer;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2800);
  }
  function waLink(text) { return 'https://wa.me/' + cfg.whatsapp + (text ? '?text=' + encodeURIComponent(text) : ''); }

  /* order buttons (header) */
  $$('[data-order]').forEach(function (el) {
    var p = el.getAttribute('data-order');
    el.href = waLink(p ? 'Hello Ithri Fresh Juice, I would like to order: ' + p + '.' : 'Hello Ithri Fresh Juice, I would like to place an order.');
    el.target = '_blank'; el.rel = 'noopener';
  });

  /* nav */
  var nav = $('#main-nav'), toggle = $('#nav-toggle');
  function closeNav() { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Open menu'); }
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  $$('a', nav).forEach(function (a) { a.addEventListener('click', closeNav); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });

  /* "coming soon" links */
  $$('[data-soon]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); toast(a.getAttribute('data-soon') + ' is coming soon.'); closeNav(); });
  });

  /* footer / contact details from config */
  var wa = $('#foot-wa');
  if (wa) { wa.href = waLink('Hello Ithri Fresh Juice'); wa.textContent = 'WhatsApp · ' + (cfg.phoneDisplay || cfg.whatsapp); }
  if (cfg.email) {
    var li = $('#foot-email-li'), em = $('#foot-email');
    if (em) { em.href = 'mailto:' + cfg.email; em.textContent = cfg.email; li.hidden = false; }
    var te = $('#terms-email'); if (te) { te.href = 'mailto:' + cfg.email; te.textContent = cfg.email; te.hidden = false; }
  }
  var addr = $('#foot-address'); if (addr) addr.textContent = cfg.address || '';
  if (cfg.hours) { var h = $('#foot-hours'); if (h) { h.textContent = cfg.hours; h.hidden = false; } }
  if (cfg.instagram) {
    var fi = $('#foot-ig'); if (fi) { fi.href = 'https://instagram.com/' + cfg.instagram; fi.textContent = '@' + cfg.instagram; fi.hidden = false; }
  }
  var tw = $('#terms-wa'); if (tw) tw.href = waLink('Hello Ithri Fresh Juice, I have a question about your terms.');


  /* generic WhatsApp links and phone text */
  $$('[data-wa]').forEach(function (el) {
    el.href = waLink(el.getAttribute('data-wa')); el.target = '_blank'; el.rel = 'noopener';
  });
  $$('[data-phone]').forEach(function (el) { el.textContent = cfg.phoneDisplay || cfg.whatsapp; });
  var ce = $('#contact-email'); if (ce && cfg.email) { ce.href = 'mailto:' + cfg.email; ce.textContent = cfg.email; ce.hidden = false; }
  var ch = $('#contact-hours'); if (ch && cfg.hours) { ch.textContent = cfg.hours; ch.hidden = false; }

  /* highlight the current section in the contents list */
  var links = $$('.toc a');
  if (links.length && 'IntersectionObserver' in window) {
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (a) { a.classList.remove('on'); });
          var a = map[en.target.id]; if (a) a.classList.add('on');
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    $$('.terms-sec').forEach(function (s) { io.observe(s); });
  }
})();
