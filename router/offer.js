const express = require('express');
const router = express.Router();
const controller = require('../controller/offerController');

//--------------- Add --------------- 
router.get('/', controller.add);
router.post('/add_data', controller.add_data);

//--------------- view --------------- 
router.get('/view_page', controller.view_page);
//edit
router.get('/delet/:id', controller.delet);
router.post('/mulDel', controller.mulDel);
//delate
router.get('/edit_page/:id', controller.edit_page);
router.post('/edit', controller.edit);

// ----------------------------------

module.exports = router;