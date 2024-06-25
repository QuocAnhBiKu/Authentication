const { getAuth } = require('firebase-admin/auth');
const { auth, db } = require('../config');


const AuthService = {
  signInWithGoogle: async (idToken) => {
    try {
      const decodedToken = await getAuth().verifyIdToken(idToken);
      const uid = decodedToken.uid;
      
      // Kiểm tra xem user đã tồn tại chưa, nếu chưa thì thêm mới
      const userRef = db.collection('users').doc(uid);
      const userDoc = await userRef.get();
      
      let userData;
      if (!userDoc.exists) {
        userData = {
          email: decodedToken.email,
          displayName: decodedToken.name,
          role: 'user' // Mặc định role là 'user'
        };
        await userRef.set(userData);
      } else {
        userData = userDoc.data();
      }
      
      return { uid, ...userData };
    } catch (error) {
      console.error("Lỗi xác thực:", error);
      throw error;
    }
  },

  checkUserRole: async (uid) => {
    try {
      const userRef = db.collection('users').doc(uid);
      const userDoc = await userRef.get();
      
      if (!userDoc.exists) {
        throw new Error('User not found');
      }
      
      return userDoc.data().role || 'user';  // Trả về 'user' nếu không có role
    } catch (error) {
      console.error("Lỗi khi kiểm tra role:", error);
      throw error;
    }
  },
  setUserRole: async (uid, role) => {
    try {
      const userRef = db.collection('users').doc(uid);
      await userRef.update({ role: role });
      return { success: true, message: `Role updated to ${role} for user ${uid}` };
    } catch (error) {
      console.error("Lỗi khi set role:", error);
      throw error;
    }
  },
  verifyToken: async (idToken) => {
    try {
      const decodedToken = await getAuth().verifyIdToken(idToken);
      const uid = decodedToken.uid;

      // Lấy thông tin người dùng từ Firestore
      const userRef = db.collection('users').doc(uid);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        throw new Error('User not found');
      }

      const userData = userDoc.data();

      return { uid, ...userData };
    } catch (error) {
      console.error("Lỗi xác thực token:", error);
      throw new Error('Invalid or expired token');
    }
  }
};
module.exports = AuthService;