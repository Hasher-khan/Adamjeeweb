const fs = require('fs');
const path = require('path');
const firebase = require('firebase/compat/app');
require('firebase/compat/firestore');

const firebaseConfig = {
    apiKey: 'AIzaSyAPSoZ02Mps3zFHpu2qfDi0tGAzCq3HXSs',
    authDomain: 'adamjeeweb-7fa37.firebaseapp.com',
    projectId: 'adamjeeweb-7fa37',
    storageBucket: 'adamjeeweb-7fa37.firebasestorage.app',
    messagingSenderId: '850106874324',
    appId: '1:850106874324:web:f010fea970c8326fe47e41',
    measurementId: 'G-00EPGBMZ8N'
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const dataFile = path.join(__dirname, 'backend', 'data.json');
if (!fs.existsSync(dataFile)) {
    console.error('backend/data.json not found — nothing to seed.');
    process.exit(1);
}
const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

async function seed() {
    let count = 0;
    try {
        const cmsDocs = ['admissions', 'faculty', 'timetable', 'settings'];
        for (const key of cmsDocs) {
            if (data[key]) {
                await db.collection('cms').doc(key).set({
                    ...data[key],
                    updatedAt: new Date().toISOString()
                });
                console.log(`Queued cms/${key}`);
                count++;
            }
        }
        
        const apps = Array.isArray(data.student_applications) ? data.student_applications : [];
        for (const app of apps) {
            const id = app.id || `App-${Date.now()}-${Math.floor(Math.random()*1000)}`;
            await db.collection('studentApplications').doc(id).set({
                ...app,
                id,
                submittedAt: new Date().toISOString()
            });
            console.log(`Queued studentApplications/${id}`);
            count++;
        }
        console.log(`\n✅ Seeding complete. Added ${count} documents.`);
    } catch (e) {
        console.error('Seeding failed:', e);
    }
    process.exit(0);
}

seed();
