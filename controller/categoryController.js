const category = require('../model/category_model');
const subCotegory = require('../model/subcategory_model');
const path = require('path');
const fs = require('fs');
const nDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Calcutta'
})
// *************** add Category Start ***************
//add Category page
module.exports.add = (req, res) => {
    res.render('category');
}
//add Category post  
module.exports.add_data = async (req, res) => {
    try {
        //set data in body
        req.body.isActive = true;
        req.body.createdAt = nDate;
        req.body.updatedAt = nDate;
        //create in data base
        let data = await category.create(req.body);
        if (data) {
            req.flash("sucess", `Category Added Successful`);
            res.redirect('back');
        }
    } catch (error) {
        console.log("add_data err in category : ", error);
    }
}
// *************** add Category end ***************

// ------------------------------------------------------

// *************** view Category Start ***************
//view page
module.exports.view_page = async (req, res) => {
    try {
        if (req.query.status == 'deActive') {
            await category.findByIdAndUpdate(req.query.id, { isActive: false });
        }

        if (req.query.status == 'Active') {
            await category.findByIdAndUpdate(req.query.id, { isActive: true });
        }

        let search = '';
        if (req.query.search) {
            search = req.query.search;
        }

        let page = 1;
        if (req.query.page) {
            page = req.query.page;
        }

        let par_page = 2;

        let data_count = await category.find({
            $or: [
                { category: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        }).countDocuments();

        let page_no = Math.ceil(data_count / par_page);

        let data = await category.find({
            $or: [
                { category: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        }).limit(par_page * 1)
            .skip((page - 1) * par_page)
            .exec();


        if (data) {
            res.render('category_view',
                ({
                    data: data,
                    cpage: page,
                    page_num: page_no,
                    search: search,

                })
            );
        }
    } catch (error) {
        console.log('veiw_page err in category : ', error);
    }
}
//single delate
module.exports.delet = async (req, res) => {
    try {
        //delete subcategory
        console.log(req.params.id)
        let sub_data = await subCotegory.find({ category_id: req.params.id });

        sub_data.forEach(async element => {
            let di = path.join(__dirname, '..', element.image);
            fs.unlinkSync(di);

            await subCotegory.findByIdAndDelete(element.id);
        });

        let delate = await category.findByIdAndDelete(req.params.id);
        if (delate) {
            req.flash("sucess", `Category dilated Successfully`);
            res.redirect('back');
        }
    } catch (error) {
        console.log('delet err in category', error);
    }
}
//multiple delate
module.exports.mulDel = async (req, res) => {
    try {
        let data = req.body.mulDel;
        //delate record in loop 
        data.forEach(async element => {
            let sub_data = await subCotegory.find({ category_id: element });

            sub_data.forEach(async element => {
                let di = path.join(__dirname, '..', element.image);
                fs.unlinkSync(di);

                await subCotegory.findByIdAndDelete(element.id);
            });

            await category.findByIdAndDelete(element);
        });
        req.flash("sucess", `All Category are Dilated Successfully`);
        res.redirect('back');
    } catch (err) {
        console.log("multe delet err in category: ", err);
    }
}
//edit page
module.exports.edit_page = async (req, res) => {
    try {
        let data = await category.findById(req.params.id);
        if (data) {
            res.render('category_edit', ({ data: data }));
        }
    } catch (error) {
        console.log("edit_page err in category", error);
    }
}
//edit page post
module.exports.edit = async (req, res) => {
    try {
        let edit = await category.findByIdAndUpdate(req.body.eid, req.body);
        req.body.updatedAt = nDate;
        if (edit) {
            req.flash("sucess", `Category Updated Successfully`);
            res.redirect('/category/view_page');
        }
    } catch (err) {
        console.log("edit err in category ", err);
    }
}
// *************** view Category end ***************

// ------------------------------------------------------


