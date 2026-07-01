const slides = $$('.slide');
const dots = $$('.slide-dot');
const nextButton = $('[data-next-slide]');
const prevButton = $('[data-prev-slide]');
const searchForm = $('[data-course-search]');
let active = 0;
let timer;

function showSlide(index) {
  active = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => slide.classList.toggle('active', slideIndex === active));
  dots.forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === active));
}

function startAutoSlide() {
  clearInterval(timer);
  timer = setInterval(() => showSlide(active + 1), 4500);
}

if (slides.length) {
  showSlide(0);
  startAutoSlide();
}

nextButton?.addEventListener('click', () => {
  showSlide(active + 1);
  startAutoSlide();
});

prevButton?.addEventListener('click', () => {
  showSlide(active - 1);
  startAutoSlide();
});

dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    showSlide(index);
    startAutoSlide();
  });
});

searchForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const query = new FormData(searchForm).get('course')?.trim();
  location.href = query ? `apply.html?course=${encodeURIComponent(query)}` : 'apply.html';
});
