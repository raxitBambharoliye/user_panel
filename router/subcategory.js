const express = require('express');
const subcategory = require('../model/subcategory_model');
const router = express.Router();
const controller = require('../controller/subcategotyController');

//--------------- Add --------------- 
router.get('/', controller.add);
router.post('/add_data', subcategory.upImg, controller.add_data);
//--------------- view --------------- 
router.get('/view_page', controller.view_page);
//edit
router.get('/delet/:id', controller.delet);
router.get('/edit_page/:id', controller.edit_page);
//delate
router.post('/edit', subcategory.upImg, controller.edit);
router.post('/mulDel', controller.mulDel)

// ----------------------------------
module.exports = router;