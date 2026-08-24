// admin/js/auth.js
(function() {
    const authenticated = sessionStorage.getItem('admin_authenticated');
    if (authenticated !== 'true') {
        // Redirect to login page
        window.location.href = 'login.html';
    }
})();
