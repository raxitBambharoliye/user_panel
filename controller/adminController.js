const admin = require('../model/admin');
const bcrypt = require('bcrypt')
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

// *************** login start ***************
//login ('/') page
module.exports.login = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/desh')
    } else {
        return res.render('login')
    }
}
//login page render
module.exports.login_re = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/desh')
    } else {
        req.flash('error', 'Invalid Email Id or Password')
        return res.redirect('/login_page')
    }
}
//login post (dashboard redirect )
module.exports.loginData = (req, res) => {
    req.flash("sucess", `welcome back ${req.user.name} `);
    return res.redirect('/desh');
}
// *************** login end ***************

// ------------------------------------------------------

// *************** forget password start ***************
// email
module.exports.forget_email = async (req, res) => {

    try {
        let email = await admin.findOne({ email: req.body.email });
        var otp = Math.ceil(Math.random() * 100000);
        if (email) {
            var transporter = nodemailer.createTransport({
                host: "sandbox.smtp.mailtrap.io",
                port: 2525,
                auth: {
                    user: "ea19293856fa8c",
                    pass: "268d734f50c217"
                }
            });
            let info = await transporter.sendMail({
                from: 'raxitbambharoliya000@gmial.com', // sender address
                to: "radhe.developer666@gmail.com", // list of receivers
                subject: "your otp ", // Subject line
                text: ` `, // plain text body
                html: `<h1>your otp is  : ${otp}</h1>`, // html body"
            });
            var cookie_otp = await bcrypt.hash(otp.toString(), 10);
            res.cookie('otp', cookie_otp);
            res.cookie('email', req.body.email);
            req.flash('sucess', 'otp sended in your email ');
            res.redirect('/otp_page');
        } else {
            req.flash('error', "invalid email");
            return res.redirect('back');
        }
    } catch (err) {
        console.log('', err);
    }
}

// otp
module.exports.forget_otp = async (req, res) => {
    if (await bcrypt.compare(req.body.otp, req.cookies.otp)) {
        res.redirect('/forget_password');
    } else {
        req.flash('error', 'invalid otp! ')
        res.redirect('back');
    }
}

// password
module.exports.forget_password = async (req, res) => {
    try {
        let data = await admin.findOne({ email: req.cookies.email });
        if (req.body.new_password == req.body.con_password) {
            let pass = await bcrypt.hash(req.body.new_password, 10);
            let changed = await admin.findByIdAndUpdate(data.id, { password: pass })
            if (changed) {
                res.clearCookie('otp');
                res.clearCookie('email');
                req.flash('sucess', 'password rested successful ');
                res.redirect('/');
            }
        }
        else {
            req.flash('error', 'password not same ')
            res.redirect('back');
        }
    } catch (err) {
        console.log('forget password ', err);
    }
}
// ***************forget password end ***************

// ------------------------------------------------------

// *************** dashboard start ***************
module.exports.deshbord = (req, res) => {
    res.render('deshbord');
}
// *************** dashboard end ***************

// ------------------------------------------------------

// *************** admin start ***************
//add admin page
module.exports.admin_add = (req, res) => {
    res.render('admin_add');
}
// add admin post
module.exports.addData = async (req, res) => {
    try {
        let ip = '';
        if (req.file) {
            ip = admin.upPath + '/' + req.file.filename;
        }

        const nDate = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Calcutta'
        });

        req.body.createdAt = nDate;
        req.body.updatedAt = nDate;
        req.body.isActive = true;
        req.body.image = ip;
        req.body.name = req.body.fname + " " + req.body.lname;
        let pass = await bcrypt.hash(req.body.password, 10)
        req.body.password = pass;

        let data = await admin.create(req.body);
        if (data) {
            req.flash('sucess', `${req.body.name} add as a Admin`);
            res.redirect('/admin_add');
        }
    } catch (err) {
        req.flash('error', 'Enter All Information')
        res.redirect('back');
    }
}
//admin view
module.exports.admin_view = async (req, res) => {

    try {
        let data = await admin.find();
        if (data) {
            return res.render('admin_view', ({ data: data }));
        } else {
            console.log("admin veiw data find err");
        }
    } catch (err) {
        console.log("admin_view err in catch : ", err);
    }
}
//admin delet
module.exports.deletData = async (req, res) => {
    try {
        let obj = await admin.findById(req.params.id);

        //delate old image in folder
        let ip = path.join(__dirname, '..', obj.image);
        fs.unlinkSync(ip);

        //delate all data form data base 
        let data = await admin.findByIdAndDelete(req.params.id);
        if (data) {
            req.flash("sucess", `${obj.name} Admin Deleted `);
            return res.redirect('/admin_view');
        }

    } catch (error) {
        console.log("data delet err in catch : ", error);
    }
}
//admin edit page
module.exports.edit_page = async (req, res) => {

    try {
        let data = await admin.findById(req.params.id);
        if (data) {
            return res.render('admin_edit', ({ data: data }));
        }

    } catch (error) {
        console.log('edit page lode err in catch');
    }
}
//admin edit post
module.exports.upData = async (req, res) => {
    let id = req.body.eid;
    try {
        //if image updated 
        if (req.file) {
            let data = await admin.findById(id);
            if (data) {
                //delate old image in folder
                let ip = path.join(__dirname, '..', data.image);
                fs.unlinkSync(ip);
                //insert new image path in body 
                req.body.image = admin.upPath + "/" + req.file.filename;
                req.body.name = req.body.fname + " " + req.body.lname;
                //find by id and update data in data base
                let update = await admin.findByIdAndUpdate(id, req.body);
                if (update) {
                    req.flash("sucess", `Admin Updated `);
                    return res.redirect('/admin_view');
                } else {
                    return res.redirect('back');
                    console.log('data not updated (if) ');
                }
            }
        }
        //else image not updated
        else {
            let data = await admin.findById(id);
            if (data) {
                //set old image in body
                req.body.image = data.image;
                req.body.name = req.body.fname + " " + req.body.lname;
                //find by id and update
                let update = await admin.findByIdAndUpdate(id, req.body);
                if (update) {
                    req.flash("sucess", `Admin Updated `);
                    return res.redirect('/admin_view');
                } else {
                    return res.redirect('back');
                    console.log('data not updated (else) ');
                }
            }
            else {
                console.log("update data not found in (else)");
            }
        }
    } catch (error) {
        console.log("data  update err : ", error);
    }
}
// *************** admin end ***************

// ------------------------------------------------------

// *************** update password start ***************
//change password page
module.exports.password = (req, res) => {
    res.render('password')
}
//change password post
module.exports.cpass = async (req, res) => {
    try {
        //old password check
        if (await bcrypt.compare(req.body.password, req.user.password)) {
            //new password and old password check
            if (req.body.password != req.body.Npassword) {
                //new password and conform password check
                if (req.body.Npassword == req.body.Cpassword) {
                    let pass = await bcrypt.hash(req.body.Npassword, 10);
                    //update password 
                    let update = await admin.findByIdAndUpdate(req.user.id, { password: pass });
                    if (update) {
                        req.flash("sucess", `Password Changed Successful`);
                        return res.redirect('/logout');
                    } else {
                        req.flash('error', 'Password Not Match ');
                        console.log("password not changed");
                    }
                } else {
                    req.flash('error', 'Password Not Match')
                    res.redirect('back');
                }
            } else {
                req.flash('error', 'enter defrent password')
                res.redirect('back');
            }
        } else {
            req.flash('error', 'invalid password');
            return res.redirect('back');
        }
    } catch (err) {
        console.log('change password err : ', err);
    }
}
// *************** update password end ***************

// ------------------------------------------------------

// *************** profile start ***************
//profile page
module.exports.profile = (req, res) => {

    return res.render('profile');

}
//edit profile page
module.exports.editProfile = (req, res) => {
    res.render('edit_profile');
}
//edit profile post
module.exports.upProfile = async (req, res) => {
    let id = req.user.id;
    try {
        //image updated 
        if (req.file) {
            let data = await admin.findById(id);
            if (data) {
                //delate old profile photo in folder 
                let ip = path.join(__dirname, '..', data.image);
                fs.unlinkSync(ip);
                // add new image path in body
                req.body.image = admin.upPath + "/" + req.file.filename;
                req.body.name = req.body.fname + " " + req.body.lname;
                //find by id and update
                let update = await admin.findByIdAndUpdate(id, req.body);
                if (update) {
                    req.flash("sucess", `Profile Updated Successful`);
                    return res.redirect('/logout');
                } else {
                    req.flash('error', 'Enter All Information');
                    return res.redirect('back');
                }
            }
        } else {
            let data = await admin.findById(id);
            if (data) {
                //enter old image in body
                req.body.image = data.image;
                req.body.name = req.body.fname + " " + req.body.lname;
                //find by id and update 
                let update = await admin.findByIdAndUpdate(id, req.body);
                if (update) {
                    req.flash("sucess", `Profile Updated Successful`);
                    return res.redirect('/logout');
                } else {
                    req.flash('error', 'Enter All Information');
                    return res.redirect('back');
                }
            } else {
                console.log("update data not found in (else)");
            }
        }
    } catch (error) {
        console.log("data  update err : ", error);
    }
}
// *************** profile end ***************

// ------------------------------------------------------

// *************** logout ***************
module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            console.log('log out err : ', err);
        } else {
            res.redirect('/');
        }
    })
}