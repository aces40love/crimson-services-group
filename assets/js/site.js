/* ==========================================================================
   Crimson Services Group — site behaviour
   No dependencies. Progressive enhancement only: everything degrades to
   plain, readable HTML if JS is unavailable.
   ========================================================================== */
(function () {
  'use strict';

  var doc = document;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- header: sticky shadow + mobile drawer ---------- */
  function initHeader() {
    var header = doc.querySelector('.site-header');
    var toggle = doc.querySelector('.nav-toggle');
    var links = doc.getElementById('navLinks');
    if (!header) return;

    var lastH = -1;
    var setH = function () {
      var h = Math.round(header.getBoundingClientRect().bottom);
      if (h !== lastH) {
        lastH = h;
        doc.documentElement.style.setProperty('--hdr-h', h + 'px');
      }
    };
    setH();
    window.addEventListener('resize', setH);

    var onScroll = function () {
      setH();
      header.classList.toggle('is-stuck', window.scrollY > 8);
      var top = doc.querySelector('.to-top');
      if (top) top.classList.toggle('is-visible', window.scrollY > 700);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    if (toggle && links) {
      toggle.addEventListener('click', function () {
        var open = links.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(open));
        doc.body.style.overflow = open ? 'hidden' : '';
      });
      links.addEventListener('click', function (e) {
        if (e.target.closest('a')) {
          links.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
          doc.body.style.overflow = '';
        }
      });
      doc.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && links.classList.contains('is-open')) toggle.click();
      });
    }
  }

  /* ---------- mark the current page in the nav ---------- */
  function initActiveNav() {
    var here = location.pathname.split('/').pop() || 'index.html';
    doc.querySelectorAll('.nav-links a[href]').forEach(function (a) {
      var target = a.getAttribute('href').split('#')[0];
      if (target && target === here) {
        a.classList.add('is-active');
        a.setAttribute('aria-current', 'page');
      }
    });
  }

  /* ---------- scroll reveal ---------- */
  function initReveal() {
    var items = doc.querySelectorAll('[data-reveal]');
    if (!items.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- animated stat counters ---------- */
  function initCounters() {
    var nums = doc.querySelectorAll('[data-count]');
    if (!nums.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) return;

    var run = function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var prefix = el.getAttribute('data-prefix') || '';
      var suffix = el.getAttribute('data-suffix') || '';
      var dur = 1400;
      var start = null;
      var step = function (ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + Math.round(target * eased).toLocaleString('en-US') + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { run(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    nums.forEach(function (el) { io.observe(el); });
  }

  /* ---------- accordions ---------- */
  function initAccordions() {
    var accN = 0;
    doc.querySelectorAll('.acc-q').forEach(function (btn) {
      var acc = btn.closest('.acc');
      if (!acc) return;
      var panel = acc.querySelector('.acc-a');
      if (!panel) return;
      accN++;
      if (!btn.id) btn.id = 'acc-q-' + accN;
      if (!panel.id) panel.id = 'acc-a-' + accN;
      btn.setAttribute('aria-controls', panel.id);
      // role=region only for small groups — 21 panels on resources.html would
      // otherwise create 21 landmarks (WAI-ARIA APG warns against this).
      var group = acc.closest('[data-acc-group]') || doc;
      if (group.querySelectorAll('.acc-q').length <= 6) {
        panel.setAttribute('role', 'region');
        panel.setAttribute('aria-labelledby', btn.id);
      }
      btn.addEventListener('click', function () {
        var open = acc.classList.contains('is-open');
        // close siblings within the same group
        var group = acc.closest('[data-acc-group]');
        if (group && !open) {
          group.querySelectorAll('.acc.is-open').forEach(function (other) {
            other.classList.remove('is-open');
            other.querySelector('.acc-q').setAttribute('aria-expanded', 'false');
            other.querySelector('.acc-a').style.maxHeight = null;
          });
        }
        acc.classList.toggle('is-open', !open);
        btn.setAttribute('aria-expanded', String(!open));
        panel.style.maxHeight = !open ? panel.scrollHeight + 'px' : null;
      });
    });
    // keep open panels correctly sized on resize
    window.addEventListener('resize', function () {
      doc.querySelectorAll('.acc.is-open .acc-a').forEach(function (p) {
        p.style.maxHeight = p.scrollHeight + 'px';
      });
    });
  }

  /* ---------- money helpers ---------- */
  var usd = function (n) {
    var v = Math.round(n);
    if (!isFinite(v)) v = 0;
    return (v < 0 ? '-$' : '$') + Math.abs(v).toLocaleString('en-US');
  };
  var val = function (id) {
    var el = doc.getElementById(id);
    if (!el) return 0;
    var n = parseFloat(String(el.value).replace(/[^0-9.\-]/g, ''));
    return isNaN(n) ? 0 : n;
  };

  /* ---------- seller net sheet ---------- */
  function initNetSheet() {
    var form = doc.getElementById('netSheet');
    if (!form) return;

    var calc = function () {
      var price = val('nsPrice');
      var payoff = val('nsPayoff');
      var commPct = val('nsComm');
      var taxes = val('nsTaxes');
      var repairs = val('nsRepairs');
      var concessions = val('nsConcessions');

      var commission = price * (commPct / 100);
      // Tennessee transfer tax: $0.37 per $100 of consideration.
      var transferTax = (price / 100) * 0.37;
      // Typical TN owner's policy estimate + settlement/closing fee + recording.
      var titlePolicy = price > 0 ? 350 + (price / 1000) * 2.6 : 0;
      var settlement = price > 0 ? 495 : 0;
      var recording = price > 0 ? 60 : 0;

      var costs = commission + transferTax + titlePolicy + settlement + recording +
                  taxes + repairs + concessions;
      var net = price - payoff - costs;

      var set = function (id, v) {
        var el = doc.getElementById(id);
        if (el) el.textContent = usd(v);
      };
      set('nsOutCommission', commission);
      set('nsOutTransfer', transferTax);
      set('nsOutTitle', titlePolicy);
      set('nsOutSettlement', settlement + recording);
      set('nsOutOther', taxes + repairs + concessions);
      set('nsOutPayoff', payoff);
      set('nsOutCosts', costs);
      set('nsOutNet', net);

      var netEl = doc.getElementById('nsOutNet');
      if (netEl) netEl.style.color = net < 0 ? '#FF9AA2' : '#fff';
    };

    form.addEventListener('input', calc);
    form.addEventListener('change', calc);
    form.addEventListener('submit', function (e) { e.preventDefault(); calc(); });
    calc();
  }

  /* ---------- title fee estimator ---------- */
  function initTitleFee() {
    var form = doc.getElementById('titleFee');
    if (!form) return;

    var calc = function () {
      var price = val('tfPrice');
      var loan = val('tfLoan');
      var type = (doc.getElementById('tfType') || {}).value || 'purchase';

      // Estimator model — replace with your underwriter's filed rate table.
      var ownersPolicy = price > 0 ? 350 + (price / 1000) * 2.6 : 0;
      var lendersPolicy = loan > 0 ? 150 + (loan / 1000) * 0.9 : 0;
      if (type === 'refinance') ownersPolicy = 0;
      var settlement = 495;
      var search = 175;
      var recording = 60;
      var courier = 45;
      var transferTax = type === 'purchase' ? (price / 100) * 0.37 : 0;
      var mortgageTax = loan > 0 ? Math.max(0, (loan - 2000) / 100) * 0.115 : 0;

      var total = ownersPolicy + lendersPolicy + settlement + search + recording +
                  courier + transferTax + mortgageTax;

      var set = function (id, v) {
        var el = doc.getElementById(id);
        if (el) el.textContent = usd(v);
      };
      set('tfOwners', ownersPolicy);
      set('tfLenders', lendersPolicy);
      set('tfSettlement', settlement + search + courier);
      set('tfRecording', recording);
      set('tfTransfer', transferTax);
      set('tfMortgage', mortgageTax);
      set('tfTotal', total);
    };

    form.addEventListener('input', calc);
    form.addEventListener('change', calc);
    form.addEventListener('submit', function (e) { e.preventDefault(); calc(); });
    calc();
  }

  /* ---------- RegReady plan estimator ---------- */
  function initPlanPicker() {
    var form = doc.getElementById('planPicker');
    if (!form) return;

    var RACK = { l1: 225, l2: 400, l3: 900, l4: 1200 };
    var PLANS = [
      { name: 'Compliance Basic', price: 2600, l1: 10, l2: 2, l3: 0, l4: 0 },
      { name: 'Exam Prep', price: 7800, l1: 22, l2: 6, l3: 2, l4: 0 },
      { name: 'Audit Plus', price: 13000, l1: 35, l2: 8, l3: 4, l4: 1 },
      { name: 'Enterprise Regulatory Partner', price: 21800, l1: 60, l2: 15, l3: 6, l4: 2 }
    ];

    var calc = function () {
      var need = { l1: val('ppL1'), l2: val('ppL2'), l3: val('ppL3'), l4: val('ppL4') };
      var rack = need.l1 * RACK.l1 + need.l2 * RACK.l2 + need.l3 * RACK.l3 + need.l4 * RACK.l4;

      // smallest plan whose credits cover the monthly need
      var fit = null;
      for (var i = 0; i < PLANS.length; i++) {
        var p = PLANS[i];
        if (need.l1 <= p.l1 && need.l2 <= p.l2 && need.l3 <= p.l3 && need.l4 <= p.l4) { fit = p; break; }
      }

      var nameEl = doc.getElementById('ppPlan');
      var priceEl = doc.getElementById('ppPrice');
      var rackEl = doc.getElementById('ppRack');
      var saveEl = doc.getElementById('ppSave');
      var noteEl = doc.getElementById('ppNote');

      if (rackEl) rackEl.textContent = usd(rack);

      if (!rack) {
        if (nameEl) nameEl.textContent = 'Tell us your volume';
        if (priceEl) priceEl.textContent = '—';
        if (saveEl) saveEl.textContent = usd(0);
        if (noteEl) noteEl.textContent = 'Enter the number of files you review in a typical month.';
        return;
      }

      if (fit) {
        if (nameEl) nameEl.textContent = fit.name;
        if (priceEl) priceEl.textContent = usd(fit.price) + '/mo';
        if (saveEl) saveEl.textContent = usd(Math.max(0, rack - fit.price));
        if (noteEl) {
          noteEl.textContent = 'Includes ' + fit.l1 + ' L1, ' + fit.l2 + ' L2, ' + fit.l3 +
            ' L3 and ' + fit.l4 + ' L4 credits each month. Unused credits roll one month, capped at 20%.';
        }
      } else {
        if (nameEl) nameEl.textContent = 'Custom Enterprise Agreement';
        if (priceEl) priceEl.textContent = 'Let\'s talk';
        if (saveEl) saveEl.textContent = '—';
        if (noteEl) {
          noteEl.textContent = 'Your volume exceeds the Enterprise Regulatory Partner plan. ' +
            'We will build a custom agreement priced at or below rack totals.';
        }
      }
    };

    form.addEventListener('input', calc);
    form.addEventListener('change', calc);
    form.addEventListener('submit', function (e) { e.preventDefault(); calc(); });
    calc();
  }

  /* ---------- contact form ---------- */
  function initForms() {
    doc.querySelectorAll('form[data-contact]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        // If the form still points at the placeholder endpoint, don't post.
        var action = form.getAttribute('action') || '';
        if (action.indexOf('YOUR_FORM_ID') !== -1 || action === '') {
          e.preventDefault();
          var ok = form.parentElement.querySelector('.form-ok');
          if (ok) {
            ok.classList.add('is-visible');
            ok.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
          }
          form.reset();
          setTimeout(function () { if (ok) ok.classList.remove('is-visible'); }, 7000);
        }
      });
    });
  }

  /* ---------- prefill from ?plan= (RegReady pricing CTAs) ---------- */
  function initPrefill() {
    var service = doc.getElementById('service');
    if (!service) return;

    var match = location.search.match(/[?&]plan=([a-z-]+)/);
    if (!match) return;

    var PLAN_LABELS = {
      'basic': 'Compliance Basic ($2,600/mo)',
      'exam-prep': 'Exam Prep ($7,800/mo)',
      'audit-plus': 'Audit Plus ($13,000/mo)',
      'enterprise': 'Enterprise Regulatory Partner ($21,800/mo)'
    };
    var label = PLAN_LABELS[match[1]];
    if (!label) return;

    // point the enquiry at the right service
    for (var i = 0; i < service.options.length; i++) {
      if (service.options[i].text.indexOf('loan file review') !== -1) {
        service.selectedIndex = i;
        break;
      }
    }

    var message = doc.getElementById('message');
    if (message && !message.value) {
      message.value = 'I would like to discuss the ' + label + ' plan.';
    }
  }

  /* ---------- footer year ---------- */
  function initYear() {
    doc.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ---------- boot ---------- */
  function boot() {
    initHeader();
    initActiveNav();
    initReveal();
    initCounters();
    initAccordions();
    initNetSheet();
    initTitleFee();
    initPlanPicker();
    initForms();
    initPrefill();
    initYear();
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
