const express = require('express');
const router = express.Router();
const controller = require('../controller/clientController');
const client = require('../model/client_model');

//--------------- Add --------------- 
router.get('/', controller.add);
router.post('/add_data', client.upImg, controller.add_data);

//--------------- view --------------- 
router.get('/view_page', controller.view_page);
//edit
router.get('/edit_page/:id', controller.edit_page);
router.post('/edit', client.upImg, controller.edit);
//delate
router.get('/delet/:id', controller.delet);
router.post('/mulDel', controller.mulDel);

// ----------------------------------

module.exports = router;