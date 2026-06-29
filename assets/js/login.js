document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#loginForm');
  const result = document.querySelector('#loginResult');

  function setResult(text) {
    result.textContent = text;
    result.className = 'notice notice-error';
  }

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    result.textContent = '';
    result.className = '';

    const data = Object.fromEntries(new FormData(form).entries());
    const login = data.login.trim();
    const password = data.password;

    if (login === 'Admin' && password === 'KorokNET') {
      clearCurrentUser();
      setAdminSession(true);
      location.href = 'admin.html';
      return;
    }

    const user = getUsers().find((item) => item.login === login && item.password === password);

    if (!user) {
      setResult('Логин или пароль введены неверно. Проверьте данные и попробуйте еще раз.');
      return;
    }

    setAdminSession(false);
    setCurrentUser(user.login);
    location.href = 'applications.html';
  });
});
