(function () {
  const pages = [
    ['Dashboard', 'index.html', 'ri-dashboard-line'],
    ['Admissions', 'admissions.html', 'ri-article-line'],
    ['Faculty', 'faculty.html', 'ri-team-line'],
    ['Timetable', 'timetable.html', 'ri-calendar-todo-line']
  ];

  function init() {
    if (document.getElementById('admin-mobile-menu')) return;

    const currentPage = location.pathname.split('/').pop() || 'index.html';
    const overlay = document.createElement('div');
    overlay.className = 'admin-mobile-overlay';

    const menu = document.createElement('aside');
    menu.id = 'admin-mobile-menu';
    menu.className = 'admin-mobile-menu';
    menu.setAttribute('aria-label', 'Admin navigation');
    menu.innerHTML = `
      <div class="admin-mobile-menu__header">
        <strong>Adamjee CMS</strong>
        <button type="button" aria-label="Close navigation">&times;</button>
      </div>
      <nav>${pages.map(([label, href, icon]) => `<a href="${href}"${currentPage === href ? ' aria-current="page"' : ''}><i class="${icon}"></i>${label}</a>`).join('')}</nav>`;

    let trigger = document.querySelector('[data-admin-mobile-toggle]');
    if (!trigger) {
      trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.className = 'admin-mobile-trigger';
      trigger.innerHTML = '<i class="ri-menu-2-line"></i>';
      document.body.append(trigger);
    }
    trigger.type = 'button';
    trigger.setAttribute('aria-label', 'Open navigation');
    trigger.setAttribute('aria-controls', menu.id);
    trigger.setAttribute('aria-expanded', 'false');

    const closeButton = menu.querySelector('button');
    const isOpen = () => menu.classList.contains('is-open');
    const close = () => {
      menu.classList.remove('is-open');
      overlay.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
    };
    const open = () => {
      menu.classList.add('is-open');
      overlay.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
    };

    document.body.append(overlay, menu);
    trigger.addEventListener('click', () => isOpen() ? close() : open());
    closeButton.addEventListener('click', close);
    overlay.addEventListener('click', close);
    menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') close();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
}());
