const express = require('express');
const router = express.Router();

// validators
const { linkCreateValidator, linkUpdateValidator } = require('../validators/link');
const { runValidation } = require('../validators');

// controllers
const { requireSignin, authMiddle } = require('../middleware/auth');
const { create, list, read, update, remove } = require('../controllers/link');

// routes
router.post('/link', linkCreateValidator, runValidation, requireSignin, authMiddle, create);
router.get('/links', list);
router.get('/link/:slug', read);
router.put('/link/:slug', linkUpdateValidator, runValidation, requireSignin, authMiddle, create);
router.delete('/link/:slug', requireSignin, authMiddle, remove);
router.put('/click-count', clickCount);


module.exports = router;
