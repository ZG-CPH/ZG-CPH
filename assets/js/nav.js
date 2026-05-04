(function () {
  var nav = document.querySelector('.site-nav');
  if (!nav) return;

  var indicator = document.createElement('div');
  indicator.className = 'nav-indicator';
  nav.appendChild(indicator);

  var links = nav.querySelectorAll('a');
  var activeLink = null;
  var ready = false;

  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
      activeLink = link;
    }
  });

  function move(el) {
    var navRect = nav.getBoundingClientRect();
    var rect = el.getBoundingClientRect();
    indicator.style.left  = (rect.left - navRect.left) + 'px';
    indicator.style.width = rect.width + 'px';
    indicator.style.opacity = '1';
  }

  // ResizeObserver fires immediately on first observation and again on any
  // layout shift (e.g. font-display:swap replacing the fallback font).
  // This handles all timing cases without guessing when fonts are ready.
  var placing = false;
  var ro = new ResizeObserver(function () {
    if (placing || !activeLink) return;
    placing = true;
    ready = false;
    requestAnimationFrame(function () {
      placing = false;
      indicator.style.transition = 'none';
      move(activeLink);
      requestAnimationFrame(function () {
        indicator.style.transition = '';
        ready = true;
      });
    });
  });
  links.forEach(function (link) { ro.observe(link); });

  links.forEach(function (link) {
    link.addEventListener('mouseenter', function () {
      if (ready) move(this);
    });
  });

  nav.addEventListener('mouseleave', function () {
    if (!ready) return;
    if (activeLink) {
      move(activeLink);
    } else {
      indicator.style.opacity = '0';
    }
  });
})();
