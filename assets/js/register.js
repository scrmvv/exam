document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#registerForm');
  const result = document.querySelector('#registerResult');
  const phoneInput = document.querySelector('#phone');

  phoneInput?.addEventListener('input', () => {
    let digits = phoneInput.value.replace(/\D/g, '');
    if (digits.startsWith('7')) digits = '8' + digits.slice(1);
    if (!digits.startsWith('8')) digits = '8' + digits;
    digits = digits.slice(0, 11);

    let value = '8';
    if (digits.length > 1) value += '(' + digits.slice(1, 4);
    if (digits.length >= 4) value += ')';
    if (digits.length > 4) value += digits.slice(4, 7);
    if (digits.length > 7) value += '-' + digits.slice(7, 9);
    if (digits.length > 9) value += '-' + digits.slice(9, 11);
    phoneInput.value = value;
  });

  function showError(fieldName, text) {
    const error = document.querySelector(`[data-error="${fieldName}"]`);
    if (error) error.textContent = text;
  }

  function clearErrors() {
    document.querySelectorAll('[data-error]').forEach((item) => item.textContent = '');
    result.textContent = '';
    result.className = '';
  }

  function setResult(text, type) {
    result.textContent = text;
    result.className = `notice ${type === 'success' ? 'notice-success' : 'notice-error'}`;
  }

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    clearErrors();

    const data = Object.fromEntries(new FormData(form).entries());
    const users = getUsers();
    let isValid = true;

    if (!/^[A-Za-z0-9]{6,}$/.test(data.login.trim())) {
      showError('login', 'Логин: латиница и цифры, минимум 6 символов.');
      isValid = false;
    }

    if (users.some((user) => user.login.toLowerCase() === data.login.trim().toLowerCase())) {
      showError('login', 'Такой логин уже занят.');
      isValid = false;
    }

    if (data.password.length < 8) {
      showError('password', 'Пароль должен быть не короче 8 символов.');
      isValid = false;
    }

    if (!/^[А-Яа-яЁё\s]+$/.test(data.name.trim())) {
      showError('name', 'ФИО вводится кириллицей, можно использовать пробелы.');
      isValid = false;
    }

    if (!/^8\(\d{3}\)\d{3}-\d{2}-\d{2}$/.test(data.phone.trim())) {
      showError('phone', 'Телефон нужен в формате 8(XXX)XXX-XX-XX.');
      isValid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      showError('email', 'Введите корректную электронную почту.');
      isValid = false;
    }

    if (!isValid) {
      setResult('Проверьте поля формы. Все поля обязательны.', 'error');
      return;
    }

    users.push({
      login: data.login.trim(),
      password: data.password,
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email.trim()
    });

    saveUsers(users);
    setCurrentUser(data.login.trim());
    setResult('Регистрация прошла успешно. Сейчас откроем страницу заявок.', 'success');
    setTimeout(() => location.href = 'applications.html', 900);
  });
});
