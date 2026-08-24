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
  function improveExistingFacultyMenu() {
    const menu = document.getElementById('mobileNav');
    if (!menu) return false;
    const map = { Home: 'index.html', Programs: 'timetable.html', Admissions: 'admissions.html' };
    menu.querySelectorAll('a').forEach((link) => { const href = map[link.textContent.trim()]; if (href) link.href = href; });
    const toggle = document.getElementById('menuToggle');
    const backdrop = document.createElement('button');
    backdrop.type = 'button'; backdrop.className = 'mobile-site-backdrop'; backdrop.setAttribute('aria-label', 'Close menu');
    document.body.append(backdrop);
    toggle?.addEventListener('click', () => { menu.classList.toggle('-translate-x-full'); backdrop.classList.toggle('is-open'); });
    backdrop.addEventListener('click', () => { menu.classList.add('-translate-x-full'); backdrop.classList.remove('is-open'); });
    return true;
  }
  function buildMenu() {
    if (improveExistingFacultyMenu()) return;
    const active = links.map(([label, href]) => `<a href="${href}"${page === href ? ' aria-current="page"' : ''}>${label}</a>`).join('');
    const header = document.createElement('header');
    header.className = 'mobile-site-header';
    header.innerHTML = '<a class="mobile-site-brand" href="index.html">Adamjee Coaching<small>Maymar Campus</small></a><button type="button" class="mobile-site-menu-button" aria-label="Open menu">☰ Menu</button>';
    const tabs = document.createElement('nav');
    tabs.className = 'mobile-site-tabs';
    tabs.setAttribute('aria-label', 'Primary navigation');
    const tabLinks = links.slice(0, 3).map(([label, href]) => `<a href="${href}"${page === href ? ' aria-current="page"' : ''}>${label}</a>`).join('') + '<button type="button" data-tab-results>Results</button>' + links.slice(3).map(([label, href]) => `<a href="${href}"${page === href ? ' aria-current="page"' : ''}>${label}</a>`).join('');
    tabs.innerHTML = tabLinks;
    const menu = document.createElement('aside');
    menu.className = 'mobile-site-menu';
    menu.innerHTML = `<div class="mobile-site-menu-head"><strong>Navigation</strong><button type="button" class="mobile-site-close" aria-label="Close menu">×</button></div><nav class="mobile-site-links">${active}<button type="button" data-results>Results <span style="margin-left:auto">Soon</span></button></nav><div class="mobile-site-actions"><a href="student-login.html">Student Login</a><a href="admin/index.html">Admin Panel</a></div>`;
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
