(() => {
  'use strict';

  const THEME_KEY = 'portfolio-theme';
  const MOBILE_QUERY = '(max-width: 768px)';
  const DESKTOP_QUERY = '(min-width: 769px)';

  /* ================= Тема ================= */
  const themeToggle = document.getElementById('themeToggle');

  function readTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (error) {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (error) { /* localStorage недоступен */ }
  }

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');

    if (!themeToggle) return;

    const label = isDark ? 'Включить светлую тему' : 'Включить тёмную тему';
    const text = themeToggle.querySelector('.theme-toggle__text');

    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute('aria-label', label);
    themeToggle.title = label;

    if (text) text.textContent = isDark ? 'Светлая тема' : 'Тёмная тема';
  }

  applyTheme(readTheme() === 'dark' ? 'dark' : 'light');

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      saveTheme(next);
    });
  }

  /* ================= Мобильное меню ================= */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('siteNav');

  function setMenu(open, focusBurger = false) {
    if (!nav || !burger) return;

    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');

    if (!open && focusBurger) burger.focus();
  }

  if (burger) {
    burger.addEventListener('click', () => {
      const isOpen = burger.getAttribute('aria-expanded') === 'true';
      setMenu(!isOpen);
    });
  }

  if (nav) {
    nav.addEventListener('click', (event) => {
      const link = event.target.closest('a');
      if (link && window.matchMedia(MOBILE_QUERY).matches) {
        setMenu(false);
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && burger && burger.getAttribute('aria-expanded') === 'true') {
      setMenu(false, true);
    }
  });

  const desktopQuery = window.matchMedia(DESKTOP_QUERY);
  desktopQuery.addEventListener('change', (event) => {
    if (event.matches) setMenu(false);
  });

  /* ================= Фильтр работ ================= */
  const filterButtons = Array.from(document.querySelectorAll('[data-filter]'));
  const projectCards = Array.from(document.querySelectorAll('[data-category]'));
  const emptyMessage = document.getElementById('projectsEmpty');

  function applyFilter(category) {
    let visibleCount = 0;

    projectCards.forEach((card) => {
      const show = category === 'all' || card.dataset.category === category;
      card.hidden = !show;
      if (show) visibleCount += 1;
    });

    filterButtons.forEach((button) => {
      const isActive = button.dataset.filter === category;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    if (emptyMessage) emptyMessage.hidden = visibleCount > 0;
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => applyFilter(button.dataset.filter));
  });

  if (filterButtons.length) applyFilter('all');

  /* ================= Форма заказа ================= */
  const orderForm = document.getElementById('orderForm');
  const formStatus = document.getElementById('formStatus');

  if (orderForm) {
    orderForm.addEventListener('submit', (event) => {
      event.preventDefault();

      if (formStatus) {
        formStatus.hidden = false;
        formStatus.textContent = 'Спасибо! Форма заполнена. (Это демо-версия: письмо не отправлено, так как нет сервера).';
      }
      
      orderForm.reset();

      setTimeout(() => {
        if (formStatus) formStatus.hidden = true;
      }, 5000);
    });
  }
})();