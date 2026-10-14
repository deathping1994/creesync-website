(function () {
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  links.addEventListener('click', function (e) {
    if (e.target.closest('a')) {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Reveal on scroll
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Work filters
  var buttons = document.querySelectorAll('.work-filters button');
  var cards = document.querySelectorAll('.work-card');
  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.dataset.filter;
      buttons.forEach(function (b) { b.classList.toggle('active', b === btn); });
      cards.forEach(function (card) {
        card.hidden = f !== 'all' && card.dataset.type.split(' ').indexOf(f) === -1;
      });
    });
  });

  // Enquiry form (Web3Forms)
  var form = document.getElementById('enquiry-form');
  if (form) {
    var status = form.querySelector('.form-status');
    var button = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.className = 'form-status';
      var firstBad = null;
      form.querySelectorAll('[required]').forEach(function (el) {
        var bad = !el.checkValidity();
        el.classList.toggle('invalid', bad);
        if (bad && !firstBad) firstBad = el;
      });
      if (firstBad) {
        status.textContent = 'Please fill in the highlighted fields.';
        status.classList.add('err');
        firstBad.focus();
        return;
      }
      var data = Object.fromEntries(new FormData(form));
      data.subject = 'Creesync enquiry: ' + data.enquiry_type + ' - ' + data.name + (data.organisation ? ' (' + data.organisation + ')' : '');
      data.replyto = data.email;
      button.disabled = true;
      status.textContent = 'Sending...';
      fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (!res.success) throw new Error(res.message || 'Submission failed');
          form.reset();
          status.textContent = 'Thank you. Your enquiry has been sent and our team will get back to you shortly.';
          status.classList.add('ok');
        })
        .catch(function () {
          status.textContent = 'Sorry, something went wrong. Please call us on +91 78381 71569 instead.';
          status.classList.add('err');
        })
        .finally(function () { button.disabled = false; });
    });
    form.addEventListener('input', function (e) { e.target.classList.remove('invalid'); });
  }

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
