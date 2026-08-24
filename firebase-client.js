import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js';

const config = window.FIREBASE_CONFIG || {};
export const firebaseConfigured = ['apiKey', 'authDomain', 'projectId', 'appId'].every((key) => Boolean(config[key]));

let services = null;
export function getFirebaseServices() {
    if (!firebaseConfigured) throw new Error('Firebase is not configured.');
    if (!services) {
        const app = initializeApp(config);
        services = { auth: getAuth(app), db: getFirestore(app) };
    }
    return services;
}
