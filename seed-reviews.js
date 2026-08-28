/**
 * seed-reviews.js
 * Run once with: node seed-reviews.js
 * Seeds sample approved reviews into Firestore.
 */

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore }        = require('firebase-admin/firestore');
const path = require('path');

// ── Try to load service account key ───────────────────────────────────────────
let serviceAccount;
try {
    serviceAccount = require('./serviceAccountKey.json');
} catch (_) {
    console.error('\n❌  serviceAccountKey.json not found.\n');
    console.error('Download it from Firebase Console → Project Settings → Service Accounts → Generate new private key');
    console.error('Save it as:  d:\\Adamjeeproject\\AdamjeeWebsite\\serviceAccountKey.json\n');
    process.exit(1);
}

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

// ── Sample reviews ─────────────────────────────────────────────────────────────
const reviews = [
    {
        reviewerName: 'Muhammad Ali',
        rating: 5,
        comment: 'Excellent coaching center! The faculty is highly experienced and very supportive. My son improved tremendously in just a few months. Highly recommend Adamjee for FSc students.',
        status: 'Approved',
        reply: 'Thank you for your kind words, Muhammad! We are delighted to hear about your son\'s progress. Our faculty puts in great effort for every student.',
        repliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        reviewerName: 'Fatima Zahra (Parent)',
        rating: 5,
        comment: 'Best coaching institute in Karachi. My daughter got A1 grades after joining Adamjee. The study environment is disciplined and the notes provided are very comprehensive.',
        status: 'Approved',
        reply: null,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        reviewerName: 'Ahmed Raza',
        rating: 4,
        comment: 'Very good coaching for Pre-Medical. The teachers explain concepts very clearly. The test series helped me a lot in my board exam preparation. Great facilities too.',
        status: 'Approved',
        reply: 'Thank you Ahmed! We are glad our test series and faculty helped you prepare effectively. Best of luck in your exams!',
        repliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        reviewerName: 'Sara Khan',
        rating: 5,
        comment: 'Adamjee has the best Biology and Chemistry teachers. The practical demonstrations and detailed notes helped me score full marks. I joined in Class 11 and never looked back!',
        status: 'Approved',
        reply: null,
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        reviewerName: 'Bilal Hussain',
        rating: 5,
        comment: 'Amazing institute! The management is very professional and the teaching style is outstanding. My confidence in Physics increased so much after joining. Strongly recommended!',
        status: 'Approved',
        reply: 'Thank you Bilal! Confidence in Physics is indeed key. We look forward to seeing your great results!',
        repliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        reviewerName: 'Nadia Siddiqui (Parent)',
        rating: 4,
        comment: 'I enrolled my two children at Adamjee and both are performing excellently. The teachers are dedicated and always available for extra help. Very happy with the results.',
        status: 'Approved',
        reply: null,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
];

async function seed() {
    console.log('🌱  Seeding reviews to Firestore...\n');
    const batch = db.batch();

    for (const [i, review] of reviews.entries()) {
        const id = `Rev-seed-${Date.now()}-${i}`;
        const ref = db.collection('reviews').doc(id);
        batch.set(ref, { id, ...review });
        console.log(`  ✔  ${review.reviewerName}`);
    }

    await batch.commit();
    console.log(`\n✅  ${reviews.length} reviews seeded successfully!\n`);
    console.log('They will appear on the homepage immediately after page refresh.\n');
    process.exit(0);
}

seed().catch(e => {
    console.error('❌  Error seeding reviews:', e.message);
    process.exit(1);
});
