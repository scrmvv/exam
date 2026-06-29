document.addEventListener('DOMContentLoaded', () => {
  const user = getCurrentUser();
  if (!user) {
    location.href = 'login.html';
    return;
  }

  const form = document.querySelector('#applyForm');
  const result = document.querySelector('#applyResult');
  const courseInput = document.querySelector('#courseName');
  const params = new URLSearchParams(location.search);
  const courseFromUrl = params.get('course');

  if (courseFromUrl && courseInput) {
    courseInput.value = courseFromUrl;
  }

  function setResult(text, type) {
    result.textContent = text;
    result.className = `notice ${type === 'success' ? 'notice-success' : 'notice-error'}`;
  }

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());

    if (!data.courseName.trim() || !data.startDate || !data.payment) {
      setResult('Заполните название курса, дату начала и способ оплаты.', 'error');
      return;
    }

    const applications = getApplications();
    applications.unshift({
      id: makeId(),
      login: user.login,
      userName: user.name,
      courseName: data.courseName.trim(),
      startDate: data.startDate,
      payment: data.payment,
      status: 'Новая',
      createdAt: new Date().toISOString().slice(0, 10),
      review: ''
    });

    saveApplications(applications);
    setResult('Заявка отправлена. Статус заявки: «Новая».', 'success');
    form.reset();
    setTimeout(() => location.href = 'applications.html', 900);
  });
});
