/**
 * seed-reviews-rest.js
 * Seeds sample approved reviews directly into Firestore via REST API.
 * No service account key needed — uses the Firestore REST API with your project.
 * Run with: node seed-reviews-rest.js
 */

const https = require('https');

const PROJECT_ID = 'adamjeeweb-7fa37';
const BASE_URL = `firestore.googleapis.com`;
const COLLECTION = 'reviews';

const reviews = [
    {
        reviewerName: 'Muhammad Ali',
        rating: 5,
        comment: 'Excellent coaching center! The faculty is highly experienced and very supportive. My son improved tremendously in just a few months. Highly recommend Adamjee for FSc students.',
        status: 'Approved',
        reply: 'Thank you Muhammad! We are delighted to hear about your son\'s progress.',
        repliedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
    {
        reviewerName: 'Fatima Zahra (Parent)',
        rating: 5,
        comment: 'Best coaching institute in Karachi. My daughter got A1 grades after joining Adamjee. The study environment is disciplined and the notes provided are very comprehensive.',
        status: 'Approved',
        reply: '',
        repliedAt: '',
        createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    },
    {
        reviewerName: 'Ahmed Raza',
        rating: 4,
        comment: 'Very good coaching for Pre-Medical. The teachers explain concepts very clearly. The test series helped me a lot in my board exam preparation.',
        status: 'Approved',
        reply: 'Thank you Ahmed! We are glad our test series helped you prepare effectively.',
        repliedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
        createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    },
    {
        reviewerName: 'Sara Khan',
        rating: 5,
        comment: 'Adamjee has the best Biology and Chemistry teachers. The practical demonstrations and detailed notes helped me score full marks. I joined in Class 11 and never looked back!',
        status: 'Approved',
        reply: '',
        repliedAt: '',
        createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    },
    {
        reviewerName: 'Bilal Hussain',
        rating: 5,
        comment: 'Amazing institute! The management is very professional and the teaching style is outstanding. My confidence in Physics increased so much after joining. Strongly recommended!',
        status: 'Approved',
        reply: 'Thank you Bilal! Confidence in Physics is indeed key. We look forward to seeing your great results!',
        repliedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
    },
    {
        reviewerName: 'Nadia Siddiqui (Parent)',
        rating: 4,
        comment: 'I enrolled my two children at Adamjee and both are performing excellently. The teachers are dedicated and always available for extra help. Very happy with the results.',
        status: 'Approved',
        reply: '',
        repliedAt: '',
        createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    },
];

// Convert a JS value to a Firestore REST API value object
function toFirestoreValue(val) {
    if (val === null || val === undefined || val === '')
        return { nullValue: null };
    if (typeof val === 'boolean') return { booleanValue: val };
    if (typeof val === 'number' && Number.isInteger(val)) return { integerValue: String(val) };
    if (typeof val === 'number') return { doubleValue: val };
    return { stringValue: String(val) };
}

function toFirestoreDoc(obj) {
    const fields = {};
    for (const [k, v] of Object.entries(obj)) {
        fields[k] = toFirestoreValue(v);
    }
    return { fields };
}

function httpsRequest(options, body) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
                catch { resolve({ status: res.statusCode, body: data }); }
            });
        });
        req.on('error', reject);
        if (body) req.write(body);
        req.end();
    });
}

async function seed() {
    console.log('🌱  Seeding approved reviews to Firestore via REST API...\n');
    let success = 0;

    for (const [i, review] of reviews.entries()) {
        const docId = `Rev-seed-${Date.now()}-${i}`;
        const doc = toFirestoreDoc({ id: docId, ...review });
        const bodyStr = JSON.stringify(doc);

        const options = {
            hostname: BASE_URL,
            path: `/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION}/${docId}`,
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(bodyStr),
            },
        };

        const res = await httpsRequest(options, bodyStr);
        if (res.status === 200) {
            console.log(`  ✔  ${review.reviewerName}`);
            success++;
        } else {
            console.log(`  ✖  ${review.reviewerName} — HTTP ${res.status}:`, JSON.stringify(res.body).slice(0, 120));
        }

        // Small delay to avoid rate limit
        await new Promise(r => setTimeout(r, 200));
    }

    console.log(`\n${success === reviews.length ? '✅' : '⚠️'}  ${success}/${reviews.length} reviews seeded.\n`);
    if (success > 0) {
        console.log('Refresh the homepage — reviews will now appear!\n');
    }
}

seed().catch(e => {
    console.error('Fatal error:', e.message);
    process.exit(1);
});
