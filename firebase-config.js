/* =========================================================
MOPHATO DANCE THEATRE
FIREBASE SETUP
=========================================================

This is the ONLY file that should normally need to be
hand-edited for Firebase configuration.

Once Firebase is configured, the following pages use it:

- index.html
- tickets.html
- admin.html

The public website reads content from Firestore.
The Admin Portal manages events, performances and
editable website content.

IMPORTANT:
Do NOT put Firebase service-account keys, private keys,
passwords or other server credentials in this file.

======================================================== */


/* =========================================================
STEP 1
CREATE YOUR FIREBASE PROJECT
=========================================================

1. Go to:

https://console.firebase.google.com

2. Click "Add project".

3. Give the project a name, for example:

mophato-dance-theatre

4. Complete the setup.

Google Analytics is optional.


========================================================
STEP 2
REGISTER THE WEBSITE AS A WEB APP
=========================================================

1. Open your Firebase project.

2. From the project dashboard, click the Web icon:

</>

3. Give the application a name, for example:

Mophato Website

4. Click "Register app".

5. Firebase will display a configuration object similar
   to the one below.

6. Copy those values into FIREBASE_CONFIG.


========================================================
STEP 3
ENABLE FIRESTORE
=========================================================

1. Firebase Console
2. Build
3. Firestore Database
4. Create database

Choose:

Production mode

Do NOT use test mode for the live website.

Choose a suitable Firebase region.

After Firestore is created, go to:

Firestore Database
→ Rules

Replace the rules with the SECURITY RULES provided at
the bottom of this file.

IMPORTANT:

The rules below are designed so that public visitors can
read the information needed by the website, while only
approved administrator accounts can modify the data.

========================================================
STEP 4
ENABLE AUTHENTICATION
=========================================================

1. Firebase Console
2. Build
3. Authentication
4. Get started

Enable:

Email/Password

Then go to:

Authentication
→ Users
→ Add user

Create the administrator account that will be used to
access admin.html.

There is intentionally NO public registration form on
admin.html.

Only accounts created inside Firebase Authentication
should have access to the Admin Portal.

========================================================
STEP 5
CREATE THE ADMIN ACCESS RECORD
=========================================================

After creating the administrator account:

1. Copy the administrator's Firebase Authentication UID.

2. Open:

Firestore Database
→ Data

3. Create a collection:

admins

4. Create a document using the administrator's UID as
   the document ID.

Example:

Collection:
admins

Document ID:
YOUR_ADMIN_UID

The document can contain:

{
  "active": true,
  "role": "admin"
}

The security rules below use this admins collection to
control who can modify the website.

If another administrator needs access later, create
another Firebase Authentication account and add that
user's UID to the admins collection.

========================================================
STEP 6
UPLOAD THE FILES
=========================================================

Your website should contain:

index.html
tickets.html
admin.html
firebase-config.js

Make sure firebase-config.js is in the same directory
as the HTML files unless the script paths are changed.

========================================================
STEP 7
CONFIGURE LEMON SQUEEZY
=========================================================

Ticket payments are handled separately through the
Lemon Squeezy configuration in tickets.html.

Firebase is responsible for:

- Events
- Performances
- Website content
- Admin authentication

Lemon Squeezy is responsible for:

- Ticket checkout
- Ticket payment

======================================================== */


/* =========================================================
FIREBASE WEB APP CONFIGURATION
=========================================================

Paste the configuration Firebase gives you here.

Example:

const FIREBASE_CONFIG = {
  apiKey: "AIza...",
  authDomain: "mophato-dance-theatre.firebaseapp.com",
  projectId: "mophato-dance-theatre",
  storageBucket: "mophato-dance-theatre.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

Do NOT paste:

- Firebase service-account JSON
- Private keys
- Admin SDK credentials
- Passwords

The Firebase Web App configuration is intended to be
used by browser applications.

========================================================= */

const FIREBASE_CONFIG = {

  apiKey: "YOUR_API_KEY",

  authDomain: "YOUR_PROJECT.firebaseapp.com",

  projectId: "YOUR_PROJECT_ID",

  storageBucket: "YOUR_PROJECT.firebasestorage.app",

  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",

  appId: "YOUR_APP_ID"

};


/* =========================================================
INITIALIZATION
=========================================================

You should normally NOT edit anything below this point.

This section:

1. Checks whether Firebase has been configured.
2. Initializes Firebase.
3. Creates the Firestore connection.
4. Creates the Authentication connection when available.
5. Sets mdtFirestoreReady so the website knows whether
   Firebase is available.

========================================================= */

(function () {

  const isConfigured =
    FIREBASE_CONFIG &&
    FIREBASE_CONFIG.apiKey &&
    !FIREBASE_CONFIG.apiKey.startsWith("YOUR_") &&
    FIREBASE_CONFIG.authDomain &&
    !FIREBASE_CONFIG.authDomain.startsWith("YOUR_") &&
    FIREBASE_CONFIG.projectId &&
    !FIREBASE_CONFIG.projectId.startsWith("YOUR_") &&
    FIREBASE_CONFIG.appId &&
    !FIREBASE_CONFIG.appId.startsWith("YOUR_");


  /* -------------------------------------------------------
  Firebase has not been configured yet.
  ------------------------------------------------------- */

  if (!isConfigured) {

    window.mdtFirestoreReady = false;

    window.mdtDb = null;

    window.mdtAuth = null;

    console.info(
      "Mophato: Firebase is not configured. " +
      "The website will use its built-in fallback content."
    );

    return;

  }


  /* -------------------------------------------------------
  Prevent duplicate Firebase initialization.
  ------------------------------------------------------- */

  try {

    let app;

    if (window.firebase.apps && window.firebase.apps.length) {

      app = window.firebase.app();

    } else {

      app = window.firebase.initializeApp(FIREBASE_CONFIG);

    }


    /* -----------------------------------------------------
    Firestore
    ----------------------------------------------------- */

    window.mdtDb = window.firebase.firestore(app);


    /* -----------------------------------------------------
    Firebase Authentication

    admin.html loads Firebase Authentication.

    index.html and tickets.html may not load the
    Authentication library, so this is safely checked.
    ----------------------------------------------------- */

    if (
      window.firebase &&
      typeof window.firebase.auth === "function"
    ) {

      window.mdtAuth = window.firebase.auth();

    } else {

      window.mdtAuth = null;

    }


    /* -----------------------------------------------------
    Firebase is ready
    ----------------------------------------------------- */

    window.mdtFirestoreReady = true;

    console.info(
      "Mophato: Firebase initialized successfully."
    );


  } catch (err) {

    window.mdtFirestoreReady = false;

    window.mdtDb = null;

    window.mdtAuth = null;

    console.error(
      "Mophato: Firebase failed to initialize.",
      err
    );

    console.warn(
      "Check the FIREBASE_CONFIG values and make sure " +
      "the Firebase scripts are loaded before this file."
    );

  }

})();


/* =========================================================
SECURITY RULES
=========================================================

IMPORTANT:

The following rules should be copied into:

Firebase Console
→ Firestore Database
→ Rules

Then click:

Publish

These rules allow:

PUBLIC:
- Read events
- Read performances
- Read site content

ADMIN:
- Create events
- Edit events
- Delete events
- Create performances
- Edit performances
- Delete performances
- Edit site content

The administrator must:

1. Be signed into Firebase Authentication.
2. Have an active document in:

admins/{USER_UID}

Example:

admins
  └── abc123456789
       ├── active: true
       └── role: "admin"


======================================================== */


/*

rules_version = '2';

service cloud.firestore {

  match /databases/{database}/documents {


    // =====================================================
    // ADMIN ACCESS
    // =====================================================

    function isAdmin() {

      return request.auth != null
        && exists(
          /databases/$(database)/documents/admins/$(request.auth.uid)
        )
        && get(
          /databases/$(database)/documents/admins/$(request.auth.uid)
        ).data.active == true;

    }


    // =====================================================
    // EVENTS
    // =====================================================

    match /events/{eventId} {

      // Website visitors can view events.
      allow read: if true;

      // Only approved administrators can change events.
      allow create, update, delete: if isAdmin();

    }


    // =====================================================
    // PERFORMANCES
    // =====================================================

    match /performances/{performanceId} {

      // Website visitors can view performances.
      allow read: if true;

      // Only approved administrators can change
      // performances.
      allow create, update, delete: if isAdmin();

    }


    // =====================================================
    // WEBSITE CONTENT
    // =====================================================

    match /site/{documentId} {

      // Website visitors can read website content.
      allow read: if true;

      // Only approved administrators can change content.
      allow create, update, delete: if isAdmin();

    }


    // =====================================================
    // ADMIN RECORDS
    // =====================================================

    match /admins/{userId} {

      // An authenticated user can only read their own
      // administrator record.
      allow read: if request.auth != null
        && request.auth.uid == userId;

      // Administrator records must NOT be created,
      // changed or deleted from the website itself.

      // Manage these records directly through Firebase
      // Console or another secured administration process.
      allow create, update, delete: if false;

    }


    // =====================================================
    // DENY EVERYTHING ELSE
    // =====================================================

    match /{document=**} {

      allow read, write: if false;

    }

  }

}

*/


/* =========================================================
END OF FIREBASE CONFIGURATION
========================================================= */
