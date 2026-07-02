const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const currentUser = getCurrentUser();

const menuToggle = $('[data-menu-toggle]');
const mobileNav = $('[data-mobile-nav]');

function closeMobileMenu() {
  if (!menuToggle || !mobileNav) return;
  mobileNav.classList.remove('is-open');
  menuToggle.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
}

if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('is-open');
    menuToggle.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mobileNav.querySelectorAll('a, button').forEach((item) => {
    item.addEventListener('click', closeMobileMenu);
  });

  document.addEventListener('click', (event) => {
    if (!mobileNav.classList.contains('is-open')) return;
    if (!mobileNav.contains(event.target) && event.target !== menuToggle) {
      closeMobileMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMobileMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMobileMenu();
  });
}

document.documentElement.classList.toggle('user-active', !!currentUser);

$$('[data-current-user]').forEach((place) => {
  place.textContent = currentUser ? currentUser.name : 'гость';
});

$$('[data-guest-link]').forEach((link) => {
  link.style.display = currentUser ? 'none' : '';
});

$$('[data-user-link]').forEach((link) => {
  link.style.display = currentUser ? '' : 'none';
});

$$('[data-logout]').forEach((button) => {
  button.addEventListener('click', () => {
    clearCurrentUser();
    location.href = 'index.html';
  });
});

function setNotice(element, text = '', type = 'error') {
  if (!element) return;
  element.textContent = text;
  element.className = text ? `notice ${type === 'success' ? 'notice-success' : 'notice-error'}` : '';
}

function requireUser() {
  const user = getCurrentUser();
  if (!user) location.href = 'login.html';
  return user;
}
