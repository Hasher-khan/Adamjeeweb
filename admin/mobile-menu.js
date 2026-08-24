(function () {
  function init() {
    const page = location.pathname.split('/').pop() || 'index.html';
    const items = [['Dashboard', 'index.html'], ['Admissions', 'admissions.html'], ['Faculty', 'faculty.html'], ['Timetable', 'timetable.html'], ['Student Forms', 'student-applications.html'], ['Settings', 'settings.html']];
    const overlay = document.createElement('div'); overlay.className = 'admin-mobile-overlay';
    const panel = document.createElement('aside'); panel.className = 'admin-mobile-menu';
    panel.innerHTML = `<header><strong>Adamjee CMS</strong><button type="button" aria-label="Close menu">×</button></header><nav>${items.map(([label, href]) => `<a href="${href}"${page === href ? ' aria-current="page"' : ''}>${label}</a>`).join('')}</nav>`;
    const trigger = document.createElement('button'); trigger.className = 'admin-mobile-trigger'; trigger.type = 'button'; trigger.setAttribute('aria-label', 'Open navigation'); trigger.innerHTML = '☰';
    const close = () => { panel.classList.remove('is-open'); overlay.classList.remove('is-open'); };
    const open = () => { panel.classList.add('is-open'); overlay.classList.add('is-open'); };
    document.body.append(overlay, panel, trigger);
    trigger.addEventListener('click', open); overlay.addEventListener('click', close); panel.querySelector('button').addEventListener('click', close);
    document.querySelector('main header')?.classList.add('admin-mobile-top-space');
  }
  document.addEventListener('DOMContentLoaded', init);
}());
