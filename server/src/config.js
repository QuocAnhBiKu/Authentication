const admin = require('firebase-admin');

const serviceAccount = {

};
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://oauth-47997.firebaseio.com"
});

const db = admin.firestore();
const auth = admin.auth();
module.exports = { db, auth, admin };
