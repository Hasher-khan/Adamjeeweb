// admin/js/api.js
const API_BASE_URL = '/api';

async function fetchAdmissionsData() {
    try {
        const response = await fetch(`${API_BASE_URL}/admissions`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

async function saveAdmissionsData(data) {
    try {
        const response = await fetch(`${API_BASE_URL}/admissions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error saving data:', error);
        return { success: false };
    }
}

async function fetchFacultyData() {
    try {
        const response = await fetch(`${API_BASE_URL}/faculty`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

async function saveFacultyData(data) {
    try {
        const response = await fetch(`${API_BASE_URL}/faculty`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error saving data:', error);
        return { success: false };
    }
}

async function fetchTimetableData() {
    try {
        const response = await fetch(`${API_BASE_URL}/timetable`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

async function saveTimetableData(data) {
    try {
        const response = await fetch(`${API_BASE_URL}/timetable`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error saving data:', error);
        return { success: false };
    }
}

async function fetchStudentApplications() {
    try {
        const response = await fetch(`${API_BASE_URL}/student-applications`);
        if (!response.ok) throw new Error('Could not load student applications');
        return await response.json();
    } catch (error) {
        console.error('Error fetching applications:', error);
        return null;
    }
}

async function actionStudentApplication(id, action) {
    try {
        const response = await fetch(`${API_BASE_URL}/student-applications/${encodeURIComponent(id)}/action`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action })
        });
        return await response.json();
    } catch (error) {
        console.error('Error updating application:', error);
        return { success: false, message: 'Could not connect to the server.' };
    }
}

async function fetchSettings() {
    try {
        const response = await fetch(`${API_BASE_URL}/settings`);
        if (!response.ok) throw new Error('Could not load settings');
        return await response.json();
    } catch (error) {
        console.error('Error fetching settings:', error);
        return null;
    }
}

async function saveSettings(data) {
    try {
        const response = await fetch(`${API_BASE_URL}/settings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error('Error saving settings:', error);
        return { success: false, message: 'Could not connect to the server.' };
    }
}

async function fetchDashboardData() {
    try {
        const response = await fetch(`${API_BASE_URL}/dashboard`);
        if (!response.ok) throw new Error('Could not load dashboard data');
        return await response.json();
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return null;
    }
}
