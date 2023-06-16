const express =require('express');
const router=express.Router();
const controller=require('../controller/categoryController');

//--------------- Add --------------- 
router.get('/',controller.add);
router.post('/add_data',controller.add_data);
//--------------- view --------------- 
router.get('/view_page',controller.view_page);
//delet

router.get('/delet/:id',controller.delet);
router.post('/mulDel',controller.mulDel);
//edit
router.get('/edit_page/:id',controller.edit_page);
router.post('/edit',controller.edit);

// ----------------------------------
module.exports=router;