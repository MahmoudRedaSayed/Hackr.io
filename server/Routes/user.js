const express = require('express');
const router = express.Router();
// import from controllers
const { getUserInfo } = require('../controllers/user');
const {authMiddle,authMiddleAdmin,requireSignin}=require("../middleware/auth");

router.get('/', requireSignin,authMiddle,getUserInfo);
router.get('/admin', requireSignin,authMiddleAdmin,getUserInfo);


module.exports = router;
