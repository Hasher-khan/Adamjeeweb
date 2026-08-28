// admin/js/api.js
const API_BASE_URL = 'http://localhost:3000/api';

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
