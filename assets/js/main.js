document.addEventListener('DOMContentLoaded', () => {
  const currentPage = document.body.dataset.page;
  const links = document.querySelectorAll('[data-nav]');

  links.forEach((link) => {
    if (link.dataset.nav === currentPage) {
      link.classList.add('active');
    }
  });

  const currentUser = getCurrentUser();
  const userPlaces = document.querySelectorAll('[data-current-user]');
  userPlaces.forEach((place) => {
    place.textContent = currentUser ? currentUser.name : 'гость';
  });

  document.querySelectorAll('[data-auth-only]').forEach((item) => {
    item.style.display = currentUser ? '' : 'none';
  });

  document.querySelectorAll('[data-guest-only]').forEach((item) => {
    item.style.display = currentUser ? 'none' : '';
  });

  document.querySelectorAll('[data-logout]').forEach((button) => {
    button.addEventListener('click', () => {
      clearCurrentUser();
      location.href = 'index.html';
    });
  });

  const menuButton = document.querySelector('[data-menu-button]');
  const mobilePanel = document.querySelector('[data-mobile-panel]');
  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', () => {
      mobilePanel.classList.toggle('open');
    });
  }
});
