const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const nameImage = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce');

router.post('/', auth, nameImage, sauceCtrl.createSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, nameImage, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;