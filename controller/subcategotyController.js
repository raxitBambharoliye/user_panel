const subcategory = require('../model/subcategory_model');
const category = require('../model/category_model');
const path = require('path');
const fs = require('fs');

const nDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Calcutta'
});

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
// *************** Add Subcategory Start ***************
//add Subcategory page
module.exports.add = async (req, res) => {
    let category_data = await category.find({ isActive: true });
    res.render('subcategory', ({ category: category_data }));
}
//add Subcategory post
module.exports.add_data = async (req, res) => {
    try {
        let i = '';
        let anyDate = new Date();
        if (req.file) {
            i = subcategory.upPath + '/' + req.file.filename;
        }
        req.body.image = i;
        req.body.isActive = true;
        req.body.createdAt = nDate;
        req.body.updatedAt = nDate;
        req.body.date = anyDate.toShortFormat();

        let data = await subcategory.create(req.body);
        if (data) {
            req.flash("sucess", `Subcategory Added Successfully`);
            res.redirect('back');
        }

    } catch (error) {
        console.log("add_data err in subcategory : ", error);
    }
}

// *************** Add Subcategory end ***************

// ------------------------------------------------------

// *************** view Subcategory Start ***************
//view Subcategory page 
module.exports.view_page = async (req, res) => {
    try {
        //active deActive
        if (req.query.status == 'deActive') {
            await subcategory.findByIdAndUpdate(req.query.id, { isActive: false });
        }

        if (req.query.status == 'Active') {
            await subcategory.findByIdAndUpdate(req.query.id, { isActive: true });
        }

        //search & pagination
        let par_page = 2;
        let page = 1;
        if (req.query.page) {
            page = req.query.page;
        }
        let search = '';
        if (req.query.search) {
            search = req.query.search;
        }

        let data_count = await subcategory.find({
            $or: [
                { title: { $regex: '.*' + search + '.*', $options: 'i' } },
                { date: { $regex: '.*' + search + '.*', $options: 'i' } },
                { content: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        }).countDocuments();
        let page_num = Math.ceil(data_count / par_page);

        let data = await subcategory.find({
            $or: [
                { title: { $regex: '.*' + search + '.*', $options: 'i' } },
                { date: { $regex: '.*' + search + '.*', $options: 'i' } },
                { content: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        }).populate('category_id')
            .limit(par_page * 1)
            .skip((page - 1) * par_page)
            .exec();

        if (data) {
            res.render('subcategory_view', ({
                data: data,
                cpage: page,
                page_num: page_num,
                search: search
            }));
        }
    } catch (err) {
        console.log("view_page err in subcategory : ", err);
    }
}
//delate Subcategory
module.exports.delet = async (req, res) => {
    try {
        let data = await subcategory.findById(req.params.id);
        if (data) {
            let i = path.join(__dirname, '..', data.image);
            fs.unlinkSync(i);

            let delet = await subcategory.findByIdAndDelete(req.params.id);
            if (delet) {
            req.flash("sucess", `Subcategory dilated Successfully`);
                res.redirect('back');
            }
        }
    } catch (err) {
        console.log('delet err in subcategory ', err);
    }
}
//multiple delate
module.exports.mulDel = async (req, res) => {
    try {
        let ids = req.body.mulDel;
        ids.forEach(async element => {
            let data = await subcategory.findById(element);
            if (data) {
                let i = path.join(__dirname, '..', data.image);
                fs.unlinkSync(i);

                await subcategory.findByIdAndDelete(element);
            }
        });
        req.flash("sucess", `All Subcategory Are Added Successfully`);
        res.redirect('back');
    } catch (err) {
        console.log('multi delate err in subcategory : ', err);
    }
} 
//edit page
module.exports.edit_page = async (req, res) => {
    try {
        let data = await subcategory.findById(req.params.id);
        let category_data = await category.find({});
        if (data) {
            res.render('subcategory_edit', ({ data: data, category: category_data }))
        }
    } catch (err) {
        console.log('edit_page err in subcategory ', err);
    }
}
//edit post
module.exports.edit = async (req, res) => {
    try {
        let id = req.body.eid;
        let data = await subcategory.findById(id);
        if (data) {
            if (req.file) {
                let di = path.join(__dirname, '..', data.image);
                fs.unlinkSync(di);

                req.body.image = subcategory.upPath + '/' + req.file.filename;
                req.body.updatedAt = nDate;
                await subcategory.findByIdAndUpdate(id, req.body);
            } else {
                req.body.image = data.image;
                req.body.updatedAt = nDate;
                await subcategory.findByIdAndUpdate(id, req.body);
            }
            req.flash("sucess", `Subcategory Updated Successfully`);
            return res.redirect('/subcategory/view_page');
        }
    } catch (err) {
        console.log('edit err in subcategory :', err);
    }
}


// *************** view Subcategory end ***************

// ------------------------------------------------------
