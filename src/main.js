import './style.css';

// Cache nav links early for consistent behavior
const navLinks = document.querySelectorAll('.nav-list a');

// Mobile nav toggle
document.querySelector('.nav-toggle')?.addEventListener('click', () => {
  const nav = document.querySelector('.nav');
  const btn = document.querySelector('.nav-toggle');
  nav?.classList.toggle('open');
  const expanded = btn?.getAttribute('aria-expanded') === 'true';
  btn?.setAttribute('aria-expanded', (!expanded).toString());
});

// Smooth scroll
const links = document.querySelectorAll('a[href^="#"]');
links.forEach((a) => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      // Ensure header offset and consistent behavior for all items
      const headerEl = document.querySelector('.site-header');
      const headerH = headerEl ? headerEl.getBoundingClientRect().height : 0;
      const top = window.scrollY + target.getBoundingClientRect().top - headerH - 6;
      window.scrollTo({ top, behavior: 'smooth' });
      // Mark active immediately for better feedback
      navLinks.forEach((l) => l.classList.toggle('active', l === a));
      document.querySelector('.nav')?.classList.remove('open');
      document.querySelector('.nav-toggle')?.setAttribute('aria-expanded', 'false');
    }
  });
});

// Header shadow and hide/show on scroll
const header = document.querySelector('.site-header');
let lastScroll = 0;
const handleScroll = () => {
  const currentScroll = window.scrollY;
  
  // Add shadow when scrolled
  if (currentScroll > 4) header?.classList.add('scrolled');
  else header?.classList.remove('scrolled');
  
  // Hide header when scrolling down, show when scrolling up
  if (currentScroll > lastScroll && currentScroll > 100) {
    // Scrolling down & past threshold
    header?.classList.add('header-hidden');
  } else if (currentScroll < lastScroll) {
    // Scrolling up
    header?.classList.remove('header-hidden');
  }
  
  lastScroll = currentScroll;
};
handleScroll();
window.addEventListener('scroll', handleScroll, { passive: true });

// Active link highlight
const sections = document.querySelectorAll('section[id]');
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 }
);
sections.forEach((s) => io.observe(s));

// Reveal animations
const revealEls = document.querySelectorAll('.card, .price-card, .feature, .g-item, .promo');
const io2 = new IntersectionObserver(
  (entries) => entries.forEach((e) => e.target.classList.toggle('reveal', e.isIntersecting)),
  { threshold: 0.15 }
);
revealEls.forEach((el) => io2.observe(el));

// Dynamic year
document.getElementById('year').textContent = String(new Date().getFullYear());

// Scroll progress bar
const prog = document.querySelector('.scroll-progress span');
const updateProgress = () => {
  const h = document.documentElement;
  const max = h.scrollHeight - h.clientHeight;
  const p = max > 0 ? (h.scrollTop / max) * 100 : 0;
  if (prog) prog.style.width = `${p}%`;
};
updateProgress();
window.addEventListener('scroll', updateProgress, { passive: true });

// Hero parallax
const heroBg = document.querySelector('.hero-bg');
window.addEventListener('mousemove', (e) => {
  if (!heroBg) return;
  const x = (e.clientX / window.innerWidth - 0.5) * 10; // -5..5
  const y = (e.clientY / window.innerHeight - 0.5) * 10; // -5..5
  heroBg.style.transform = `translate3d(${x}px, ${y}px, 0)`;
});

// Hero background video playlist
(function setupHeroPlaylist(){
  const el = document.getElementById('heroVideo');
  if (!el) return;
  const playlist = [
    '/public/vdo/Hero/3998263-uhd_4096_2160_25fps.mp4',
    '/public/vdo/Hero/3998279-uhd_2160_4096_25fps.mp4',
    '/public/vdo/Hero/6186727-uhd_2160_3840_25fps.mp4',
    '/public/vdo/Hero/6629704-uhd_2160_4096_25fps.mp4',
    '/public/vdo/Hero/6629720-uhd_4096_2160_25fps.mp4',
    '/public/vdo/Hero/6750890-hd_1920_1080_25fps.mp4',
    '/public/vdo/Hero/854399-hd_1280_720_24fps.mp4',
  ];
  let i = 0;
  const load = (idx) => {
    el.src = playlist[idx];
    // ensure plays on mobile (muted already)
    const p = el.play();
    if (p) p.catch(() => {/* ignore autoplay block for background */});
  };
  el.addEventListener('ended', () => {
    i = (i + 1) % playlist.length; // next video, loop
    load(i);
  });
  // Start with the first item
  load(i);
})();

// Button glow follows cursor
document.querySelectorAll('.btn-primary').forEach((btn) => {
  btn.addEventListener('pointermove', (e) => {
    const rect = btn.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 100;
    const my = ((e.clientY - rect.top) / rect.height) * 100;
    btn.style.setProperty('--mx', `${mx}%`);
    btn.style.setProperty('--my', `${my}%`);
  });
});

// Auto-play background music
const bgMusic = document.getElementById('bgMusic');
if (bgMusic) {
  // Try to play immediately
  const playPromise = bgMusic.play();
  
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Auto-play was prevented, play on first user interaction
      const playOnInteraction = () => {
        bgMusic.play();
        document.removeEventListener('click', playOnInteraction);
        document.removeEventListener('touchstart', playOnInteraction);
        document.removeEventListener('scroll', playOnInteraction);
      };
      
      document.addEventListener('click', playOnInteraction);
      document.addEventListener('touchstart', playOnInteraction);
      document.addEventListener('scroll', playOnInteraction);
    });
  }
}

// Subtle tilt on cards
const tiltable = document.querySelectorAll('.card, .price-card, .g-item');
tiltable.forEach((el) => {
  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateX(${(-py * 3).toFixed(2)}deg) rotateY(${(px * 3).toFixed(2)}deg) translateY(-2px)`;
  });
  el.addEventListener('pointerleave', () => {
    el.style.transform = '';
  });
});
