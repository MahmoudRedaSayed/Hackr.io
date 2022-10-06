const express = require('express');
const router = express.Router();

// validators
const { linkCreateValidator, linkUpdateValidator } = require('../validators/link');
const { runValidation } = require('../validators');

// controllers
const { requireSignin, authMiddle ,authMiddleAdmin} = require('../middleware/auth');
const { create, list, read, update, remove,clickCount } = require('../controllers/link');

// routes
router.post('/link', linkCreateValidator, runValidation, requireSignin, authMiddle, create);
router.post('/links',requireSignin, authMiddleAdmin, list);
router.get('/link/:id', read);
router.put('/link/:id', linkUpdateValidator, runValidation, requireSignin, authMiddle, update);
router.delete('/link/:id', requireSignin, authMiddle, remove);
router.put('/link/admin/:id', linkUpdateValidator, runValidation, requireSignin, authMiddleAdmin, update);
router.delete('/link/admin/:id', requireSignin, authMiddleAdmin, remove);
router.put('/click-count', clickCount);


module.exports = router;
