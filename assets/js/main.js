const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const currentUser = getCurrentUser();

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
