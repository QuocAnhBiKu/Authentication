const AuthService = require('../service/userService');

const AuthController = {
  signInWithGoogle: async (req, res) => {
    try {
      const { idToken } = req.body;
      const user = await AuthService.signInWithGoogle(idToken);
      res.status(200).json({ user, idToken });
    } catch (error) {
      console.error("Error in signInWithGoogle:", error);
      res.status(500).json({ error: error.message });
    }
  },

  checkUserRole: async (req, res) => {
    const uid = req.params.uid;
    try {
      const role = await AuthService.checkUserRole(uid);
      res.status(200).json({ role });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  setUserRole: async (req, res) => {
    const { uid, role } = req.body;
    try {
      const result = await AuthService.setUserRole(uid, role);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  verifyToken: async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ verified: false, message: 'No token provided' });
    }
  
    const token = authHeader.split(' ')[1];
    try {
      const user = await AuthService.verifyToken(token);
      res.status(200).json({ verified: true, user, idToken: token }); // Thêm idToken vào phản hồi
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json({ verified: false, message: error.message });
    }
  },
  logout: async (req, res) => {

    res.status(200).json({ message: 'Logged out successfully' });
  }
};

module.exports = AuthController;
