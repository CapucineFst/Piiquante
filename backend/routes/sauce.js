const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const nameImage = require('../middleware/multer-config');
const sauceCtrl = require('../controllers/sauce');

// Routes that will be used for all the interactions with the sauce, some uses multer and all require an auth
router.post('/', auth, nameImage, sauceCtrl.createSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, nameImage, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;