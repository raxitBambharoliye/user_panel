const express = require('express');
const passport = require('passport');
const router = express.Router();
const blog = require('../model/blog_model');
const controller = require('../controller/blogController');

//--------------- Add --------------- 
router.get('/', controller.add);
router.post('/add_data', blog.upImg, controller.add_data);
//--------------- view -------------- 
router.get('/view_page', controller.view_page);
//delet
router.get('/delet/:id', controller.delet);
router.post('/mulDel',controller.mulDel);
//edit
router.get('/edit_page/:id', controller.edit_page);
router.post('/edit_data', blog.upImg, controller.edit_data);
// comment 
router.get('/view_comment',controller.view_comment)
// ----------------------------------
module.exports = router;