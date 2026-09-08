/* =========================================================
MOPHATO DANCE THEATRE — FIREBASE SETUP
=========================================================
This is the ONLY file you should ever need to hand-edit.
Everything else (index.html, tickets.html, admin.html) reads
its content from the database this file connects to, so once
this is set up, you manage the whole site from admin.html —
no code editing, ever again.

Takes about 10 minutes, no coding beyond pasting values below.


STEP 1 — Create a free Firebase project
-----------------------------------------------------------
1. Go to https://console.firebase.google.com
2. Click "Add project", name it (e.g. "mophato-dance-theatre"),
   finish the wizard (Google Analytics is optional — skip it).


STEP 2 — Register a Web App
-----------------------------------------------------------
1. On your new project's dashboard, click the "</>" (Web) icon.
2. Give it a nickname (e.g. "Mophato Website"), click "Register app".
3. Firebase shows you a `firebaseConfig` object. Copy it and paste
   it over the placeholder FIREBASE_CONFIG object below.


STEP 3 — Turn on Firestore (the database)
-----------------------------------------------------------
1. In the left sidebar: Build → Firestore Database → Create database.
2. Choose "Start in production mode" (NOT test mode).
3. Pick the region closest to Botswana (e.g. europe-west or
   a similar option Firebase offers you) and click Enable.
4. Go to the "Rules" tab and replace the default rules with the
   block at the bottom of this file (under SECURITY RULES),
   then click "Publish". This is what stops strangers from
   editing your events/performances — don't skip it.


STEP 4 — Turn on Authentication (so only YOU can edit the site)
-----------------------------------------------------------
1. In the left sidebar: Build → Authentication → Get started.
2. Under "Sign-in method", enable "Email/Password" (click it,
   toggle Enable, Save).
3. Go to the "Users" tab → "Add user" → enter the email and
   password you (or whoever manages the site) will sign in
   with on admin.html. You can add more than one person here
   later the same way.

   IMPORTANT: admin.html only has a Sign In screen, no public
   "create account" option — so the only way anyone gets an
   account is you creating it here, one at a time. Keep it
   that way; don't add self-signup later.

4. Also worth doing once: Authentication → Settings →
   "User actions" → make sure "Email enumeration protection"
   is switched on (it's the Firebase default on new projects,
   this just confirms it — it stops someone from being able to
   tell, from the sign-in error alone, whether a given email
   has an account).


STEP 5 — Done
-----------------------------------------------------------
Upload this file, along with index.html, tickets.html and
admin.html, to your web host. Open admin.html, sign in with
the account from Step 4, and start adding events — they'll
appear on the live site immediately, for every visitor, with
no re-uploading of anything.

========================================================= */

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const FIREBASE_CONFIG = {
 
};

/* =========================================================
INITIALIZATION — you shouldn't need to touch anything below
========================================================= */

(function () {

  const isConfigured =
    FIREBASE_CONFIG.apiKey &&
    !FIREBASE_CONFIG.apiKey.startsWith("YOUR_") &&
    FIREBASE_CONFIG.projectId &&
    !FIREBASE_CONFIG.projectId.startsWith("YOUR_");

  if (!isConfigured) {
    // Leave window.mdtFirestoreReady unset/false — every page already
    // falls back gracefully to its built-in sample content when this
    // happens, so an unconfigured site never looks broken.
    window.mdtFirestoreReady = false;
    return;
  }

  try {

    firebase.initializeApp(FIREBASE_CONFIG);

    window.mdtDb = firebase.firestore();

    // firebase-auth-compat.js is only loaded on admin.html — guard so
    // index.html / tickets.html (which don't load it) don't error out.
    if (firebase.auth) {
      window.mdtAuth = firebase.auth();
    }

    window.mdtFirestoreReady = true;

  } catch (err) {

    console.warn("Mophato: Firebase failed to initialize — check FIREBASE_CONFIG values.", err);
    window.mdtFirestoreReady = false;

  }

})();

/* =========================================================
SECURITY RULES — paste this into Firebase Console →
Firestore Database → Rules → Publish (Step 3 above)
=========================================================

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Anyone visiting the site can READ events and performances
    // (that's how the public pages display them) —
    // but only a signed-in admin account can WRITE (add/edit/delete).
    match /events/{eventId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /performances/{perfId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Same pattern for the "Site Content" tab in admin.html — the
    // hero, story, impact stats, contact info, footer and social
    // links all live in this one document.
    match /site/{docId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Deny everything else by default — this line matters:
    // without it, a typo'd collection name elsewhere in your code
    // could accidentally end up world-writable.
    match /{document=**} {
      allow read, write: if false;
    }

  }
}

========================================================= */
