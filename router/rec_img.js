const express = require('express');
const passport = require('passport');
const router = express.Router();
const rec_img = require('../model/rec_img_model');
const controller = require('../controller/rec_imgController');
//--------------- Add --------------- 
router.get('/', controller.add);
router.post('/add_data', rec_img.upImg, controller.add_data);

//--------------- view --------------- 
router.get('/view_page', controller.view_page);
//edit
router.get('/delet/:id', controller.delet);
router.post('/mulDel', controller.mulDel);
//delate
router.get('/edit_page/:id', controller.edit_page);
router.post('/edit_data', rec_img.upImg, controller.edit_data);

// ----------------------------------

module.exports = router;