const express = require('express');
const router = express.Router();

// validators
const { linkCreateValidator, linkUpdateValidator } = require('../validators/link');
const { runValidation } = require('../validators');

// controllers
const { requireSignin, authMiddle ,authMiddleAdmin} = require('../middleware/auth');
const { create, list, read, update, remove,clickCount, popular, popularInCategory } = require('../controllers/link');

// routes
router.post('/link', linkCreateValidator, runValidation, requireSignin, authMiddle, create);
router.post('/links',requireSignin, authMiddleAdmin, list);
router.get('/link/popular', popular);
router.get('/link/popular/:slug', popularInCategory);
router.put('/link/admin/:id', linkUpdateValidator, runValidation, requireSignin, authMiddleAdmin, update);
router.delete('/link/admin/:id', requireSignin, authMiddleAdmin, remove);
router.get('/link/:id', read);
router.put('/link/:id', linkUpdateValidator, runValidation, requireSignin, authMiddle, update);
router.delete('/link/:id', requireSignin, authMiddle, remove);
router.put('/click-count', clickCount);


module.exports = router;
