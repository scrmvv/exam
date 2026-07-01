const STORAGE_KEYS = {
  users: 'korochki_users',
  applications: 'korochki_applications',
  session: 'korochki_session',
  adminSession: 'korochki_admin_session'
};

const STATUS_LIST = ['Новая', 'Идет обучение', 'Обучение завершено'];

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.warn('Ошибка чтения localStorage', error);
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function seedData() {
  if (!localStorage.getItem(STORAGE_KEYS.users)) {
    writeStorage(STORAGE_KEYS.users, [
      {
        login: 'user123',
        password: '123456',
        name: 'Иван Петров',
        phone: '8(917)111-22-33',
        email: 'user123@mail.ru'
      }
    ]);
  }

  if (!localStorage.getItem(STORAGE_KEYS.applications)) {
    writeStorage(STORAGE_KEYS.applications, [
      {
        id: 'app-1001',
        login: 'user123',
        userName: 'Иван Петров',
        courseName: 'Сметное дело для начинающих',
        startDate: '2026-07-15',
        payment: 'Перевод по номеру телефона',
        status: 'Новая',
        createdAt: '2026-06-20',
        review: ''
      },
      {
        id: 'app-1002',
        login: 'user123',
        userName: 'Иван Петров',
        courseName: 'Оператор 1С: первые шаги',
        startDate: '2026-07-22',
        payment: 'Наличными',
        status: 'Идет обучение',
        createdAt: '2026-06-21',
        review: 'Понравилось, что объясняют спокойно и без лишней теории.'
      },
      {
        id: 'app-1003',
        login: 'user123',
        userName: 'Иван Петров',
        courseName: 'Кадровое делопроизводство',
        startDate: '2026-08-03',
        payment: 'Перевод по номеру телефона',
        status: 'Обучение завершено',
        createdAt: '2026-06-22',
        review: ''
      }
    ]);
  }
}

const getUsers = () => readStorage(STORAGE_KEYS.users, []);
const saveUsers = (users) => writeStorage(STORAGE_KEYS.users, users);
const getApplications = () => readStorage(STORAGE_KEYS.applications, []);
const saveApplications = (applications) => writeStorage(STORAGE_KEYS.applications, applications);

function getCurrentUser() {
  const login = localStorage.getItem(STORAGE_KEYS.session);
  if (!login) return null;
  return getUsers().find((user) => user.login === login) || null;
}

const setCurrentUser = (login) => localStorage.setItem(STORAGE_KEYS.session, login);
const clearCurrentUser = () => localStorage.removeItem(STORAGE_KEYS.session);

function setAdminSession(value) {
  value
    ? localStorage.setItem(STORAGE_KEYS.adminSession, 'true')
    : localStorage.removeItem(STORAGE_KEYS.adminSession);
}

const isAdminActive = () => localStorage.getItem(STORAGE_KEYS.adminSession) === 'true';

function statusClass(status) {
  return {
    'Идет обучение': 'status-study',
    'Обучение завершено': 'status-done'
  }[status] || 'status-new';
}

function formatDate(value) {
  if (!value) return 'не указана';
  const date = new Date(value + 'T00:00:00');
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' });
}

const makeId = () => 'app-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

seedData();
