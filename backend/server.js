const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());

// Serve static frontend files from the parent directory
app.use(express.static(path.join(__dirname, '..')));

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    const initialData = {
        admissions: {
            title: "Admissions 2026-2027",
            deadline: "2026-09-30",
            fee: "1500",
            instructions: "Welcome to the Adamjee admissions portal. Please ensure all documents are attested before submission.",
            documents: ["Previous Academic Transcripts", "Copy of CNIC / B-Form"]
        },
        faculty: {
            title: "Our Esteemed Faculty",
            description: "Meet the brilliant minds guiding our students."
        },
        timetable: {
            title: "Class Timetable",
            semester: "Fall 2026",
            announcement: "Classes begin on September 15th."
        },
        student_applications: [],
        settings: {
            googleScriptUrl: ""
        }
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
}

// Reusable functions
function readData() {
    try {
        const rawData = fs.readFileSync(DATA_FILE);
        return JSON.parse(rawData);
    } catch (error) {
        return {};
    }
}

function writeData(data) {
    // Vercel Serverless Functions have a read-only deployment filesystem.
    // Do not report a successful CMS save when it cannot be retained.
    if (process.env.VERCEL) {
        return false;
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
}

function cleanText(value, maxLength = 500) {
    return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function isValidGoogleScriptUrl(value) {
    try {
        const url = new URL(value);
        return url.protocol === 'https:' && /(^|\.)script\.google\.com$/i.test(url.hostname);
    } catch (error) {
        return false;
    }
}

// ADMISSIONS ROUTES
app.get('/api/admissions', (req, res) => {
    const data = readData();
    res.json(data.admissions || {});
});
app.post('/api/admissions', (req, res) => {
    const data = readData();
    data.admissions = req.body;
    if (!writeData(data)) return res.status(503).json({ success: false, message: 'CMS saving is not configured for this Vercel deployment.' });
    res.json({ success: true, message: "Admissions updated successfully!" });
});

// FACULTY ROUTES
app.get('/api/faculty', (req, res) => {
    const data = readData();
    res.json(data.faculty || {});
});
app.post('/api/faculty', (req, res) => {
    const data = readData();
    data.faculty = req.body;
    if (!writeData(data)) return res.status(503).json({ success: false, message: 'CMS saving is not configured for this Vercel deployment.' });
    res.json({ success: true, message: "Faculty updated successfully!" });
});

// TIMETABLE ROUTES
app.get('/api/timetable', (req, res) => {
    const data = readData();
    res.json(data.timetable || {});
});
app.post('/api/timetable', (req, res) => {
    const data = readData();
    data.timetable = req.body;
    if (!writeData(data)) return res.status(503).json({ success: false, message: 'Application saving is not configured for this Vercel deployment.' });
    res.json({ success: true, message: "Timetable updated successfully!" });
});

// STUDENT APPLICATIONS ROUTES
app.get('/api/student-applications', (req, res) => {
    const data = readData();
    res.json(data.student_applications || []);
});

app.post('/api/student-applications', (req, res) => {
    const data = readData();
    if (!data.student_applications) {
        data.student_applications = [];
    }
    const application = {
        studentName: cleanText(req.body.studentName, 100),
        fatherName: cleanText(req.body.fatherName, 100),
        phone: cleanText(req.body.phone, 30),
        prevSchool: cleanText(req.body.prevSchool, 150),
        currentClass: cleanText(req.body.currentClass, 20),
        program: cleanText(req.body.program, 50),
        message: cleanText(req.body.message, 1000),
        studentUid: cleanText(req.body.studentUid, 200),
        studentEmail: cleanText(req.body.studentEmail, 320)
    };

    const requiredFields = ['studentName', 'fatherName', 'phone', 'prevSchool', 'currentClass', 'program'];
    if (requiredFields.some((field) => !application[field])) {
        return res.status(400).json({ success: false, message: 'Please complete all required application fields.' });
    }

    const newApp = {
        id: `App-${Date.now()}`,
        status: 'Pending',
        submittedAt: new Date().toISOString(),
        ...application
    };
    data.student_applications.push(newApp);
    if (!writeData(data)) return res.status(503).json({ success: false, message: 'Application saving is not configured for this Vercel deployment.' });
    res.json({ success: true, message: "Application submitted successfully!", application: newApp });
});

app.post('/api/student-applications/:id/action', async (req, res) => {
    const { id } = req.params;
    const { action } = req.body;
    if (!['Approve', 'Reject'].includes(action)) {
        return res.status(400).json({ success: false, message: 'Action must be Approve or Reject.' });
    }
    const data = readData();
    if (!data.student_applications) {
        data.student_applications = [];
    }
    
    const appIndex = data.student_applications.findIndex(a => a.id === id);
    if (appIndex === -1) {
        return res.status(404).json({ success: false, message: "Application not found" });
    }

    const app = data.student_applications[appIndex];
    if (app.status !== 'Pending') {
        return res.status(409).json({ success: false, message: `This application is already ${app.status.toLowerCase()}.` });
    }

    app.status = action === 'Approve' ? 'Approved' : 'Rejected';
    app.actionedAt = new Date().toISOString();

    // If approved, send data to Google Apps Script Web App URL if configured
    if (action === 'Approve') {
        const googleScriptUrl = data.settings?.googleScriptUrl;
        if (googleScriptUrl) {
            try {
                const googleResponse = await fetch(googleScriptUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ action: 'approved_application', application: app })
                });
                if (!googleResponse.ok) throw new Error(`Google Apps Script returned ${googleResponse.status}`);
                app.syncedToGoogle = true;
                app.syncedAt = new Date().toISOString();
            } catch (err) {
                console.error("Error forwarding data to Google Apps Script:", err);
                app.syncError = err.message;
            }
        }
    }

    if (!writeData(data)) return res.status(503).json({ success: false, message: 'Settings saving is not configured for this Vercel deployment.' });
    res.json({ success: true, message: `Application ${action}d successfully!`, application: app });
});

// DASHBOARD ROUTE - derived only from saved CMS records
app.get('/api/dashboard', (req, res) => {
    const data = readData();
    const applications = Array.isArray(data.student_applications) ? data.student_applications : [];
    const teachers = Array.isArray(data.faculty?.teachers) ? data.faculty.teachers : [];
    const activity = applications.flatMap((application) => {
        const items = [{
            type: 'submitted',
            at: application.submittedAt,
            applicationId: application.id,
            studentName: application.studentName,
            title: 'New application submitted',
            detail: `${application.studentName} applied for ${application.program || 'a program'}.`
        }];
        if (application.actionedAt) {
            items.push({
                type: application.status === 'Approved' ? 'approved' : 'rejected',
                at: application.actionedAt,
                applicationId: application.id,
                studentName: application.studentName,
                title: `Application ${application.status.toLowerCase()}`,
                detail: `${application.studentName}'s application was ${application.status.toLowerCase()}.`
            });
        }
        return items;
    }).filter((item) => item.at).sort((a, b) => new Date(b.at) - new Date(a.at)).slice(0, 8);

    res.json({
        generatedAt: new Date().toISOString(),
        stats: {
            totalApplications: applications.length,
            pendingApplications: applications.filter((application) => application.status === 'Pending').length,
            approvedApplications: applications.filter((application) => application.status === 'Approved').length,
            facultyMembers: teachers.length
        },
        activity
    });
});

// SETTINGS ROUTES
app.get('/api/settings', (req, res) => {
    const data = readData();
    res.json(data.settings || { googleScriptUrl: "" });
});

app.post('/api/settings', (req, res) => {
    const data = readData();
    const googleScriptUrl = cleanText(req.body.googleScriptUrl, 1000);
    if (googleScriptUrl && !isValidGoogleScriptUrl(googleScriptUrl)) {
        return res.status(400).json({ success: false, message: 'Enter a valid Google Apps Script deployment URL.' });
    }
    data.settings = { ...data.settings, googleScriptUrl };
    writeData(data);
    res.json({ success: true, message: "Settings updated successfully!" });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Adamjee API Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;
