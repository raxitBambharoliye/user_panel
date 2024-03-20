const express = require('express');
const db = require('./config/mongodb');
const path = require('path');
const cookie = require('cookie-parser');
const http = require('http');
// passport
const passport_local = require('./config/passport');
const passport = require('passport');
const session = require('express-session');
//flash 
const flash = require('express-flash');
const flash_mid = require('./config/flash_middleware');

// !!!!!!!!!!!!!!!!!!!!Server Start!!!!!!!!!!!!!!!!!!!!

const app = express();
// ejs paths
    app.use(express.urlencoded());
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'view'));
//image folder
    app.use('/uplod', express.static(path.join(__dirname, 'uplod')));
//cookie-parser
    app.use(cookie());
//assets paths
    app.use(express.static('user_assets'));
    app.use(express.static('assets'));
//session
    app.use(session({
        name: 'passport',
        secret: 'pass',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 100 * 60 * 60
        }
    }))
//passport authenticated
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(passport.setAuthenticatedUser);
//flash message
    app.use(flash());
    app.use(flash_mid.setflash);
//index router
    app.use('/', require('./router/index'));

// !!!!!!!!!!!!!!!!!!!!Server End!!!!!!!!!!!!!!!!!!!!

 let server = http.createServer(app);


server.listen(8009, (err) => {
    if (err) {
        console.log("server not running ", err);
        return false;
    }
    console.log("server is running , 8009");
});
