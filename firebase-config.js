/* =========================================================
FIREBASE CONFIG — Mophato Dance Theatre
=========================================================
This is the ONLY file you should ever need to hand-edit.
Once it's filled in, use admin.html (from any device, by
anyone you give a login to) to add/edit/remove upcoming
events and past performances. index.html and tickets.html
will pick up the changes automatically — no more code edits.

HOW TO GET YOUR KEYS (free, ~10 minutes, no coding):

1. Go to https://console.firebase.google.com and sign in
   with a Google account. Click "Add project" and follow the
   prompts (you can turn off Google Analytics, it's optional).

2. In your new project, click the "</>" (Web) icon to add a
   web app. Give it any nickname, e.g. "mophato-site". Skip
   Firebase Hosting unless you want to use it.

3. Firebase will show you a `firebaseConfig` object. Copy
   those values into MDT_FIREBASE_CONFIG below.

4. In the left sidebar, go to Build > Firestore Database >
   Create database. Choose "Start in production mode" and
   pick a location close to Botswana (e.g. europe-west or
   a nearby region).

5. Still in Firestore, click the "Rules" tab and paste this,
   then click Publish:

     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /events/{eventId} {
           allow read: if true;
           allow write: if request.auth != null;
         }
         match /performances/{perfId} {
           allow read: if true;
           allow write: if request.auth != null;
         }
       }
     }

6. In the left sidebar, go to Build > Authentication >
   Get started > Sign-in method > enable "Email/Password".
   Then go to the "Users" tab and add an account (email +
   password) for each person who should be able to use
   admin.html. You can add more people later the same way —
   still no code edits needed.

7. Save this file and re-upload it (along with index.html,
   tickets.html, and admin.html) to wherever the site is
   hosted. From then on, everything happens in admin.html.
========================================================= */

const MDT_FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

window.mdtFirestoreReady = false;

try {

  if (
    typeof firebase !== "undefined" &&
    MDT_FIREBASE_CONFIG.apiKey &&
    MDT_FIREBASE_CONFIG.apiKey !== "YOUR_API_KEY"
  ) {

    firebase.initializeApp(MDT_FIREBASE_CONFIG);

    window.mdtDb = firebase.firestore();

    if (firebase.auth) {
      window.mdtAuth = firebase.auth();
    }

    window.mdtFirestoreReady = true;

  }

} catch (e) {

  console.warn("Mophato: Firebase not configured yet — site is using fallback content.", e);

}
