const express = require('express'); 
const router = express.Router(); 

const saucesCtrl = require('../controllers/sauces'); 
const auth = require('../middlewares/auth'); 
const multer = require('../middlewares/multer-config'); 

router.get('/', auth, saucesCtrl.getAllSauces); 
router.get('/:id', auth, saucesCtrl.getOneSauce); 
router.post('/', auth, multer, saucesCtrl.createOneSauce); 
router.put('/:id', auth, multer, saucesCtrl.modifyOneSauce); 
router.delete('/:id', auth, saucesCtrl.deleteOneSauce); 
router.post('/:id/like', auth, saucesCtrl.speakUpOneSauce); 

module.exports = router; 