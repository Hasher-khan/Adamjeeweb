(function () {
  const page = location.pathname.split('/').pop() || 'index.html';
  const links = [
    ['Home', 'index.html'], ['Programs', 'timetable.html'], ['Faculty', 'faculty.html'],
    ['Admissions', 'admissions.html']
  ];

  function closeMenu() {
    document.querySelector('.mobile-site-menu')?.classList.remove('is-open');
    document.querySelector('.mobile-site-backdrop')?.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  function openMenu() {
    document.querySelector('.mobile-site-menu')?.classList.add('is-open');
    document.querySelector('.mobile-site-backdrop')?.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function showResults() {
    closeMenu();
    const modal = document.getElementById('comingSoonModal');
    if (modal) { modal.classList.remove('hidden'); modal.classList.add('flex'); }
  }
  function removeLegacyFacultyMenu() {
    const menu = document.getElementById('mobileNav');
    if (!menu) return false;
    // Faculty originally had a separate mobile menu, so remove it and use the
    // shared navigation bar to keep every public page consistent.
    menu.remove();
    document.getElementById('menuToggle')?.closest('.md\\:hidden')?.remove();
    return false;
  }
  function buildMenu() {
    removeLegacyFacultyMenu();
    const active = links.map(([label, href]) => `<a href="${href}"${page === href ? ' aria-current="page"' : ''}>${label}</a>`).join('');
    const header = document.createElement('header');
    header.className = 'mobile-site-header';
    header.innerHTML = '<a class="mobile-site-brand" href="index.html"><img class="mobile-site-brand-logo" src="images/adamjee-logo.png" alt="Adamjee Coaching logo"><span class="mobile-site-brand-copy">Adamjee Coaching<small>Maymar Campus</small></span></a><button type="button" class="mobile-site-menu-button" aria-label="Open menu">&#9776; Menu</button>';
    const tabs = document.createElement('nav');
    tabs.className = 'mobile-site-tabs';
    tabs.setAttribute('aria-label', 'Primary navigation');
    const tabLinks = links.slice(0, 3).map(([label, href]) => `<a href="${href}"${page === href ? ' aria-current="page"' : ''}>${label}</a>`).join('') + '<button type="button" data-tab-results>Results</button>' + links.slice(3).map(([label, href]) => `<a href="${href}"${page === href ? ' aria-current="page"' : ''}>${label}</a>`).join('');
    tabs.innerHTML = tabLinks;
    const menu = document.createElement('aside');
    menu.className = 'mobile-site-menu';
    menu.innerHTML = `<div class="mobile-site-menu-head"><strong>Navigation</strong><button type="button" class="mobile-site-close" aria-label="Close menu">&times;</button></div><nav class="mobile-site-links">${active}<button type="button" data-results>Results <span style="margin-left:auto">Soon</span></button></nav><div class="mobile-site-actions"><a href="student-login.html">Student Login</a><a href="admin/index.html">Admin Panel</a></div>`;
    const backdrop = document.createElement('button');
    backdrop.type = 'button'; backdrop.className = 'mobile-site-backdrop'; backdrop.setAttribute('aria-label', 'Close menu');
    document.body.prepend(menu); document.body.prepend(backdrop); document.body.prepend(tabs); document.body.prepend(header);
    header.querySelector('button').addEventListener('click', openMenu);
    menu.querySelector('.mobile-site-close').addEventListener('click', closeMenu);
    menu.querySelector('[data-results]').addEventListener('click', showResults);
    tabs.querySelector('[data-tab-results]').addEventListener('click', showResults);
    backdrop.addEventListener('click', closeMenu);
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
  }
  document.addEventListener('DOMContentLoaded', buildMenu);
}());
