// admin/js/api.js — Firebase Firestore powered CMS API
// Requires firebase-config.js, firebase-app-compat.js and firebase-firestore-compat.js
// to be loaded as <script> tags BEFORE this file.

(function () {
    // Initialize Firebase once
    if (!firebase.apps.length) {
        firebase.initializeApp(window.FIREBASE_CONFIG);
    }
    const db = firebase.firestore();

    // ── Helpers ──────────────────────────────────────────────────────────────

    async function getCmsDoc(docId) {
        try {
            const snap = await db.collection('cms').doc(docId).get();
            return snap.exists ? snap.data() : null;
        } catch (e) {
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
            return { success: true };
        } catch (e) {
            console.error('Firestore write error:', e);
            return { success: false, message: e.message };
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
            return { success: true, message: `Application ${action}d successfully!`, application: { status } };
        } catch (e) {
            console.error('Firestore update error:', e);
            return { success: false, message: e.message };
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
            console.error('Dashboard fetch error:', e);
            return null;
        }
    };

})();
