const express = require('express');
const admin = require('../model/admin');
const passport = require('passport');
const router = express.Router();
const adminController = require('../controller/adminController');
//--------------- login start --------------- 
router.get('/', adminController.login);

router.get('/login_page', (req, res) => { res.render('login') })

router.post('/loginData', passport.authenticate('local', { failureRedirect: "/" }), adminController.loginData);
//--------------- login end --------------- 
//************************************************* */
//--------------- forget start --------------- 
router.get('/forget_email_page', (req, res) => { res.render('forget_email') })
router.post('/forget_email', adminController.forget_email);
router.get('/otp_page', (req, res) => {
    req.flash('sucess', 'otp sended in ypur email ');
    res.render('forget_otp')
});
router.post('/forget_otp', adminController.forget_otp);
router.get('/forget_password', (req, res) => { res.render('forget_password') });
router.post('/forget_password', adminController.forget_password);
//--------------- forget end --------------- 
//************************************************* */
//--------------- Admin start --------------- 
//dashboard
router.get('/desh', passport.setAuthenticated, adminController.deshbord);
//admin add page
router.get('/admin_add', passport.setAuthenticated, adminController.admin_add);
//admin add post 
router.post('/addData', passport.setAuthenticated, admin.upImg, adminController.addData);
//admin view 
router.get('/admin_view', passport.setAuthenticated, adminController.admin_view);
//delate admin
router.get('/deletData/:id', passport.setAuthenticated, adminController.deletData);
//edit admin page
router.get('/editPage/:id', passport.setAuthenticated, adminController.edit_page);
//edit admin post
router.post('/upData', passport.setAuthenticated, admin.upImg, adminController.upData);
//--------------- Admin end --------------- 
//************************************************* */
//--------------- Change Password start --------------- 
//password page
router.get('/password', passport.setAuthenticated, adminController.password);
//password post
router.post('/cpass', passport.setAuthenticated, adminController.cpass);
//--------------- Change Password end --------------- 
//************************************************* */
//--------------- Profile start --------------- 
//profile view
router.get('/profile', passport.setAuthenticated, adminController.profile);
//profile edit page
router.get('/editProfile/:id', passport.setAuthenticated, adminController.editProfile);
//profile edit post
router.post('/upProfile', passport.setAuthenticated, admin.upImg, adminController.upProfile);
//--------------- Profile end --------------- 
//************************************************* */
//logout
router.get('/logout', passport.setAuthenticated, adminController.logout);

//routers
//************************************************* */
//user 
router.use('/user', require('./user'));
//user comment
router.use('/comment', require('./comment'));

//slider
router.use('/slider', passport.setAuthenticated, require('./slider'));
//offer
router.use('/offer', passport.setAuthenticated, require('./offer'));
//recent image
router.use('/rec_img', passport.setAuthenticated, require('./rec_img'))
//review
router.use('/say', passport.setAuthenticated, require('./say'));
//blog
router.use('/blog', passport.setAuthenticated, require('./blog'));
//category for gallery
router.use('/category', passport.setAuthenticated, require('./category'));
//subcategory for gallery(gallery image)
router.use('/subcategory', passport.setAuthenticated, require('./subcategory'));
//team member
router.use('/team', passport.setAuthenticated, require('./team'));
//client
router.use('/client', passport.setAuthenticated, require('./client'));

//************************************************* */

module.exports = router;