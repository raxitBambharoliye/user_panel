const offer = require('../model/offer_model')
const nDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Calcutta'
});
// *************** Add Offer start   ***************
//add offer page
module.exports.add = (req, res) => {
    res.render('offer');
}
//add offer page post
module.exports.add_data = async (req, res) => {
    try {
        req.body.createdAt = nDate;
        req.body.updatedAt = nDate;
        req.body.isActive = true;

        let data = await offer.create(req.body);
        if (data) {
            req.flash("sucess", `Offer Added Successfully`);
            return res.redirect('/offer');
        }
    } catch (error) {
        console.log("offer add_data : ", error);
    }
}

// *************** Add Offer end ***************

// ------------------------------------------------------

// *************** view Offer Start ***************
//view Offer Page
module.exports.view_page = async (req, res) => {
    try {
        //active & DeActive
        if (req.query.status == 'deActive') {
            let Active = await offer.findByIdAndUpdate(req.query.id, { isActive: false });
        }

        if (req.query.status == 'Active') {
            let Active = await offer.findByIdAndUpdate(req.query.id, { isActive: true });
        }

        //search & pagination
        var search = '';
        let per_page = 2;
        let page = 1;

        if (req.query.search) {
            search = req.query.search;
        }
        if (req.query.page) {
            page = req.query.page;
        }

        let data_count = await offer.find({
            $or: [
                { title: { $regex: '.*' + search + '.*', $options: 'i' } },
                { content: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        }).countDocuments();
        var page_num = Math.ceil(data_count / per_page);

        let data = await offer.find({
            $or: [
                { title: { $regex: '.*' + search + '.*', $options: 'i' } },
                { content: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        }).limit((per_page) * 1)
            .skip((page - 1) * per_page)
            .exec();
        //render page
        if (data) {
            res.render('offer_view', ({
                data: data,
                page_num: page_num,
                cpage: page,
                search: search
            }));
        }
    } catch (error) {
        console.log("offer error : ", error);
    }
}
//offer edit page
module.exports.edit_page = async (req, res) => {
    try {
        let data = await offer.findById(req.params.id);
        if (data) {
            res.render('offer_edit', ({ data: data }))
        }
    } catch (error) {
        console.log("offer edit_page");
    }
}
//offer edit post
module.exports.edit = async (req, res) => {
    try {
        req.body.updatedAt = nDate;
        let id = req.body.eid;
        let update = await offer.findByIdAndUpdate(id, req.body);
        if (update) {
            req.flash("sucess", `Offer  Updated Successfully `);
            res.redirect('/offer/view_page');
        }
    } catch (error) {
        console.log("offer edit", error);
    }

}
//single delate
module.exports.delet = async (req, res) => {
    try {
        let delet = await offer.findByIdAndDelete(req.params.id);
        if (delet) {
            req.flash("sucess", `Offer  Dilated Successfully `);
            res.redirect('/offer/view_page')
        }
    } catch (error) {
        console.log("offer delet", error);
    }
}
//multiple Delate 
module.exports.mulDel = async (req, res) => {
    try {

        data = req.body.mulDel;
        data.forEach(async element => {
            await offer.findByIdAndDelete(element);
        });
        req.flash("sucess", `All  Offers Are Updated Successfully `);
        res.redirect('/offer/view_page')

    } catch (error) {
        console.log('offer multi delet err ');
    }
}
// *************** view Offer end ***************

// ------------------------------------------------------







