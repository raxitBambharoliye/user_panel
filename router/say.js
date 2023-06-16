const express = require('express');
const router = express.Router();
const controller = require('../controller/sayController');

//--------------- Add --------------- 
router.get('/', controller.add);
router.post('/add_data', controller.add_data);

//--------------- view --------------- 
router.get('/view_page', controller.view_page);
//edit
router.get('/delet/:id', controller.delet);
router.post('/delMul', controller.delMul);
//delate
router.get('/edit_page/:id', controller.edit_page);
router.post('/edit', controller.edit);

// ----------------------------------

module.exports = router;