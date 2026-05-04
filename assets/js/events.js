(function () {
  'use strict';

  var container = document.getElementById('events-container');
  if (!container) return;

  fetch('content/events.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var events = data.events;
      if (!events || events.length === 0) {
        container.innerHTML = '<p class="events-empty">No upcoming events.</p>';
        return;
      }
      if (events.length <= 3) {
        var grid = document.createElement('div');
        grid.className = 'events-grid';
        events.forEach(function (ev, i) { grid.appendChild(buildCard(ev, i)); });
        container.appendChild(grid);
      } else {
        container.appendChild(buildCarousel(events));
      }
    })
    .catch(function () {
      container.innerHTML = '<p class="events-empty">Could not load events.</p>';
    });

  function buildCarousel(events) {
    var outer = document.createElement('div');
    outer.className = 'events-carousel-outer';

    var prevBtn = document.createElement('button');
    prevBtn.className = 'carousel-nav carousel-prev';
    prevBtn.setAttribute('aria-label', 'Previous events');

    var nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-nav carousel-next';
    nextBtn.setAttribute('aria-label', 'Next events');

    var carousel = document.createElement('div');
    carousel.className = 'events-carousel';

    var track = document.createElement('div');
    track.className = 'events-track';
    events.forEach(function (ev, i) { track.appendChild(buildCard(ev, i)); });

    carousel.appendChild(track);
    outer.appendChild(prevBtn);
    outer.appendChild(carousel);
    outer.appendChild(nextBtn);

    function updateNav() {
      var atStart = track.scrollLeft <= 1;
      var atEnd   = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
      prevBtn.style.opacity       = atStart ? '0' : '1';
      prevBtn.style.pointerEvents = atStart ? 'none' : 'all';
      nextBtn.style.opacity       = atEnd ? '0' : '1';
      nextBtn.style.pointerEvents = atEnd ? 'none' : 'all';
    }

    prevBtn.addEventListener('click', function () {
      closePanels();
      track.scrollBy({ left: -track.clientWidth, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', function () {
      closePanels();
      track.scrollBy({ left: track.clientWidth, behavior: 'smooth' });
    });

    track.addEventListener('scroll', updateNav, { passive: true });
    window.addEventListener('resize', updateNav, { passive: true });
    requestAnimationFrame(updateNav);

    return outer;
  }

  function closePanels() {
    document.querySelectorAll('.event-details.open').forEach(function (panel) {
      panel.classList.remove('open');
      panel.setAttribute('aria-hidden', 'true');
      var btn = document.querySelector('[data-target="' + panel.id + '"]');
      if (btn) {
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        var lbl = btn.querySelector('.btn-label');
        if (lbl) lbl.textContent = 'Read more';
      }
    });
  }

  function buildCard(ev, i) {
    var isPlaceholder = !ev.poster || ev.poster.indexOf('logo.') !== -1;
    var article = document.createElement('article');
    article.className = 'event-card';
    article.innerHTML = [
      '<h2 class="event-title">' + esc(ev.title) + '</h2>',
      '<p class="event-meta">',
        esc(ev.date),
        ev.location ? ' - ' + esc(ev.location) : '',
      '</p>',
      '<div class="event-poster-wrapper">',
        '<img src="' + esc(ev.poster || 'assets/images/logo.png') + '"',
             ' alt="' + esc(ev.title) + ' poster"',
             isPlaceholder ? ' class="is-placeholder"' : '',
             ' loading="lazy">',
        '<div class="event-poster-fade">',
          '<button class="read-more-btn" aria-expanded="false" data-target="details-' + i + '">',
            '<span class="btn-label">Read more</span>',
            '<span class="arrow" aria-hidden="true">&#8595;</span>',
          '</button>',
        '</div>',
      '</div>',
      '<div class="event-details" id="details-' + i + '" aria-hidden="true">',
        '<div class="event-details-inner">',
          ev.details ? '<p>' + esc(ev.details) + '</p>' : '',
          ev.facebookUrl ? '<a href="' + esc(ev.facebookUrl) + '" target="_blank" rel="noopener">Go to event page &rarr;</a>' : '',
        '</div>',
      '</div>'
    ].join('');
    return article;
  }

  function esc(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
})();
