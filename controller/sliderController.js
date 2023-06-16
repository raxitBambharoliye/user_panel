const slider = require('../model/slider_model');
const path = require('path')
const fs = require('fs');
const nDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Calcutta'
});
// *************** Add Slider Start ***************
//add Slider page
module.exports.add = (req, res) => {
    res.render('slider');
}
//add Slider post
module.exports.add_data = async (req, res) => {
    try {
        let i = '';
        if (req.file) {
            i = slider.upPath + '/' + req.file.filename;
        }

        req.body.image = i;
        req.body.createdAt = nDate;
        req.body.updatedAt = nDate;
        req.body.isActive = true;

        let data = await slider.create(req.body);
        if (data) {
            req.flash('sucess', 'slider inserted Successfully');
            res.redirect('/slider');
        }
    } catch (err) {
        console.log('addslider err ', err);
    }

}
// *************** Add Slider end ***************

// ------------------------------------------------------

// *************** view Slider Start ***************
//view Slider page 
module.exports.view_page = async (req, res) => {
    try {

        if (req.query.status == 'deActive') {
            let Active = await slider.findByIdAndUpdate(req.query.id, { isActive: false });
        }
        if (req.query.status == 'Active') {
            let Active = await slider.findByIdAndUpdate(req.query.id, { isActive: true });
        }

        let search = '';
        var page = 1;
        var per_page = 2;

        if (req.query.search) {
            search = req.query.search;
        }
        if (req.query.page) {
            page = req.query.page;
        }

        let data_count = await slider.find({
            $or: [
                { title: { $regex: '.*' + search + '.*', $options: 'i' } },
                { content: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        }).countDocuments();
        let pageNum = Math.ceil(data_count / per_page);


        let data = await slider.find({
            $or: [
                { title: { $regex: '.*' + search + '.*', $options: 'i' } },
                { content: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        }).limit(per_page * 1)
            .skip((page - 1) * per_page)
            .exec();

        if (data) {
            res.render('slider_view', ({
                data: data,
                pageNum: pageNum,
                cpage: page,
                search: search
            }));
        }
    } catch (error) {
        console.log("slider view_page err : ", error);
    }
}
//Delate  Slider 

module.exports.delet = async (req, res) => {
    try {
        let data = await slider.findById(req.params.id);
        if (data) {
            let img = path.join(__dirname, '..', data.image);
            if (img) {
                fs.unlinkSync(img);
            }
            let delet = await slider.findByIdAndDelete(req.params.id);
            if (delet) {
                req.flash('sucess', 'slider dilated  Successfully');
                res.redirect('/slider/view_page')
            }
        }
    } catch (error) {
        console.log("slider delet : ", error);
    }
}
//edit slider page
module.exports.edit_page = async (req, res) => {
    try {
        let data = await slider.findById(req.params.id);
        if (data) {
            res.render('slider_edit', ({ data: data }))
        }
    } catch (error) {
        console.log('slider edit_page err : ', error);
    }
}
//edit slider post
module.exports.edit = async (req, res) => {
    try {
        let id = req.body.eid;
        let data = await slider.findById(id);
        if (data) {
            if (req.file) {

                let di = path.join(__dirname, '..', data.image);
                fs.unlinkSync(di);

                req.body.image = slider.upPath + "/" + req.file.filename;
                req.body.updatedAt = nDate;

                let update = await slider.findByIdAndUpdate(id, req.body);
                if (update) {
                    req.flash('sucess', 'slider Updated Successfully');
                    res.redirect('/slider/view_page');
                }
            } else {

                req.body.image = data.image;
                req.body.updatedAt = nDate;

                let update = await slider.findByIdAndUpdate(id, req.body);
                if (update) {
                    req.flash('sucess', 'slider Updated Successfully');
                    res.redirect('/slider/view_page');
                }
            }
        }
    } catch (error) {
        console.log("slider edit err : ", error);
    }
}
//multiple delate
module.exports.mulDel = async (req, res) => {
    try {
        let data = req.body.mulDel;
        data.forEach(async element => {
            let id_data = await slider.findById(element);

            let i = path.join(__dirname, '..', id_data.image);
            fs.unlinkSync(i);

            await slider.findByIdAndDelete(element);
        });
        req.flash('sucess', 'All slider dilated Successfully');
        return res.redirect('/slider/view_page');
    } catch (error) {
        console.log('multi delet err : ', error);
    }
}

// *************** view Slider end ***************

// ------------------------------------------------------