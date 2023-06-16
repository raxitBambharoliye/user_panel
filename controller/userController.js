const slider = require("../model/slider_model");
const offer = require("../model/offer_model");
const rec_img_mo = require('../model/rec_img_model');
const say_mo = require('../model/say_model');
const blog_mo = require('../model/blog_model');
const comment_mo = require('../model/comment_model');
const category_mo = require('../model/category_model');
const subcategory_mo = require('../model/subcategory_model');
const team_mo = require('../model/team_model');
const client_mo = require('../model/client_model');
const nodemailer = require('nodemailer');
// index 
module.exports.index = async (req, res) => {
  try {


    let slider_data = await slider.find({ isActive: true });
    let offer_data = await offer.find({ isActive: true }).sort({ _id: -1 }).limit(3);
    let rec_img_data = await rec_img_mo.find({ isActive: true });
    let blog = await blog_mo.find({ isActive: true }).sort({ _id: -1 }).limit(3);
    let say = await say_mo.find({ isActive: true });



    if (offer_data) {

      res.render("user/index_user", {
        slider: slider_data,
        offer: offer_data,
        rec_img: rec_img_data,
        say: say,
        blog: blog,
      });

    }
  } catch (err) {
    console.log("slider data send err in index", err);
  }
};
//blog single
module.exports.blog_single = async (req, res) => {
  try {

    let id = req.query.id;
    var blog = await blog_mo.findById(id);

    // comment
    let comment = await comment_mo.find({ post_id: id, isActive: true });
    let comment_count = await comment_mo.find({ post_id: req.query.id, isActive: true }).countDocuments();

    // next previous
    var blogs_array = await blog_mo.find({});
    var blogs_ids = [];
    blogs_array.forEach(element => {
      blogs_ids.push(element.id);
    });
    let next = '';
    for (var i = 0; i < blogs_array.length; i++) {
      if (blogs_array[i] == id) {
        next = i;
      }
    }

    next = blogs_ids.indexOf(id);

    // ----end next previous -----

    //resent blog
    var latest = await blog_mo.find({ isActive: true }).sort({ _id: -1 }).limit(3);

    //gallary
    var gallary = await blog_mo.find({ isActive: true }).sort({ _id: -1 }).limit(6);


    // render
    res.render('user/blog_single', ({
      resent: latest,
      blog: blog,
      comment_count: comment_count,
      comment: comment,
      next: next,
      pre: next,
      blogs_ids: blogs_ids,
      gallary: gallary
    }))

  } catch (error) {
    console.log("blog_singel  err ", error);
  }
}
//gallery
module.exports.gallery = async (req, res) => {
  try {
    let cat_data = await category_mo.find({ isActive: true });
    let subcat_data = await subcategory_mo.find({ isActive: true });

    return res.render('user/gallery', ({ cat: cat_data, subcat: subcat_data }));

  } catch (error) {
    console.log("gallery page error in user : ", error);
  }
}
// service
module.exports.service = async (req, res) => {
  try {
    let data = await offer.find({ isActive: true });

    res.render('user/services', ({ data }));
  } catch (err) {
    console.log('user services', err);
  }
}
// blog
module.exports.blog = async (req, res) => {
  try {

    let search = '';
    if (req.query.search) {
      search = req.query.search;
    }

    let page = 1;
    if (req.query.page) {
      page = req.query.page;
    }
    let per_page = 6;

    let count = await blog_mo.find({
      isActive: true,
      $or: [
        { title: { $regex: '.*' + search + '.*', $options: 'i' } },
        { name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { date: { $regex: '.*' + search + '.*', $options: 'i' } },
        { Content: { $regex: '.*' + search + '.*', $options: 'i' } },
        { category: { $regex: '.*' + search + '.*', $options: 'i' } },
      ]
    }).countDocuments();

    let t_page = Math.ceil(count / per_page);

    let blog = await blog_mo.find({
      isActive: true,
      $or: [
        { title: { $regex: '.*' + search + '.*', $options: 'i' } },
        { name: { $regex: '.*' + search + '.*', $options: 'i' } },
        { date: { $regex: '.*' + search + '.*', $options: 'i' } },
        { Content: { $regex: '.*' + search + '.*', $options: 'i' } },
        { category: { $regex: '.*' + search + '.*', $options: 'i' } },
      ]
    }).limit(per_page * 1)
      .skip((page - 1) * per_page)
      .exec();

    res.render('user/blog', ({
      blog: blog,
      page_num: t_page,
      cpage: page,
      search: search
    }))
  } catch (err) {
    console.log('user services', err);
  }
}
// about
module.exports.about = async (req, res) => {
  try {
    let say = await say_mo.find({ isActive: true });
    let team = await team_mo.find({ isActive: true });
    let client_data = await client_mo.find({ isActive: true });

    res.render('user/about', ({
      say: say,
      team: team,
      client_data: client_data
    }))
  } catch (err) {
    console.log('user services', err);
  }
}
// contact
module.exports.contact = async (req, res) => {
  try {
    res.render('user/contact')
  } catch (err) {
    console.log('user services', err);
  }
}
//contact mail 
module.exports.contact_mail = async (req, res) => {
  try {
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
            to: req.body.email, // list of receivers
            subject: req.body.subject, // Subject line
            text: req.body.message, // plain text body
        });
        res.redirect('/user/contact');
    
} catch (err) {
    console.log('', err);
}
}