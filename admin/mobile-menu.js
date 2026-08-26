(function () {
  function init() {
    const page = location.pathname.split('/').pop() || 'index.html';
    const items = [
      ['Dashboard', 'index.html'],
      ['Admissions', 'admissions.html'],
      ['Faculty', 'faculty.html'],
      ['Timetable', 'timetable.html'],
      ['Student Forms', 'student-applications.html'],
      ['Settings', 'settings.html']
    ];
    const overlay = document.createElement('div');
    overlay.className = 'admin-mobile-overlay';
    overlay.setAttribute('aria-hidden', 'true');

    const panel = document.createElement('aside');
    panel.className = 'admin-mobile-menu';
    panel.setAttribute('aria-label', 'Admin navigation');
    panel.innerHTML = `<header><strong>Adamjee CMS</strong><button type="button" aria-label="Close menu">&times;</button></header><nav>${items.map(([label, href]) => `<a href="${href}"${page === href ? ' aria-current="page"' : ''}>${label}</a>`).join('')}</nav>`;

    // Use the hamburger already present in a page header.  Older pages without
    // one receive the same control as a fallback.
    let trigger = document.querySelector('[data-admin-mobile-toggle]');
    if (!trigger) {
      trigger = document.createElement('button');
      trigger.className = 'admin-mobile-trigger';
      trigger.type = 'button';
      trigger.innerHTML = '&#9776;';
      document.body.append(trigger);
    }
    trigger.type = 'button';
    trigger.setAttribute('aria-label', 'Open navigation');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', 'admin-mobile-menu');
    panel.id = 'admin-mobile-menu';

    const closeButton = panel.querySelector('button');
    const close = () => {
      panel.classList.remove('is-open');
      overlay.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.focus();
    };
    const open = () => {
      panel.classList.add('is-open');
      overlay.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      closeButton.focus();
    };

    document.body.append(overlay, panel);
    trigger.addEventListener('click', () => {
      if (panel.classList.contains('is-open')) close();
      else open();
    });
    overlay.addEventListener('click', close);
    closeButton.addEventListener('click', close);
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && panel.classList.contains('is-open')) close();
    });
    document.querySelector('main header')?.classList.add('admin-mobile-top-space');
  }

  document.addEventListener('DOMContentLoaded', init);
}());
