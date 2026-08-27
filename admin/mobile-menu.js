(function () {
  function init() {
    if (document.getElementById('admin-mobile-menu')) return;
    const page = location.pathname.split('/').pop() || 'index.html';
    const adminBase = location.pathname.endsWith('/')
      ? location.pathname
      : `${location.pathname.slice(0, location.pathname.lastIndexOf('/') + 1) || `${location.pathname}/`}`;
    const items = [
      ['Dashboard', 'index.html'],
      ['Admissions', 'admissions.html'],
      ['Faculty', 'faculty.html'],
      ['Timetable', 'timetable.html'],
      ['Student Forms', 'student-applications.html'],
      ['Settings', 'settings.html']
    ];
    const quickItems = [
      ['New Admission', 'admissions.html#application-form'],
      ['Student Forms', 'student-applications.html'],
      ['Settings', 'settings.html']
    ];
    const overlay = document.createElement('div');
    overlay.className = 'admin-mobile-overlay';
    overlay.setAttribute('aria-hidden', 'true');

    const panel = document.createElement('aside');
    panel.className = 'admin-mobile-menu';
    panel.setAttribute('aria-label', 'Admin navigation');
    panel.innerHTML = `<header><strong>Adamjee CMS</strong><span><button type="button" data-admin-back aria-label="Go back">&#8592;</button><button type="button" data-admin-close aria-label="Close menu">&times;</button></span></header><p class="admin-mobile-menu__label">Menu</p><nav>${items.map(([label, href]) => `<a href="${adminBase}${href}"${page === href ? ' aria-current="page"' : ''}>${label}</a>`).join('')}</nav><p class="admin-mobile-menu__label">Quick Access</p><nav>${quickItems.map(([label, href]) => `<a href="${adminBase}${href}">${label}</a>`).join('')}</nav>`;

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

    const closeButton = panel.querySelector('[data-admin-close]');
    const backButton = panel.querySelector('[data-admin-back]');
    const setOpen = (open) => {
      panel.classList.toggle('is-open', open);
      overlay.classList.toggle('is-open', open);
      document.body.classList.toggle('admin-mobile-menu-open', open);
      overlay.setAttribute('aria-hidden', String(!open));
      trigger.setAttribute('aria-expanded', String(open));
    };
    const close = () => {
      setOpen(false);
      trigger.focus();
    };
    const open = () => {
      setOpen(true);
      closeButton.focus();
    };

    document.body.append(overlay, panel);
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      if (panel.classList.contains('is-open')) close();
      else open();
    });
    overlay.addEventListener('click', close);
    closeButton.addEventListener('click', close);
    backButton.addEventListener('click', () => {
      close();
      if (history.length > 1) history.back();
      else window.location.href = `${adminBase}index.html`;
    });
    panel.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && panel.classList.contains('is-open')) close();
    });
    document.querySelector('main header')?.classList.add('admin-mobile-top-space');
  }

  // A mobile browser may restore this page from cache after DOMContentLoaded
  // has already fired. Initialise immediately in that case as well.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
}());
