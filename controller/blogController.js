const blog = require('../model/blog_model')
const comment = require('../model/comment_model')
const path = require('path');
const fs = require('fs');

//for updateAt & createdAt 
const nDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Calcutta'
});
//for Add Date 
Date.prototype.toShortFormat = function () {

    const monthNames = ["Jan", "Feb", "Mar", "Apr",
        "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec"];

    const day = this.getDate();

    const monthIndex = this.getMonth();
    const monthName = monthNames[monthIndex];

    const year = this.getFullYear();

    return `${day}-${monthName}-${year}`;
}

// *************** add Blog  Start ***************
//add blog page
module.exports.add = async (req, res) => {
    res.render('blog');
}
//add blog post
module.exports.add_data = async (req, res) => {
    try {
        //set image path  
        let anyDate = new Date();
        let i = '';
        if (req.file) {
            i = blog.upPath + '/' + req.file.filename;
        }

        //set all data in body
        req.body.image = i;
        req.body.name = req.user.name;
        req.body.date = anyDate.toShortFormat();
        req.body.createdAt = nDate;
        req.body.updatedAt = nDate;
        req.body.isActive = true;

        //create 
        let data = await blog.create(req.body);
        if (data) {
            req.flash("sucess", `Blog Added Successful`);
            res.redirect('/blog');
        }
    } catch (err) {
        console.log('blog data add err ', err);
    }

}
// *************** add Blog  end ***************

// ------------------------------------------------------

// *************** view Blog Start ***************
//view page
module.exports.view_page = async (req, res) => {
    try {
        //active deActive 
        if (req.query.status == 'deActive') {
            await blog.findByIdAndUpdate(req.query.id, { isActive: false });
        }
        if (req.query.status == 'Active') {
            await blog.findByIdAndUpdate(req.query.id, { isActive: true });
        }

        //search & pagenition

        let page = 1;
        let pre_page = 2;
        let search = '';

        if (req.query.search) {
            search = req.query.search;
        }
        if (req.query.page) {
            page = req.query.page;
        }

        let data_num = await blog.find({
            $or: [
                { title: { $regex: '.*' + search + '.*', $options: 'i' } },
                { name: { $regex: '.*' + search + '.*', $options: 'i' } },
                { date: { $regex: '.*' + search + '.*', $options: 'i' } },
                { Content: { $regex: '.*' + search + '.*', $options: 'i' } },
                { category: { $regex: '.*' + search + '.*', $options: 'i' } },
            ]
        }).countDocuments();
        let page_num = Math.ceil(data_num / pre_page);


        let data = await blog.find({
            $or: [
                { title: { $regex: '.*' + search + '.*', $options: 'i' } },
                { name: { $regex: '.*' + search + '.*', $options: 'i' } },
                { date: { $regex: '.*' + search + '.*', $options: 'i' } },
                { Content: { $regex: '.*' + search + '.*', $options: 'i' } },
                { category: { $regex: '.*' + search + '.*', $options: 'i' } },
            ]
        })
            .limit((pre_page) * 1)
            .skip((page - 1) * pre_page)
            .exec();

        //render
        if (data) {
            res.render('blog_view', ({
                data: data,
                page_num: page_num,
                cpage: page,
                search: search
            }));
        }
    } catch (error) {
        console.log("blog view_page", error);
    }
}
//single delate 
module.exports.delet = async (req, res) => {
    try {
        let data = await blog.findById(req.params.id);
        let comment_data = await comment.find({});
        if (data) {

            let this_post = comment_data.filter((user) => user.post_id == req.params.id);
            this_post.forEach(async element => {
                let data = await comment.findById(element.id);
                let i = path.join(__dirname, '..', data.image);
                fs.unlinkSync(i);
                await comment.findByIdAndDelete(data.id);
            });

            //delate image in folder 
            let img = path.join(__dirname, '..', data.image);
            if (img) {
                fs.unlinkSync(img);
            }
            //delate record in database
            let delet = await blog.findByIdAndDelete(req.params.id);
            if (delet) {
                req.flash("sucess", `Blog Delated Successful`);
                res.redirect('/blog/view_page')
            }
        }
    } catch (error) {
        console.log("blog  delet", error);
    }
}
//multiple delate
module.exports.mulDel = async (req, res) => {
    try {
        //ids array
        let ids = req.body.mulDel;
        //delate in loop 
        let comment_data = await comment.find({});
        ids.forEach(async element => {
            //delate comment 
            let this_post = comment_data.filter((user) => user.post_id == element);
            this_post.forEach(async element => {
                let data_comment = await comment.findById(element.id);
                let ic = path.join(__dirname, '..', data_comment.image);
                fs.unlinkSync(ic);
                await comment.findByIdAndDelete(data_comment.id);
            });

            //delate image form folder 
            let data = await blog.findById(element);
            let i = path.join(__dirname, '..', data.image);
            fs.unlinkSync(i);
            //delate data from data base
            await blog.findByIdAndDelete(element);
        });
        req.flash("sucess", `All Blogs are Delate`);
        return res.redirect('/blog/view_page')
    } catch (error) {
        console.log('muldel err in say ', error);
    }
}
//edit page
module.exports.edit_page = async (req, res) => {
    try {
        let data = await blog.findById(req.params.id);
        if (data) {
            res.render('blog_edit', ({ data: data }))
        }
    } catch (error) {
        console.log("edit_page err : ", error);
    }
}
//edit page post
module.exports.edit_data = async (req, res) => {
    try {
        let id = req.body.eid;
        req.body.updatedAt = nDate;

        let data = await blog.findById(id);
        if (data) {
            //if image updated 
            if (req.file) {
                //delate old image from folder
                let di = path.join(__dirname, '..', data.image);
                fs.unlinkSync(di);

                // enter new image path in body
                req.body.image = blog.upPath + "/" + req.file.filename;;
                //find by id and update 
                let update = await blog.findByIdAndUpdate(id, req.body);
                if (update) {
                    req.flash("sucess", `Blog Updated Successful`);
                    res.redirect('/blog/view_page');
                }
            }
            //image not updated
            else {
                //add old image in body
                req.body.image = data.image;
                //find by id and update 
                let update = await blog.findByIdAndUpdate(id, req.body);
                if (update) {
                    req.flash("sucess", `Blog Updated Successful`);
                    res.redirect('/blog/view_page');
                }
            }
        }
    } catch (error) {
        console.log("blog edit_data", error);
    }
}
// *************** view Blog end ***************

// --------------------------------------------------------------------------------
// --------------------------------------------------------------------------------

// comment view
module.exports.view_comment = async (req, res) => {
    //active & deActive
    if (req.query.status == 'deActive') {
        let Active = await comment.findByIdAndUpdate(req.query.id, { isActive: false });
    }

    if (req.query.status == 'Active') {
        let Active = await comment.findByIdAndUpdate(req.query.id, { isActive: true });
    }

    //search & pagination
    let search = '';
    let per_page = 2;
    let page = 1;

    if (req.query.search) {
        search = req.query.search;
    }
    if (req.query.page) {
        page = req.query.page;
    }

    let page_num = await comment.find({
        $or: [
            { name: { $regex: '.*' + search + '.*', $options: 'i' } },
            { date: { $regex: '.*' + search + '.*', $options: 'i' } },
            { email: { $regex: '.*' + search + '.*', $options: 'i' } },
        ]
    }).countDocuments();
    let t_page = Math.ceil(page_num / per_page);

    let comment_data = await comment.find({
        $or: [
            { name: { $regex: '.*' + search + '.*', $options: 'i' } },
            { date: { $regex: '.*' + search + '.*', $options: 'i' } },
            { email: { $regex: '.*' + search + '.*', $options: 'i' } },
        ]
    })
        .populate('post_id')
        .limit(per_page * 1)
        .skip((page - 1) * per_page)
        .exec();

    //render page
    return res.render('comment_view',
        ({
            comment: comment_data,
            search: search,
            page: page,
            cpage: page,
            page_num: t_page
        }))
}

