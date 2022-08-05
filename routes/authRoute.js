const router = require('express').Router();

const signupValidator = require('../validator/auth/signupValidator');
const loginValidator = require('../validator/auth/loginValidator');

const {
    signupGetController,
    signupPostController,
    loginGetController,
    loginPostController,
    logoutController,
    changePasswordGetController,
    changePasswordPostController
} = require('../controllers/authController');

const {isAuthenticated, isUnAuthenticated} = require('../middleware/authMiddleware');

router.get('/signup', isUnAuthenticated, signupGetController);
router.post('/signup', isUnAuthenticated, signupValidator, signupPostController);

router.get('/login', isUnAuthenticated, loginGetController);
router.post('/login', isUnAuthenticated, loginValidator, loginPostController);

router.get('/logout', logoutController);

router.get('/change-password', isAuthenticated, changePasswordGetController)
router.post('/change-password', isAuthenticated, changePasswordPostController)


module.exports = router;