import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js';
import { firebaseConfigured, getFirebaseServices } from './firebase-client.js';

if (firebaseConfigured) {
    document.documentElement.classList.add('opacity-0');
    const { auth } = getFirebaseServices();
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            const next = `${window.location.pathname.split('/').pop() || 'index.html'}${window.location.hash}`;
            window.location.replace(`student-login.html?next=${encodeURIComponent(next)}`);
            return;
        }
        document.documentElement.classList.remove('opacity-0');
    });
}
