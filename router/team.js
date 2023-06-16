const express=require('express');
const router=express.Router();
const team=require('../model/team_model');
const controller=require('../controller/teamController');

//--------------- Add --------------- 
router.get('/',controller.add);
router.post('/add_data',team.upImg,controller.add_data);
//--------------- view --------------- 
router.get('/view_page',controller.view_page);
//edit
router.get('/edit_page/:id',controller.edit_page);
router.post('/edit',team.upImg,controller.edit);
//delate
router.get('/delet/:id',controller.delet);
router.post('/mulDel',controller.mulDel);

// ----------------------------------
module.exports=router;