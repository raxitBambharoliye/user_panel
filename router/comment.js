const express=require('express');
const router=express.Router();
const controller=require('../controller/commentController');
const comment=require('../model/comment_model');
//--------------- Add --------------- 
router.post('/add_comment',comment.upImg,controller.add_comment);

//delate
router.get('/delet/:id',controller.delet);
router.post('/mulDel',controller.mulDel)

// ----------------------------------

module.exports=router;