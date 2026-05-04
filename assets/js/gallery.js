(function () {
  'use strict';

  var grid = document.getElementById('gallery-grid');
  if (!grid) return;

  var items = [];
  var currentIndex = 0;
  var lightbox, lbImg, lbCaption;

  function buildLightbox() {
    lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');

    var closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.textContent = 'Close';
    closeBtn.addEventListener('click', closeLightbox);

    var inner = document.createElement('div');
    inner.className = 'lightbox-inner';

    var prevBtn = document.createElement('button');
    prevBtn.className = 'lightbox-nav lightbox-prev';
    prevBtn.innerHTML = '';
    prevBtn.setAttribute('aria-label', 'Previous');
    prevBtn.addEventListener('click', function (e) { e.stopPropagation(); go(-1); });

    var nextBtn = document.createElement('button');
    nextBtn.className = 'lightbox-nav lightbox-next';
    nextBtn.innerHTML = '';
    nextBtn.setAttribute('aria-label', 'Next');
    nextBtn.addEventListener('click', function (e) { e.stopPropagation(); go(1); });

    lbImg = document.createElement('img');
    lbImg.className = 'lightbox-img';

    inner.appendChild(prevBtn);
    inner.appendChild(lbImg);
    inner.appendChild(nextBtn);

    lbCaption = document.createElement('div');
    lbCaption.className = 'lightbox-caption';

    lightbox.appendChild(closeBtn);
    lightbox.appendChild(inner);
    lightbox.appendChild(lbCaption);

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.body.appendChild(lightbox);
  }

  function openLightbox(index) {
    currentIndex = index;
    show();
    lightbox.classList.add('open');
    document.addEventListener('keydown', onKey);
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.removeEventListener('keydown', onKey);
  }

  function go(dir) {
    currentIndex = (currentIndex + dir + items.length) % items.length;
    lbImg.style.opacity = '0';
    setTimeout(show, 140);
  }

  function show() {
    var ev = items[currentIndex];
    lbImg.src = encodeURI(ev.image);
    lbImg.alt = ev.title;
    lbImg.style.opacity = '1';
    var caption = ev.title;
    if (ev.date && ev.date !== 'TBD') caption += ' - ' + ev.date;
    lbCaption.textContent = caption;
  }

  function onKey(e) {
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   go(-1);
    if (e.key === 'ArrowRight')  go(1);
  }

  fetch('content/previous-events.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      items = data.events;
      buildLightbox();
      items.forEach(function (ev, i) {
        grid.appendChild(buildItem(ev, i));
      });
    })
    .catch(function () {
      grid.innerHTML = '<p style="color:var(--muted);padding:3rem 2rem;">Could not load events.</p>';
    });

  function buildItem(ev, index) {
    var item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = [
      '<img src="' + encodeURI(ev.image) + '" alt="' + esc(ev.title) + '" loading="lazy">',
      '<div class="gallery-overlay">',
        '<div class="gallery-overlay-title">' + esc(ev.title) + '</div>',
        ev.date && ev.date !== 'TBD'
          ? '<div class="gallery-overlay-date">' + esc(ev.date) + '</div>'
          : '',
      '</div>'
    ].join('');
    item.addEventListener('click', function () { openLightbox(index); });
    return item;
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
