const form = $('#loginForm');
const result = $('#loginResult');

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  setNotice(result);

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
    setNotice(result, 'Логин или пароль введены неверно. Проверьте данные и попробуйте еще раз.');
    return;
  }

  setAdminSession(false);
  setCurrentUser(user.login);
  location.href = 'applications.html';
});
