/* ============================================================
   MANUWAR GULZAR — PORTFOLIO  |  script.js
   ============================================================ */

/* ---- TOAST (global so HTML onclick can call it) ----------- */
function showToast(msg) {
  var t = document.getElementById('toast');
  var m = document.getElementById('toastMsg');
  if (!t || !m) return;
  m.textContent = msg;
  t.classList.add('show');
  setTimeout(function () { t.classList.remove('show'); }, 3800);
}

/* ---- MOBILE NAV (global for HTML onclick) ----------------- */
function openNav()  { var n = document.getElementById('mNav'); if (n) n.classList.add('open'); }
function closeNav() { var n = document.getElementById('mNav'); if (n) n.classList.remove('open'); }

/* ================================================================
   MAIN — runs after DOM is ready
   ================================================================ */
document.addEventListener('DOMContentLoaded', function () {

  /* ---- CUSTOM CURSOR ---- */
  var cur = document.getElementById('cur');
  if (cur && window.matchMedia('(pointer:fine)').matches) {
    var mx = 0, my = 0, cx = 0, cy = 0;
    document.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; });
    (function raf() {
      cx += (mx - cx) * 0.14;
      cy += (my - cy) * 0.14;
      cur.style.transform = 'translate(' + cx + 'px,' + cy + 'px) translate(-50%,-50%)';
      requestAnimationFrame(raf);
    }());
    document.querySelectorAll('a, button').forEach(function (el) {
      el.addEventListener('mouseenter', function () { document.body.classList.add('cur-big'); });
      el.addEventListener('mouseleave', function () { document.body.classList.remove('cur-big'); });
    });
  }

  /* ---- DAY / NIGHT TOGGLE ---- */
  var THEME_KEY = 'mg-theme';
  var themeBtn  = document.getElementById('themeBtn');
  var themeIcon = document.getElementById('themeIcon');

  try {
    if (localStorage.getItem(THEME_KEY) === 'day') {
      document.body.classList.add('day');
      if (themeIcon) { themeIcon.classList.replace('fa-moon', 'fa-sun'); }
    }
  } catch (e) {}

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var isDay = document.body.classList.toggle('day');
      if (themeIcon) {
        themeIcon.classList.toggle('fa-moon', !isDay);
        themeIcon.classList.toggle('fa-sun',   isDay);
      }
      try { localStorage.setItem(THEME_KEY, isDay ? 'day' : 'night'); } catch (e) {}
      showToast(isDay ? '// DAY MODE ON' : '// NIGHT MODE ON');
    });
  }

  /* ---- NAVBAR SCROLL ---- */
  var nav = document.getElementById('nav');
  function updateNav() {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ---- ACTIVE NAV LINK ---- */
  var sections = Array.from(document.querySelectorAll('section[id]'));
  var navAs    = Array.from(document.querySelectorAll('.nav-a'));
  window.addEventListener('scroll', function () {
    var scrollY = window.scrollY;
    var current = '';
    sections.forEach(function (s) { if (scrollY >= s.offsetTop - 140) current = s.id; });
    navAs.forEach(function (a) { a.classList.toggle('act', a.getAttribute('href') === '#' + current); });
  }, { passive: true });

  /* ---- HAMBURGER ---- */
  var hbg    = document.getElementById('hbg');
  var mNav   = document.getElementById('mNav');
  var mClose = document.getElementById('mClose');
  if (hbg) hbg.addEventListener('click', function () {
    openNav();
    var spans = hbg.querySelectorAll('span');
    spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
    if (spans[1]) spans[1].style.opacity = '0';
  });
  function doClose() {
    closeNav();
    var spans = hbg ? hbg.querySelectorAll('span') : [];
    if (spans[0]) spans[0].style.transform = '';
    if (spans[1]) spans[1].style.opacity = '';
  }
  if (mClose) mClose.addEventListener('click', doClose);
  if (mNav) mNav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', doClose); });

  /* ---- SCROLL REVEAL ---- */
  var reveals = Array.from(document.querySelectorAll('.reveal'));
  var revObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var siblings = Array.from(
        entry.target.parentElement ? entry.target.parentElement.querySelectorAll('.reveal') : []
      );
      var delay = Math.max(0, siblings.indexOf(entry.target)) * 80;
      setTimeout(function () { entry.target.classList.add('visible'); }, delay);
      revObs.unobserve(entry.target);
    });
  }, { threshold: 0.07 });
  reveals.forEach(function (el) { revObs.observe(el); });

  /* ---- PORTFOLIO FILTER ---- */
  var pfBtns  = Array.from(document.querySelectorAll('.pf-btn'));
  var pfCards = Array.from(document.querySelectorAll('.pf-card'));
  var pfCount = document.getElementById('pfCount');
  pfBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      pfBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var cat = btn.getAttribute('data-cat');
      var count = 0;
      pfCards.forEach(function (card) {
        var show = cat === 'all' || card.getAttribute('data-cat') === cat;
        if (show) {
          card.style.display = '';
          setTimeout(function () {
            card.style.transition = 'opacity 0.35s, transform 0.35s, border-color 0.3s';
            card.style.opacity = '1'; card.style.transform = '';
          }, 10);
          count++;
        } else {
          card.style.transition = 'opacity 0.25s, transform 0.25s';
          card.style.opacity = '0'; card.style.transform = 'scale(0.95)';
          setTimeout(function () { card.style.display = 'none'; }, 270);
        }
      });
      if (pfCount) pfCount.textContent = count + ' project' + (count !== 1 ? 's' : '');
    });
  });

  /* ---- CONTACT FORM ---- */
  var sendBtn = document.getElementById('sendBtn');
  if (sendBtn) {
    sendBtn.addEventListener('click', function () {
      var name  = (document.getElementById('cname')  || {}).value || '';
      var email = (document.getElementById('cemail') || {}).value || '';
      var msg   = (document.getElementById('cmsg')   || {}).value || '';
      if (!name.trim() || !email.trim() || !msg.trim()) {
        showToast('// ERROR: Fill all required fields'); return;
      }
      var icon = sendBtn.querySelector('i');
      var span = sendBtn.querySelector('span');
      sendBtn.disabled = true;
      if (icon) icon.className = 'fas fa-spinner fa-spin';
      if (span) span.textContent = 'Sending...';
      setTimeout(function () {
        showToast('// TRANSMITTED — Reply in 24hrs');
        sendBtn.disabled = false;
        if (icon) icon.className = 'fas fa-check';
        if (span) span.textContent = 'Sent!';
        ['cname','cemail','ctype','ctimeline','cmsg'].forEach(function (id) {
          var el = document.getElementById(id); if (el) el.value = '';
        });
        setTimeout(function () {
          if (icon) icon.className = 'fas fa-paper-plane';
          if (span) span.textContent = 'Transmit';
        }, 3000);
      }, 1600);
    });
  }

  /* ---- CV DOWNLOAD ---- */
  document.querySelectorAll('a[href="Manuwar_CV.pdf"]').forEach(function (a) {
    a.addEventListener('click', function () { showToast('// CV DOWNLOAD INITIATED'); });
  });

  /* ---- SMOOTH SCROLL ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      var offset = target.getBoundingClientRect().top + window.scrollY - 68 - 32;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    });
  });

  /* ---- GLITCH TRIGGER ---- */
  var glitchEl = document.querySelector('.h1-a');
  if (glitchEl) {
    setInterval(function () {
      if (Math.random() > 0.72) {
        glitchEl.style.animation = 'none';
        void glitchEl.offsetHeight;
        glitchEl.style.animation = '';
      }
    }, 4000);
  }

  /* ================================================================
     CERTIFICATE LIGHTBOX
     ================================================================ */
  var cards   = Array.from(document.querySelectorAll('.cert-card[data-cert-img]'));
  var overlay = document.getElementById('lbOverlay');

  if (cards.length && overlay) {
    var lbImg     = document.getElementById('lbImg');
    var lbTitle   = document.getElementById('lbTitle');
    var lbIssuer  = document.getElementById('lbIssuer');
    var lbCounter = document.getElementById('lbCounter');
    var lbClose   = document.getElementById('lbClose');
    var lbPrev    = document.getElementById('lbPrev');
    var lbNext    = document.getElementById('lbNext');
    var lbDots    = document.getElementById('lbDots');
    var lbLoading = document.getElementById('lbLoading');
    var current   = 0;
    var total     = cards.length;

    /* Build dot indicators */
    cards.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.className = 'lb-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to certificate ' + (i + 1));
      dot.addEventListener('click', function () { goTo(i); });
      lbDots.appendChild(dot);
    });

    function getDots() { return Array.from(lbDots.querySelectorAll('.lb-dot')); }

    function loadSlide(index, fade) {
      var card   = cards[index];
      var src    = card.getAttribute('data-cert-img');
      var title  = card.getAttribute('data-cert-title')  || '';
      var issuer = card.getAttribute('data-cert-issuer') || '';

      if (lbTitle)   lbTitle.textContent   = title;
      if (lbIssuer)  lbIssuer.textContent  = issuer;
      if (lbCounter) lbCounter.textContent = (index + 1) + ' / ' + total;

      getDots().forEach(function (d, i) { d.classList.toggle('active', i === index); });

      if (lbPrev) lbPrev.disabled = (index === 0);
      if (lbNext) lbNext.disabled = (index === total - 1);

      if (fade && lbImg) lbImg.classList.add('lb-fade');
      if (lbLoading) lbLoading.classList.add('visible');

      var newImg   = new Image();
      newImg.onload = function () {
        if (lbImg) {
          lbImg.src = src;
          lbImg.alt = title;
        }
        if (lbLoading) lbLoading.classList.remove('visible');
        if (fade && lbImg) {
          setTimeout(function () { lbImg.classList.remove('lb-fade'); }, 20);
        }
      };
      newImg.onerror = function () {
        if (lbImg) { lbImg.src = ''; lbImg.alt = 'Certificate image not found'; }
        if (lbLoading) lbLoading.classList.remove('visible');
      };
      newImg.src = src;
    }

    function goTo(index) {
      if (index < 0 || index >= total) return;
      current = index;
      loadSlide(current, true);
    }

    function openLB(index) {
      current = index;
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      loadSlide(current, false);
    }

    function closeLB() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    /* Card click — but not on the verify link */
    cards.forEach(function (card) {
      card.addEventListener('click', function (e) {
        if (e.target.closest('.cc-verify')) return;
        var idx = parseInt(card.getAttribute('data-cert-index')) || 0;
        openLB(idx);
      });
    });

    if (lbClose)  lbClose.addEventListener('click', closeLB);
    if (lbPrev)   lbPrev.addEventListener('click',  function () { goTo(current - 1); });
    if (lbNext)   lbNext.addEventListener('click',  function () { goTo(current + 1); });

    /* Click outside box closes */
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeLB();
    });

    /* Keyboard */
    document.addEventListener('keydown', function (e) {
      if (!overlay.classList.contains('open')) return;
      if (e.key === 'Escape' || e.key === 'Esc') closeLB();
      if (e.key === 'ArrowLeft')  goTo(current - 1);
      if (e.key === 'ArrowRight') goTo(current + 1);
    });

    /* Touch swipe */
    var touchStartX = 0;
    overlay.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    overlay.addEventListener('touchend', function (e) {
      var diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { goTo(diff > 0 ? current + 1 : current - 1); }
    }, { passive: true });
  }

}); /* end DOMContentLoaded */

/* ============================================================
   LOGO & HEADING ANIMATIONS  v2
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {

  /* --- 1. HERO H1: split each letter into .h1-char spans ---- */
  var h1Lines = document.querySelectorAll('.h1-line');
  h1Lines.forEach(function (line) {
    var text      = line.textContent;
    var isB       = line.classList.contains('h1-b');
    var baseDelay = isB ? 1.05 : 0.5; /* GULZAR after MANUWAR */

    line.textContent = '';

    Array.from(text).forEach(function (ch, i) {
      var span          = document.createElement('span');
      span.className    = 'h1-char';
      span.textContent  = ch === ' ' ? '\u00A0' : ch;
      span.style.animationDelay = (baseDelay + i * 0.055).toFixed(3) + 's';
      /* Preserve the outline text-stroke on .h1-b chars */
      if (isB) { span.style.color = 'transparent'; }
      line.appendChild(span);
    });
  });

  /* --- 2. SECTION TITLES: safe opacity reveal on scroll ----- */
  var titles = document.querySelectorAll('.sec-title');

  /* Wrap words for stagger, then mark as anim-ready          */
  titles.forEach(function (el) {
    /* Wrap each text-node word in .tw, keep <em> intact       */
    Array.from(el.childNodes).forEach(function (node) {
      if (node.nodeType !== 3) return; /* skip element nodes  */
      var words = node.textContent.split(/(\s+)/);
      var frag  = document.createDocumentFragment();
      words.forEach(function (part) {
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
        } else if (part.length) {
          var s       = document.createElement('span');
          s.className = 'tw';
          s.textContent = part;
          frag.appendChild(s);
        }
      });
      node.parentNode.replaceChild(frag, node);
    });

    /* Now safe to hide — JS is definitely running */
    el.classList.add('anim-ready');
  });

  var titleObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('title-visible');
      titleObs.unobserve(e.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  titles.forEach(function (el) { titleObs.observe(el); });

  /* --- 3. SEC-LABELS: slide-in on scroll -------------------- */
  var labels = document.querySelectorAll('.sec-label');

  labels.forEach(function (el) {
    el.classList.add('anim-ready'); /* safe: JS is running */
  });

  var labelObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      setTimeout(function () { e.target.classList.add('label-visible'); }, 150);
      labelObs.unobserve(e.target);
    });
  }, { threshold: 0.4 });

  labels.forEach(function (el) { labelObs.observe(el); });

});
/* ================================================================
   LIVE LIGHTNING CANVAS  — runs across the full viewport
   ================================================================ */
(function() {
  var canvas  = document.getElementById('lightning-canvas');
  if (!canvas) return;
  var ctx     = canvas.getContext('2d');
  var W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  /* --- Lightning bolt generator --- */
  function bolt(x1,y1,x2,y2,spread,depth) {
    if (depth === 0) {
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
      return;
    }
    var mx = (x1+x2)/2 + (Math.random()-0.5)*spread;
    var my = (y1+y2)/2 + (Math.random()-0.5)*spread;
    bolt(x1,y1,mx,my,spread/2,depth-1);
    bolt(mx,my,x2,y2,spread/2,depth-1);
    /* Occasional branch */
    if (depth > 1 && Math.random() < 0.35) {
      var bx = mx + (Math.random()-0.5)*spread*1.5;
      var by = my + Math.random()*spread*1.5;
      bolt(mx,my,bx,by,spread/3,depth-2);
    }
  }

  /* --- Strike state --- */
  var strikes    = [];
  var nextStrike = 0;

  function scheduleNext() {
    nextStrike = Date.now() + 800 + Math.random()*2200;
  }
  scheduleNext();

  function createStrike() {
    var sx = Math.random() * W;
    var sy = 0;
    var ex = sx + (Math.random()-0.5)*300;
    var ey = H * (0.3 + Math.random()*0.6);
    strikes.push({ sx:sx, sy:sy, ex:ex, ey:ey, life:0, maxLife:12, alpha:1 });
    /* Sometimes add a second simultaneous strike */
    if (Math.random() < 0.3) {
      var sx2 = Math.random() * W;
      strikes.push({ sx:sx2, sy:0, ex:sx2+(Math.random()-0.5)*200, ey:H*(0.2+Math.random()*0.5), life:0, maxLife:10, alpha:0.7 });
    }
    scheduleNext();
  }

  function loop() {
    ctx.clearRect(0,0,W,H);

    if (Date.now() > nextStrike) createStrike();

    strikes = strikes.filter(function(s){ return s.life < s.maxLife; });
    strikes.forEach(function(s) {
      s.life++;
      var progress = s.life / s.maxLife;
      /* Flash: bright at start, fade out */
      var alpha = (1 - progress) * s.alpha;
      /* Outer glow */
      ctx.save();
      ctx.strokeStyle = 'rgba(255,30,30,' + (alpha*0.3) + ')';
      ctx.lineWidth   = 6;
      ctx.shadowColor = '#ff1010';
      ctx.shadowBlur  = 24;
      bolt(s.sx,s.sy,s.ex,s.ey,120,5);
      /* Inner bright core */
      ctx.strokeStyle = 'rgba(255,180,180,' + alpha + ')';
      ctx.lineWidth   = 1.5;
      ctx.shadowBlur  = 10;
      bolt(s.sx,s.sy,s.ex,s.ey,120,5);
      ctx.restore();
    });

    requestAnimationFrame(loop);
  }
  loop();
}());

/* ================================================================
   HEADING + LOGO ANIMATIONS
   ================================================================ */
document.addEventListener('DOMContentLoaded', function() {

  /* 1. Split H1 letters */
  document.querySelectorAll('.h1-line').forEach(function(line) {
    var text  = line.textContent;
    var isB   = line.classList.contains('h1-b');
    var base  = isB ? 1.05 : 0.5;
    line.textContent = '';
    Array.from(text).forEach(function(ch,i) {
      var s = document.createElement('span');
      s.className = 'h1-char';
      s.textContent = ch === ' ' ? '\u00A0' : ch;
      s.style.animationDelay = (base + i*0.055).toFixed(3)+'s';
      if (isB) s.style.color = 'transparent';
      line.appendChild(s);
    });
  });

  /* 2. Section titles: safe reveal */
  var titles = document.querySelectorAll('.sec-title');
  titles.forEach(function(el) {
    Array.from(el.childNodes).forEach(function(node) {
      if (node.nodeType !== 3) return;
      var frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(function(part) {
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); }
        else if (part.length)   { var s=document.createElement('span'); s.className='tw'; s.textContent=part; frag.appendChild(s); }
      });
      node.parentNode.replaceChild(frag, node);
    });
    el.classList.add('anim-ready');
  });
  var tObs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(!e.isIntersecting)return; e.target.classList.add('title-visible'); tObs.unobserve(e.target); });
  },{threshold:0.15,rootMargin:'0px 0px -40px 0px'});
  titles.forEach(function(el){ tObs.observe(el); });

  /* 3. Sec-labels slide in */
  var labels = document.querySelectorAll('.sec-label');
  labels.forEach(function(el){ el.classList.add('anim-ready'); });
  var lObs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(!e.isIntersecting)return; setTimeout(function(){ e.target.classList.add('label-visible'); },150); lObs.unobserve(e.target); });
  },{threshold:0.4});
  labels.forEach(function(el){ lObs.observe(el); });

});