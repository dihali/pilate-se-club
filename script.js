/* ============================================
   PILATE-SE CLUB — Script
   ============================================ */

// === Hero word cycling ===
const words   = ['prioriza', 'cuida', 'movimenta', 'fortalece'];
let wordIndex = 0;
const wordEl  = document.getElementById('heroWord');

function enterWord() {
  wordEl.getBoundingClientRect(); // força reflow
  wordEl.style.transition = 'transform 0.8s ease, opacity 0.8s ease';
  wordEl.style.transform  = 'scaleX(1)';
  wordEl.style.opacity    = '1';
}

function showNext() {
  // SAÍDA: enrola da direita pra esquerda (0.6s)
  wordEl.style.transition = 'transform 0.6s ease, opacity 0.6s ease';
  wordEl.style.transform  = 'scaleX(0)';
  wordEl.style.opacity    = '0';

  setTimeout(() => {
    // Troca texto instantaneamente
    wordIndex = (wordIndex + 1) % words.length;
    wordEl.style.transition = 'none';
    wordEl.textContent      = words[wordIndex];
    wordEl.style.transform  = 'scaleX(0)';
    wordEl.style.opacity    = '0';

    // ENTRADA: desenrola da esquerda pra direita (0.8s)
    enterWord();

    // Agenda próxima troca: 0.8s (entrada) + 3s (exibição)
    setTimeout(showNext, 800 + 1200);
  }, 600);
}

// Página carrega → frase incompleta → 1s → primeira palavra entra
setTimeout(() => {
  wordEl.textContent = words[0];
  wordEl.style.transform = 'scaleX(0)';
  wordEl.style.opacity   = '0';
  enterWord();

  // Agenda o loop
  setTimeout(showNext, 800 + 1200);
}, 1000);

// === Nav scroll ===
const nav     = document.getElementById('nav');
const toggle  = document.getElementById('toggle');
const drawer  = document.getElementById('drawer');

window.addEventListener('scroll', () => {
  nav.classList.toggle('on', window.scrollY > 60);
}, { passive: true });

// === Menu mobile ===
toggle.addEventListener('click', () => {
  const open = drawer.classList.toggle('open');
  document.body.style.overflow = open ? 'hidden' : '';
  toggle.setAttribute('aria-expanded', open);
});

drawer.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// === Hero image load animation ===
const heroImg = document.getElementById('heroImg');
const activate = () => heroImg.classList.add('ready');
heroImg.complete ? activate() : heroImg.addEventListener('load', activate);

// === Card border draw ===
function drawBorder(card) {
  if (card.querySelector('.card-border-svg')) return;

  const isMetodo = card.classList.contains('metodo__card');
  const siblings = isMetodo
    ? [...document.querySelectorAll('.metodo__card')]
    : [...document.querySelectorAll('.servico')];
  const colDelay = (siblings.indexOf(card) % 3) * 0.2;

  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('class', 'card-border-svg');

  const w = card.offsetWidth;
  const h = card.offsetHeight;
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);

  const perimeter = 2 * (w + h);
  const rect = document.createElementNS(ns, 'rect');
  rect.setAttribute('x', '1');
  rect.setAttribute('y', '1');
  rect.setAttribute('width', String(w - 2));
  rect.setAttribute('height', String(h - 2));
  rect.style.stroke = '#8B1020';
  rect.style.strokeWidth = '2';
  rect.style.fill = 'none';
  rect.style.strokeDasharray = perimeter;
  rect.style.strokeDashoffset = perimeter;
  rect.style.animation = `draw-rect 1.2s ${colDelay}s ease-out forwards`;

  svg.appendChild(rect);
  card.insertBefore(svg, card.firstChild);
}

// === Scroll reveal ===
const revealEls = document.querySelectorAll('.rv, .rl, .rr');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('on');
      if (entry.target.classList.contains('metodo__card') || entry.target.classList.contains('servico')) {
        drawBorder(entry.target);
      }
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -56px 0px'
});

revealEls.forEach(el => observer.observe(el));

// === Smooth scroll para âncoras ===
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 72;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

