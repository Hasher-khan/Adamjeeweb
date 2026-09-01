// admin/js/api.js — Firebase Firestore powered CMS API
// Requires firebase-config.js, firebase-app-compat.js and firebase-firestore-compat.js
// to be loaded as <script> tags BEFORE this file.

(function () {
    // Initialize Firebase once
    if (!firebase.apps.length) {
        firebase.initializeApp(window.FIREBASE_CONFIG);
    }
    const db = firebase.firestore();
    try { db.settings({ ignoreUndefinedProperties: true }); } catch (e) { /* already configured */ }

    window.CMS_LAST_ERROR = '';
    window.explainCmsError = function (error) {
        const text = String(error && (error.message || error) || '');
        const code = String(error && error.code || '');
        if (/SERVICE_DISABLED|has not been used|Cloud Firestore API/i.test(text) || code === 'unavailable') {
            return 'Firestore is not created in this Firebase project. Open Firebase Console → Firestore Database → Create database (test mode), then paste and publish the rules from firestore.rules.';
        }
        if (code === 'permission-denied' || /permission/i.test(text)) {
            return 'Firestore rules are blocking the CMS. In Firebase Console → Firestore → Rules, publish the rules from firestore.rules.';
        }
        return text || 'Could not reach the CMS database.';
    };

    // ── Helpers ──────────────────────────────────────────────────────────────

    async function getCmsDoc(docId) {
        try {
            const snap = await db.collection('cms').doc(docId).get();
            window.CMS_LAST_ERROR = '';
            return snap.exists ? snap.data() : null;
        } catch (e) {
            window.CMS_LAST_ERROR = window.explainCmsError(e);
            console.error('Firestore read error:', e);
            return null;
        }
    }

    async function setCmsDoc(docId, data) {
        try {
            await db.collection('cms').doc(docId).set({
                ...data,
                updatedAt: new Date().toISOString()
            });
            window.CMS_LAST_ERROR = '';
            return { success: true };
        } catch (e) {
            window.CMS_LAST_ERROR = window.explainCmsError(e);
            console.error('Firestore write error:', e);
            return { success: false, message: window.CMS_LAST_ERROR };
        }
    }

    // ── Admissions ────────────────────────────────────────────────────────────

    window.fetchAdmissionsData = async function () {
        return getCmsDoc('admissions');
    };

    window.saveAdmissionsData = async function (data) {
        return setCmsDoc('admissions', data);
    };

    // ── Faculty ───────────────────────────────────────────────────────────────

    window.fetchFacultyData = async function () {
        return getCmsDoc('faculty');
    };

    window.saveFacultyData = async function (data) {
        return setCmsDoc('faculty', data);
    };

    // ── Timetable ─────────────────────────────────────────────────────────────

    window.fetchTimetableData = async function () {
        return getCmsDoc('timetable');
    };

    window.saveTimetableData = async function (data) {
        return setCmsDoc('timetable', data);
    };

    // ── Monthly Test Timetable ────────────────────────────────────────────────
    
    window.fetchMonthlyTestData = async function () {
        return getCmsDoc('monthlyTest');
    };

    window.saveMonthlyTestData = async function (data) {
        return setCmsDoc('monthlyTest', data);
    };

    // ── Settings ──────────────────────────────────────────────────────────────

    window.fetchSettings = async function () {
        return getCmsDoc('settings');
    };

    window.saveSettings = async function (data) {
        return setCmsDoc('settings', data);
    };

    // ── Student Applications ──────────────────────────────────────────────────

    window.fetchStudentApplications = async function () {
        try {
            const snap = await db.collection('studentApplications').get();
            return snap.docs
                .map(d => ({ id: d.id, ...d.data() }))
                .sort((a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0));
        } catch (e) {
            window.CMS_LAST_ERROR = window.explainCmsError(e);
            console.error('Firestore read error:', e);
            return null;
        }
    };

    window.actionStudentApplication = async function (id, action) {
        try {
            const status = action === 'Approve' ? 'Approved' : 'Rejected';
            await db.collection('studentApplications').doc(id).update({
                status,
                actionedAt: new Date().toISOString()
            });
            window.CMS_LAST_ERROR = '';
            return { success: true, message: `Application ${action}d successfully!`, application: { status } };
        } catch (e) {
            window.CMS_LAST_ERROR = window.explainCmsError(e);
            console.error('Firestore update error:', e);
            return { success: false, message: window.CMS_LAST_ERROR };
        }
    };

    window.deleteStudentApplication = async function (id) {
        try {
            await db.collection('studentApplications').doc(id).delete();
            window.CMS_LAST_ERROR = '';
            return { success: true, message: 'Application deleted.' };
        } catch (e) {
            window.CMS_LAST_ERROR = window.explainCmsError(e);
            console.error('Firestore delete error:', e);
            return { success: false, message: window.CMS_LAST_ERROR };
        }
    };

    // ── Dashboard ─────────────────────────────────────────────────────────────

    window.fetchDashboardData = async function () {
        try {
            const [appsSnap, facultyDoc] = await Promise.all([
                db.collection('studentApplications').get(),
                getCmsDoc('faculty')
            ]);

            const applications = appsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
            const teachers = facultyDoc?.teachers || [];

            const activity = applications.flatMap(app => {
                const items = [{
                    type: 'submitted',
                    at: app.submittedAt,
                    applicationId: app.id,
                    studentName: app.studentName,
                    title: 'New application submitted',
                    detail: `${app.studentName} applied for ${app.program || 'a program'}.`
                }];
                if (app.actionedAt) {
                    items.push({
                        type: app.status === 'Approved' ? 'approved' : 'rejected',
                        at: app.actionedAt,
                        applicationId: app.id,
                        studentName: app.studentName,
                        title: `Application ${app.status.toLowerCase()}`,
                        detail: `${app.studentName}'s application was ${app.status.toLowerCase()}.`
                    });
                }
                return items;
            })
                .filter(i => i.at)
                .sort((a, b) => new Date(b.at) - new Date(a.at))
                .slice(0, 8);

            return {
                generatedAt: new Date().toISOString(),
                stats: {
                    totalApplications: applications.length,
                    pendingApplications: applications.filter(a => a.status === 'Pending').length,
                    approvedApplications: applications.filter(a => a.status === 'Approved').length,
                    facultyMembers: teachers.length
                },
                activity
            };
        } catch (e) {
            window.CMS_LAST_ERROR = window.explainCmsError(e);
            console.error('Dashboard fetch error:', e);
            return null;
        }
    };

    // ── Reviews Moderation ───────────────────────────────────────────────────

    window.fetchAdminReviews = async function () {
        try {
            const snap = await db.collection('reviews').get();
            return snap.docs
                .map(d => ({ id: d.id, ...d.data() }))
                .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        } catch (e) {
            window.CMS_LAST_ERROR = window.explainCmsError(e);
            console.error('Firestore read error:', e);
            return null;
        }
    };

    window.approveReview = async function (id) {
        try {
            await db.collection('reviews').doc(id).update({
                status: 'Approved'
            });
            window.CMS_LAST_ERROR = '';
            return { success: true, message: 'Review approved successfully!' };
        } catch (e) {
            window.CMS_LAST_ERROR = window.explainCmsError(e);
            console.error('Firestore update error:', e);
            return { success: false, message: window.CMS_LAST_ERROR };
        }
    };

    window.replyToReview = async function (id, replyText) {
        try {
            await db.collection('reviews').doc(id).update({
                reply: String(replyText || '').trim(),
                repliedAt: new Date().toISOString(),
                status: 'Approved' // auto-approve when replied
            });
            window.CMS_LAST_ERROR = '';
            return { success: true, message: 'Reply posted successfully!' };
        } catch (e) {
            window.CMS_LAST_ERROR = window.explainCmsError(e);
            console.error('Firestore update error:', e);
            return { success: false, message: window.CMS_LAST_ERROR };
        }
    };

    window.deleteReview = async function (id) {
        try {
            await db.collection('reviews').doc(id).delete();
            window.CMS_LAST_ERROR = '';
            return { success: true, message: 'Review deleted successfully!' };
        } catch (e) {
            window.CMS_LAST_ERROR = window.explainCmsError(e);
            console.error('Firestore delete error:', e);
            return { success: false, message: window.CMS_LAST_ERROR };
        }
    };

})();
