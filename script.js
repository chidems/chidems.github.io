/* Chidem Sabuncu portfolio
   Loading screen, terminal intro, scroll reveals, scroll progress, timeline fill,
   active nav link, Vancouver clock, copy-email button. */
(() => {
  'use strict';

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  /* ---------- Loading screen ----------
     Resolves when the page is ready for the hero to appear. */
  function runBoot() {
    const boot = document.querySelector('.boot');
    if (!boot || !root.classList.contains('boot-on')) {
      if (boot) boot.remove();
      return Promise.resolve();
    }

    root.classList.add('boot-run');
    const bar = boot.querySelector('.boot-bar span');
    const label = boot.querySelector('[data-boot-text]');
    const pct = boot.querySelector('[data-boot-pct]');
    const steps = ['Loading projects', 'Loading skills', 'Loading experience', 'Ready'];
    const duration = 1300;

    return new Promise((resolve) => {
      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        boot.classList.add('is-leaving');
        setTimeout(() => {
          boot.remove();
          root.classList.remove('boot-on', 'boot-run');
          root.classList.add('boot-done');
          try { sessionStorage.setItem('boot-seen', '1'); } catch { /* storage can be blocked */ }
          resolve();
        }, 550);
      };

      const start = performance.now();
      const frame = (now) => {
        if (finished) return;
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        bar.style.transform = `scaleX(${eased})`;
        pct.textContent = `${Math.round(eased * 100)}%`;
        label.textContent = steps[Math.min(steps.length - 1, Math.floor(t * steps.length))];
        if (t < 1) requestAnimationFrame(frame);
        else setTimeout(finish, 180);
      };
      requestAnimationFrame(frame);

      /* A click or key press skips the loading screen. */
      boot.addEventListener('click', finish);
      window.addEventListener('keydown', finish, { once: true });
    });
  }

  /* ---------- Terminal intro ---------- */
  const terminal = document.querySelector('[data-typed]');
  const skipButton = document.querySelector('[data-skip]');
  const entries = terminal
    ? [...terminal.querySelectorAll('.t-line')].map((line) => {
        const text = line.querySelector('.t-text');
        return { line, text, full: text.textContent, isCommand: line.classList.contains('t-cmd') };
      })
    : [];
  let skipped = false;

  const showAll = () => {
    skipped = true;
    entries.forEach(({ line, text, full }) => { line.hidden = false; text.textContent = full; });
    if (skipButton) skipButton.hidden = true;
  };

  async function typeIntro() {
    if (!terminal || reduceMotion) return;
    const pause = (ms) => wait(skipped ? 0 : ms);
    await pause(350);
    for (const { line, text, full, isCommand } of entries) {
      if (skipped) break;
      line.hidden = false;
      if (isCommand) {
        for (const char of full) {
          if (skipped) break;
          text.textContent += char;
          await pause(32);
        }
        await pause(200);
      } else {
        text.textContent = full;
        await pause(340);
      }
    }
    showAll();
  }

  /* Hide the lines now (before the loading screen lifts) so they can type in later. */
  if (terminal && !reduceMotion) {
    entries.forEach(({ line, text }) => { line.hidden = true; text.textContent = ''; });
    if (skipButton) {
      skipButton.hidden = false;
      skipButton.addEventListener('click', showAll);
    }
  }

  runBoot().then(typeIntro);

  /* ---------- Scroll reveals ---------- */
  const revealItems = [...document.querySelectorAll('[data-reveal]')];

  /* Stagger items that share a parent, and chips within each skill group. */
  revealItems.forEach((el) => {
    const siblings = [...el.parentElement.children].filter((c) => c.hasAttribute('data-reveal'));
    el.style.setProperty('--delay', `${siblings.indexOf(el) * 0.09}s`);
  });
  document.querySelectorAll('.chips').forEach((list) => {
    [...list.children].forEach((chip, i) => chip.style.setProperty('--i', i));
  });

  /* Wrap typed headings so the clip can sit on an inner element. */
  document.querySelectorAll('[data-reveal="type"]').forEach((heading) => {
    const mask = document.createElement('span');
    mask.className = 'type-mask';
    while (heading.firstChild) mask.appendChild(heading.firstChild);
    heading.appendChild(mask);
  });

  if (!reduceMotion && 'IntersectionObserver' in window) {
    root.classList.add('reveal-ready');
    const revealer = new IntersectionObserver(
      (items) => {
        items.forEach((item) => {
          if (!item.isIntersecting) return;
          item.target.classList.add('is-in');
          revealer.unobserve(item.target);
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.1 }
    );
    revealItems.forEach((el) => revealer.observe(el));
  }

  /* ---------- Scroll progress bar and timeline fill ---------- */
  const progress = document.querySelector('[data-progress]');
  const timeline = document.querySelector('[data-timeline]');
  let ticking = false;

  function onScroll() {
    ticking = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;

    if (timeline && !reduceMotion) {
      const box = timeline.getBoundingClientRect();
      const line = window.innerHeight * 0.65; /* the point on screen the fill follows */
      const fill = Math.min(1, Math.max(0, (line - box.top) / box.height));
      timeline.style.setProperty('--fill', fill.toFixed(3));
    }
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- Highlight the nav link for the section in view ---------- */
  const navLinks = [...document.querySelectorAll('.nav-list a')];
  const sections = navLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);

  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(
      (items) => {
        items.forEach((item) => {
          if (!item.isIntersecting) return;
          navLinks.forEach((link) => {
            if (link.getAttribute('href') === `#${item.target.id}`) link.setAttribute('aria-current', 'true');
            else link.removeAttribute('aria-current');
          });
        });
      },
      { rootMargin: '-15% 0px -75% 0px' }
    );
    sections.forEach((section) => spy.observe(section));
  }

  /* ---------- Vancouver clock ---------- */
  const clock = document.querySelector('[data-clock]');
  if (clock) {
    const format = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Vancouver', hour: '2-digit', minute: '2-digit', hour12: false,
    });
    const tick = () => { clock.textContent = format.format(new Date()).replace(/^24:/, '00:'); };
    tick();
    setInterval(tick, 20000);
  }

  /* ---------- Copy email ---------- */
  const copyButton = document.querySelector('[data-copy-email]');
  const copyStatus = document.getElementById('copy-status');

  if (copyButton) {
    const label = copyButton.textContent;
    let resetTimer;
    copyButton.addEventListener('click', async () => {
      let copied = false;
      try {
        await navigator.clipboard.writeText(copyButton.dataset.copyEmail);
        copied = true;
      } catch {
        copied = false;
      }
      copyButton.textContent = copied ? 'Copied' : 'Select the address to copy it';
      copyStatus.textContent = copied ? 'Email address copied' : 'Could not copy the email address';
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => { copyButton.textContent = label; }, 2000);
    });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
