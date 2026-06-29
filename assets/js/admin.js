document.addEventListener('DOMContentLoaded', () => {
  const loginBox = document.querySelector('#adminLoginBox');
  const panel = document.querySelector('#adminPanel');
  const form = document.querySelector('#adminLoginForm');
  const result = document.querySelector('#adminLoginResult');
  const table = document.querySelector('#adminTable');
  const counters = document.querySelector('#adminCounters');
  const searchInput = document.querySelector('#adminSearch');
  const logoutButton = document.querySelector('#adminLogout');

  function toggleView() {
    const active = isAdminActive();
    loginBox.style.display = active ? 'none' : 'block';
    panel.style.display = active ? 'block' : 'none';
    if (active) render();
  }

  function countStatus(applications, status) {
    return applications.filter((app) => app.status === status).length;
  }

  function renderCounters(applications) {
    counters.innerHTML = `
      <div class="course-chip">Всего заявок<br><strong class="text-2xl">${applications.length}</strong></div>
      <div class="course-chip">Новые<br><strong class="text-2xl">${countStatus(applications, 'Новая')}</strong></div>
      <div class="course-chip">Идет обучение<br><strong class="text-2xl">${countStatus(applications, 'Идет обучение')}</strong></div>
      <div class="course-chip">Завершено<br><strong class="text-2xl">${countStatus(applications, 'Обучение завершено')}</strong></div>
    `;
  }

  function render() {
    const applications = getApplications();
    const query = (searchInput.value || '').trim().toLowerCase();
    const filtered = applications.filter((app) => {
      const text = `${app.userName} ${app.login} ${app.courseName} ${app.status}`.toLowerCase();
      return text.includes(query);
    });

    renderCounters(applications);
    table.innerHTML = `
      <div class="table-row table-head">
        <div>Пользователь</div>
        <div>Курс</div>
        <div>Дата</div>
        <div>Статус</div>
      </div>
    `;

    filtered.forEach((app) => {
      const row = document.createElement('div');
      row.className = 'table-row';
      row.innerHTML = `
        <div>
          <strong>${app.userName}</strong>
          <p class="text-sm text-neutral-500">${app.login}</p>
        </div>
        <div>
          <strong>${app.courseName}</strong>
          <p class="text-sm text-neutral-500">Оплата: ${app.payment}</p>
          ${app.review ? `<p class="mt-2 rounded-2xl bg-white/80 p-3 text-sm text-neutral-700">Отзыв: ${app.review}</p>` : ''}
        </div>
        <div>${formatDate(app.startDate)}</div>
        <div>
          <select class="form-select" data-status-select="${app.id}">
            ${STATUS_LIST.map((status) => `<option value="${status}" ${status === app.status ? 'selected' : ''}>${status}</option>`).join('')}
          </select>
        </div>
      `;
      table.append(row);
    });

    if (!filtered.length) {
      const row = document.createElement('div');
      row.className = 'p-6 text-center text-neutral-500';
      row.textContent = 'Заявки по этому запросу не найдены.';
      table.append(row);
    }
  }

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    result.textContent = '';
    result.className = '';

    const data = Object.fromEntries(new FormData(form).entries());
    if (data.login.trim() === 'Admin' && data.password === 'KorokNET') {
      setAdminSession(true);
      toggleView();
      return;
    }

    result.textContent = 'Неверный логин или пароль администратора.';
    result.className = 'notice notice-error';
  });

  table?.addEventListener('change', (event) => {
    const select = event.target.closest('[data-status-select]');
    if (!select) return;

    const applications = getApplications();
    const target = applications.find((app) => app.id === select.dataset.statusSelect);
    if (target) {
      target.status = select.value;
      saveApplications(applications);
      render();
    }
  });

  searchInput?.addEventListener('input', render);

  logoutButton?.addEventListener('click', () => {
    setAdminSession(false);
    toggleView();
  });

  toggleView();
});
