(function () {
  // Business contact targets (verify with client, see seo-content/CLIENT-CHECKLIST.md)
  var CFG = { whatsapp: '971502416414', email: 'marhaba@marhabaheavyequip.com' };

  var burger = document.querySelector('.burger');
  var nav = document.getElementById('nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }
  document.querySelectorAll('.dd > button').forEach(function (b) {
    b.addEventListener('click', function () {
      var dd = b.parentElement;
      var open = dd.classList.toggle('open');
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  function msgFrom(form) {
    var d = new FormData(form);
    var lines = ['Enquiry from marhabaheavyequip.com', ''];
    [['name', 'Name'], ['company', 'Company'], ['phone', 'Phone'], ['category', 'Looking for'], ['model', 'Brand / model / part number'], ['country', 'Delivery country'], ['message', 'Details']].forEach(function (p) {
      var v = (d.get(p[0]) || '').toString().trim();
      if (v) lines.push(p[1] + ': ' + v);
    });
    return lines.join('\n');
  }
  function valid(form) {
    var n = form.querySelector('[name=name]'), m = form.querySelector('[name=message]');
    if (n && !n.value.trim()) { n.focus(); return false; }
    if (m && !m.value.trim()) { m.focus(); return false; }
    return true;
  }
  document.querySelectorAll('form.enq').forEach(function (form) {
    form.addEventListener('submit', function (e) { e.preventDefault(); });
    form.querySelectorAll('[data-send]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!valid(form)) return;
        var text = msgFrom(form);
        if (btn.dataset.send === 'wa') {
          window.open('https://wa.me/' + CFG.whatsapp + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
        } else {
          window.location.href = 'mailto:' + CFG.email + '?subject=' + encodeURIComponent('Enquiry from website') + '&body=' + encodeURIComponent(text);
        }
      });
    });
    var cat = form.querySelector('[name=category]');
    var pre = form.dataset.preset;
    if (cat && pre) { for (var i = 0; i < cat.options.length; i++) { if (cat.options[i].value === pre) cat.selectedIndex = i; } }
  });
})();
