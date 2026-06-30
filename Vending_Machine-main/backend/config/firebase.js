const admin = require('firebase-admin');
require('dotenv').config(); // Ensure environment variables are loaded

let db = null;

const databaseURL = process.env.FIREBASE_DATABASE_URL;

if (!databaseURL) {
  console.error('FIREBASE_DATABASE_URL is not set in .env file');
  // In a real app, you might want to throw an error or exit
}

try {
  let serviceAccount;

  // Production/Staging environment: Use environment variable
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    console.log('Initializing Firebase with service account from environment variable...');
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } 
  // Local development: Use service account key file
  else {
    console.log('Initializing Firebase with service account from file...');
    serviceAccount = require('./serviceAccountKey.json');
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: databaseURL
  });

  db = admin.database();
  console.log('Firebase initialized successfully');

} catch (error) {
  console.error('Failed to initialize Firebase:', error.message);
  console.error('Firebase credentials not configured correctly. Please set up Firebase service account key either as a file (serviceAccountKey.json) or as a FIREBASE_SERVICE_ACCOUNT environment variable.');
}

module.exports = { admin, db };
