document.addEventListener('DOMContentLoaded', () => {
  const user = getCurrentUser();
  if (!user) {
    location.href = 'login.html';
    return;
  }

  const list = document.querySelector('#applicationsList');
  const empty = document.querySelector('#emptyApplications');

  function render() {
    const applications = getApplications().filter((item) => item.login === user.login);
    list.innerHTML = '';
    empty.style.display = applications.length ? 'none' : 'block';

    applications.forEach((app) => {
      const card = document.createElement('article');
      card.className = 'paper-card p-5 md:p-6';
      card.innerHTML = `
        <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <span class="status-badge ${statusClass(app.status)}">${app.status}</span>
            <h3 class="mt-3 text-2xl font-bold">${app.courseName}</h3>
            <p class="mt-2 text-sm text-slate-500">Дата создания заявки: ${formatDate(app.createdAt)}</p>
          </div>
          <a class="btn btn-soft" href="apply.html?course=${encodeURIComponent(app.courseName)}">Подать похожую заявку</a>
        </div>

        <div class="mt-5 grid gap-3 md:grid-cols-3">
          <div class="course-chip"><span class="text-slate-500">Дата начала:</span><br>${formatDate(app.startDate)}</div>
          <div class="course-chip"><span class="text-slate-500">Способ оплаты:</span><br>${app.payment}</div>
          <div class="course-chip"><span class="text-slate-500">Номер заявки:</span><br>${app.id.replace('app-', '#')}</div>
        </div>

        <div class="muted-box mt-5 p-4">
          <label class="form-label" for="review-${app.id}">Отзыв о качестве образовательных услуг</label>
          <textarea class="form-textarea" id="review-${app.id}" placeholder="Напишите короткий отзыв">${app.review || ''}</textarea>
          <div class="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p class="text-sm text-slate-500">Отзыв можно редактировать и сохранять повторно.</p>
            <button class="btn btn-primary" type="button" data-save-review="${app.id}">Сохранить отзыв</button>
          </div>
        </div>
      `;
      list.append(card);
    });
  }

  list.addEventListener('click', (event) => {
    const button = event.target.closest('[data-save-review]');
    if (!button) return;

    const appId = button.dataset.saveReview;
    const textarea = document.querySelector(`#review-${appId}`);
    const applications = getApplications();
    const target = applications.find((item) => item.id === appId);

    if (target) {
      target.review = textarea.value.trim();
      saveApplications(applications);
      button.textContent = 'Отзыв сохранен';
      setTimeout(() => {
        button.textContent = 'Сохранить отзыв';
      }, 1200);
    }
  });

  render();
});
