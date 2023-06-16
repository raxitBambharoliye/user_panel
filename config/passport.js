const passport = require('passport');
const passport_local = require('passport-local').Strategy;
const admin=require('../model/admin');
const bcrypt=require('bcrypt');

passport.use(new passport_local({
    usernameField: "email"
},async (email,password,done)=>{
    let data=await admin.findOne({email:email});
    if(data){   
        let pass= await bcrypt.compare(password,data.password);
        if(pass){
            done(null,data);
        }else{
            done(null,false);
        }
    }else{
        done(null,false);
    }
}));

passport.serializeUser((user,done)=>{
    done(null,user.id);
})

passport.deserializeUser(async(id,done)=>{
    let user=await admin.findById(id);
    if(user){
        done(null,user);
    }else{
        done(null,false);
    }
})

passport.setAuthenticated=(req,res,next)=>{
    if(req.isAuthenticated()){
        next();
    }else{
        res.redirect('/');
    }
}

passport.setAuthenticatedUser=(req,res,next)=>{
    if(req.isAuthenticated()){

        res.locals.admins=req.user;
    }
        next();
}

module.exports=passport;