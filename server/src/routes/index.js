const express = require('express');
const router = express.Router();
const AuthController = require('../controller/controlle');
const authMiddleware = require('../middleware/authMiddleware'); // Thêm dòng này

router.post('/login', AuthController.signInWithGoogle);
router.get('/role/:uid', authMiddleware, AuthController.checkUserRole);
router.post('/setRole', authMiddleware, AuthController.setUserRole);
router.post('/verify', AuthController.verifyToken);
router.post('/logout', authMiddleware, AuthController.logout);

module.exports = router;