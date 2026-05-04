(function () {
  'use strict';

  function closePanel(panel) {
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    var btn = document.querySelector('[data-target="' + panel.id + '"]');
    if (btn) {
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      var lbl = btn.querySelector('.btn-label');
      if (lbl) lbl.textContent = 'Read more';
    }
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.read-more-btn');
    if (!btn) return;

    var targetId = btn.getAttribute('data-target');
    var panel = document.getElementById(targetId);
    if (!panel) return;

    var isOpen = panel.classList.contains('open');

    // Accordion: close any other open panel before opening this one
    if (!isOpen) {
      document.querySelectorAll('.event-details.open').forEach(function (openPanel) {
        if (openPanel !== panel) closePanel(openPanel);
      });
    }

    panel.classList.toggle('open', !isOpen);
    btn.classList.toggle('open', !isOpen);
    btn.setAttribute('aria-expanded', String(!isOpen));
    panel.setAttribute('aria-hidden', String(isOpen));

    var label = btn.querySelector('.btn-label');
    if (label) label.textContent = isOpen ? 'Read more' : 'Read less';
  });
})();
