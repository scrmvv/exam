const user = requireUser();

if (user) {
  const form = $('#applyForm');
  const result = $('#applyResult');
  const courseInput = $('#courseName');
  const params = new URLSearchParams(location.search);
  const courseFromUrl = params.get('course');

  if (courseFromUrl && courseInput) {
    courseInput.value = courseFromUrl;
  }

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());

    if (!data.courseName.trim() || !data.startDate || !data.payment) {
      setNotice(result, 'Заполните название курса, дату начала и способ оплаты.');
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
    setNotice(result, 'Заявка отправлена. Статус заявки: «Новая».', 'success');
    form.reset();
    setTimeout(() => location.href = 'applications.html', 900);
  });
}
