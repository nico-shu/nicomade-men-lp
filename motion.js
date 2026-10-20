(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches || !Element.prototype.animate || !('IntersectionObserver' in window)) return;
  const easing = 'cubic-bezier(.18,.68,.22,1)';
  const active = new Set();
  const play = (element, frames, duration, delay = 0) => {
    if (preference.matches) return;
    const animation = element.animate(frames, { duration, delay, easing, fill: 'backwards' });
    active.add(animation);
    animation.finished.catch(() => {}).finally(() => active.delete(animation));
  };
  const fade = (element, delay = 0) => play(element, [
    { opacity: 0, transform: 'translateY(20px)' },
    { opacity: 1, transform: 'translateY(0)' }
  ], 1650, delay);
  const hero = document.querySelector('.hero');
  if (hero && window.scrollY < 120) {
    const image = hero.querySelector('img');
    if (image) play(image, [{ transform: 'scale(1.025)' }, { transform: 'scale(1)' }], 3000);
    hero.querySelectorAll('.label,.eyebrow,h1,.sub,.lead,.gold-button,.button,.hero-service-note,.hero-price,.hero-note').forEach((element, index) => fade(element, 120 + index * 180));
  }
  const selectors = [
    '.section > .label', '.section > .interior-label', '.section > .eyebrow',
    '.section > h2', '.concept-grid > h2', '.concept-grid > div',
    '.split > h2', '.intro-text', '.manifesto > *', '.statement > *',
    '.night-masthead', '.night-cover-copy', '.night-story', '.night-design-notes > *',
    '.assurance-heading', '.assurance-stories > article', '.value-assurance:not(.photo-assurance) > div', '.service-grid > article', '.case-grid > figure', '.interior-plan > div',
    '.interior-flow li', '.interior-faq details', '.interior-consult > *',
    '.recovery-delivery', '.journal-inline', '.journal-heading > *',
    '.journal-intro', '.journal-chapter', '.journal-related'
  ];
  const candidates = [...new Set(document.querySelectorAll(selectors.join(',')))];
  const targets = candidates.filter(element => !candidates.some(other => other !== element && other.contains(element)));
  const textObserver = new IntersectionObserver(entries => {
    entries.filter(entry => entry.isIntersecting).forEach((entry, index) => {
      textObserver.unobserve(entry.target);
      if (!entry.target.classList.contains('motion-pending')) return;
      fade(entry.target, Math.min(index * 100, 200));
      entry.target.classList.remove('motion-pending');
    });
  }, { threshold: 0, rootMargin: '0px 0px 140px 0px' });
  // Only prepare blocks still offscreen. Visible content never resets to transparent.
  targets.forEach(element => {
    if (element.getBoundingClientRect().top < window.innerHeight + 140) return;
    element.classList.add('motion-pending');
    textObserver.observe(element);
  });
  const photoObserver = new IntersectionObserver(entries => {
    entries.filter(entry => entry.isIntersecting).forEach(entry => {
      photoObserver.unobserve(entry.target);
      play(entry.target, [{ transform: 'scale(1.025)' }, { transform: 'scale(1)' }], 2400);
      entry.target.classList.remove('motion-photo-pending');
    });
  }, { threshold: 0, rootMargin: '0px 0px 140px 0px' });
  document.querySelectorAll('.night-photo > img,.journal-cover > img').forEach(image => {
    if (image.getBoundingClientRect().top < window.innerHeight + 140) return;
    image.classList.add('motion-photo-pending');
    photoObserver.observe(image);
  });
  preference.addEventListener('change', event => {
    if (!event.matches) return;
    textObserver.disconnect();
    photoObserver.disconnect();
    active.forEach(animation => animation.cancel());
    active.clear();
    document.querySelectorAll('.motion-pending,.motion-photo-pending').forEach(element => element.classList.remove('motion-pending','motion-photo-pending'));
  });
})();


