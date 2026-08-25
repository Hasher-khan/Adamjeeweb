// cms-client.js — Public Firestore reader for faculty, timetable, admissions pages.
// Requires firebase-config.js, firebase-app-compat.js, firebase-firestore-compat.js
// to be loaded as <script> tags BEFORE this file.

(function () {
    if (!firebase.apps.length) {
        firebase.initializeApp(window.FIREBASE_CONFIG);
    }
    const db = firebase.firestore();
    try { db.settings({ ignoreUndefinedProperties: true }); } catch (e) { /* already configured */ }

    window.CMS_LAST_ERROR = '';
    function explain(error) {
        const text = String(error && (error.message || error) || '');
        const code = String(error && error.code || '');
        if (/SERVICE_DISABLED|has not been used|Cloud Firestore API/i.test(text)) {
            return 'The live CMS database (Cloud Firestore) is not enabled for this Firebase project.';
        }
        if (code === 'permission-denied' || /permission/i.test(text)) {
            return 'Firestore security rules are blocking this page.';
        }
        return text;
    }

    /**
     * Fetch a CMS document from Firestore.
     * Returns the document data object, or null on error.
     * @param {string} docId  e.g. 'faculty' | 'timetable' | 'admissions'
     */
    window.fetchCmsData = async function (docId) {
        try {
            const snap = await db.collection('cms').doc(docId).get();
            window.CMS_LAST_ERROR = '';
            return snap.exists ? snap.data() : null;
        } catch (e) {
            window.CMS_LAST_ERROR = explain(e);
            console.error('CMS fetch error:', e);
            return null;
        }
    };

    /**
     * Submit a student application to Firestore.
     * Returns { success: true } or { success: false, message: string }
     * @param {object} formData
     */
    window.submitStudentApplication = async function (formData) {
        try {
            const id = `App-${Date.now()}`;
            await db.collection('studentApplications').doc(id).set({
                studentName: String(formData.studentName || '').trim(),
                fatherName: String(formData.fatherName || '').trim(),
                phone: String(formData.phone || '').trim(),
                prevSchool: String(formData.prevSchool || '').trim(),
                currentClass: String(formData.currentClass || '').trim(),
                program: String(formData.program || '').trim(),
                message: String(formData.message || '').trim(),
                studentUid: String(formData.studentUid || '').trim(),
                studentEmail: String(formData.studentEmail || '').trim(),
                id,
                status: 'Pending',
                submittedAt: new Date().toISOString()
            });
            window.CMS_LAST_ERROR = '';
            return { success: true, message: 'Application submitted successfully!' };
        } catch (e) {
            window.CMS_LAST_ERROR = explain(e);
            console.error('Application submit error:', e);
            return { success: false, message: window.CMS_LAST_ERROR || e.message };
        }
    };
})();
