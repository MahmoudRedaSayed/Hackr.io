const express = require('express');
const router = express.Router();

// import validators
const { userRegisterValidator, userLoginValidator ,forgotPasswordValidator,resetPasswordValidator} = require('../validators/auth');
const { runValidation } = require('../validators');

// import from controllers
const { register,registerActivate,userLogin,forgotPassword,resetPassword } = require('../controllers/auth');

router.post('/register', userRegisterValidator, runValidation, register);
router.post('/register/activate', registerActivate);
router.post('/login', userLoginValidator,userLogin);
router.put('/forgot-password', forgotPasswordValidator, runValidation, forgotPassword);
router.put('/reset-password', resetPasswordValidator, runValidation, resetPassword);


module.exports = router;
