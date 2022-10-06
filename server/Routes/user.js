const express = require('express');
const router = express.Router();
// import from controllers
const { getUserInfo,update } = require('../controllers/user');
const {authMiddle,authMiddleAdmin,requireSignin}=require("../middleware/auth");
const {userUpdateValidator}=require("../validators/auth")
const {runValidation}=require("../validators/index")

router.get('/', requireSignin,authMiddle,getUserInfo);
router.get('/admin', requireSignin,authMiddleAdmin,getUserInfo);
router.put('/', userUpdateValidator, runValidation, requireSignin, authMiddle, update);



module.exports = router;
