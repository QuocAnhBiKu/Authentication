const { db } = require('../config');

const User = {
  addUser: async (user) => {
    try {
      await db.collection('users').doc(user.uid).set({
        uid: user.uid,
        email: user.email,
        role: 'user' // Vai trò mặc định
      });
    } catch (error) {
      console.error("Error adding user: ", error);
    }
  },

  getUserRole: async (uid) => {
    try {
      const userRef = db.collection('users').doc(uid);
      const doc = await userRef.get();
      if (doc.exists) {
        return doc.data().role;
      } else {
        console.log("No such user!");
        return null;
      }
    } catch (error) {
      console.error("Error getting user role: ", error);
      return null;
    }
  }
};

module.exports = User;
