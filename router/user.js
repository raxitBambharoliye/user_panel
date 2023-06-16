const express=require('express');
const router=express.Router();
const controller=require('../controller/userController');

//index
router.get('/',controller.index);
//blog single
router.get('/blog_single',controller.blog_single);
//gallery
router.get('/gallery',controller.gallery);
//service
router.get('/service',controller.service)
//blog
router.get('/blog',controller.blog)
//about
router.get('/about',controller.about)
//contact
router.get('/contact',controller.contact)
//contact email
router.post('/contact_mail',controller.contact_mail)

// -----------------------------------------------------
module.exports=router;