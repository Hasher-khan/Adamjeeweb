# Firebase student authentication setup

1. Create or select a project in the [Firebase Console](https://console.firebase.google.com/).
2. Add a **Web app** in Project settings and copy its configuration values into [firebase-config.js](firebase-config.js).
3. Open **Authentication → Sign-in method** and enable **Email/Password**.
4. Create a **Cloud Firestore** database in Production mode.
5. Copy the exact contents of [firestore.rules](firestore.rules) into Firestore → **Rules**, then publish them. These rules enforce that a student can only read and write documents in their own UID path.
6. In **Authentication → Settings → Authorized domains**, add your production domain. `localhost` is normally available for local testing.
7. Open `http://localhost:3000/student-login.html` to create a test student account and sign in.

The Firebase web configuration is intentionally public and belongs in browser code. Never put a Firebase service-account JSON key in this project or in `firebase-config.js`.

Firebase's documented web flow uses the modular SDK, `createUserWithEmailAndPassword` for registration, `signInWithEmailAndPassword` for login, and `onAuthStateChanged` to maintain the signed-in state. [Firebase Authentication web guide](https://firebase.google.com/docs/auth/web/start)
