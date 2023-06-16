const path = require('path')
const fs = require('fs');
const rec_img = require('../model/rec_img_model');

const nDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Calcutta'
});
// *************** Add Resent Image Start ***************
//add Resent Image Page
module.exports.add = (req, res) => {
    res.render('rec_img');
}
//Resent Image Post
module.exports.add_data = async (req, res) => {
    try {
        let i = '';
        if (req.file) {
            i = rec_img.upPath + '/' + req.file.filename;
        }

        req.body.createdAt = nDate;
        req.body.updatedAt = nDate;
        req.body.isActive = true;
        req.body.image = i;

        let data = await rec_img.create(req.body);
        if (data) {
            req.flash("sucess", `Resent Image Added Successfully`);
            res.redirect('/rec_img');
        }
    } catch (err) {
        console.log('rec_img data add err ', err);
    }

}
// *************** Add Resent Image end ***************

// ------------------------------------------------------

// *************** view Resent Image Start ***************
// view Resent Image
module.exports.view_page = async (req, res) => {
    try {



        if (req.query.status == 'deActive') {
            let Active = await rec_img.findByIdAndUpdate(req.query.id, { isActive: false });
        }
        if (req.query.status == 'Active') {
            let Active = await rec_img.findByIdAndUpdate(req.query.id, { isActive: true });
        }

        var search = '';
        var pre_page = 2;
        var page = 1;

        if (req.query.search) {
            search = req.query.search;
        }
        if (req.query.page) {
            page = req.query.page;
        }

        //search and pagination
        let data_count = await rec_img.find({
            $or: [
                { title: { $regex: '.*' + search + '.*', $options: 'i' } },
                { content: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        }).countDocuments();
        let page_num = Math.ceil(data_count / pre_page);

        let data = await rec_img.find({
            $or: [
                { title: { $regex: '.*' + search + '.*', $options: 'i' } },
                { content: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        }).limit((pre_page) * 1)
            .skip((page - 1) * pre_page)
            .exec();

        //page render 
        if (data) {
            res.render('rec_img_view', ({
                data: data,
                page_num: page_num,
                cpage: page,
                search: search
            }));
        }

    } catch (error) {
        console.log("rec_img view_page err : ", error);
    }
}
// delate Resent Image
module.exports.delet = async (req, res) => {
    try {
        let data = await rec_img.findById(req.params.id);
        if (data) {
            let img = path.join(__dirname, '..', data.image);
            if (img) {
                fs.unlinkSync(img);
            }
            let delet = await rec_img.findByIdAndDelete(req.params.id);
            if (delet) {
                req.flash("sucess", `Resent Image Dilated Successfully`);
                res.redirect('/rec_img/view_page')
            }
        }

    } catch (error) {
        console.log("rec_img delet : ", error);
    }
}
//edit Resent Image page
module.exports.edit_page = async (req, res) => {
    try {
        let data = await rec_img.findById(req.params.id);
        if (data) {
            res.render('rec_img_edit', ({ data: data }))
        }
    } catch (error) {
        console.log("rec_img edit_page err : ", error);
    }
}
//edit Resent Image post 
module.exports.edit_data = async (req, res) => {
    try {
        let id = req.body.eid;
        req.body.updatedAt = nDate;
        let data = await rec_img.findById(id);
        if (data) {
            if (req.file) {
                let di = path.join(__dirname, '..', data.image);
                fs.unlinkSync(di);

                req.body.image = rec_img.upPath + "/" + req.file.filename;

                let update = await rec_img.findByIdAndUpdate(id, req.body);
                if (update) {
                    req.flash("sucess", `Resent Image Updated Successfully`);
                    res.redirect('/rec_img/view_page');
                }
            } else {
                req.body.image = data.image;
                let update = await rec_img.findByIdAndUpdate(id, req.body);
                if (update) {
                    req.flash("sucess", `Resent Image Updated Successfully`);
                    res.redirect('/rec_img/view_page');
                }
            }
        }
    } catch (error) {
        console.log("rec_img edig_data : ", error);
    }
}
//multiple delate
module.exports.mulDel = async (req, res) => {
    try {
        let ids = req.body.mulDel;
        ids.forEach(async element => {
            let data = await rec_img.findById(element);
            i = path.join(__dirname, '..', data.image);
            fs.unlinkSync(i);

            await rec_img.findByIdAndDelete(element);
        });
        req.flash("sucess", `All Resent Image Dilated Successfully`);
        return res.redirect('/rec_img/view_page')
    } catch (error) {
        console.log('rec_img mul delt err ');
    }
}
// *************** view Resent Image end ***************

// ------------------------------------------------------
