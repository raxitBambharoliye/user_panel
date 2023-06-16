const say = require('../model/say_model')

const nDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Calcutta'
});

// *************** Add Review Start ***************
//Add Review page
module.exports.add = (req, res) => {
    res.render('say');
}
//Add Review post
module.exports.add_data = async (req, res) => {
    try {
        req.body.createdAt = nDate;
        req.body.updatedAt = nDate;
        req.body.isActive = true;
        let data = await say.create(req.body);
        if (data) {
            req.flash("sucess", `Review Added Successfully`);
            return res.redirect('/say');
        }
    } catch (err) {
        console.log("say add data err : ", err);
    }
}
// *************** Add Review  end ***************

// ------------------------------------------------------

// *************** view Review Start ***************
//view Review page
module.exports.view_page = async (req, res) => {
    try {
        // active & deactive 
        if (req.query.stutas == 'deActive') {
            let Active = await say.findByIdAndUpdate(req.query.id, { isActive: false });

        }
        if (req.query.stutas == 'Active') {
            let Active = await say.findByIdAndUpdate(req.query.id, { isActive: true });
        }

        //search & pagination
        let pre_page = 2;
        let search = '';
        let page = 1;

        if (req.query.page) {
            page = req.query.page;
        }
        if (req.query.search) {
            search = req.query.search;
        }

        let data_num = await say.find(
            {
                $or: [
                    { name: { $regex: '.*' + search + '.*', $options: 'i' } },
                    { content: { $regex: '.*' + search + '.*', $options: 'i' } },
                    { city: { $regex: '.*' + search + '.*', $options: 'i' } },
                    { country: { $regex: '.*' + search + '.*', $options: 'i' } }
                ]
            }
        ).countDocuments();
        let page_num = Math.ceil(data_num / pre_page);
        let data = await say.find(
            {
                $or: [
                    { name: { $regex: '.*' + search + '.*', $options: 'i' } },
                    { content: { $regex: '.*' + search + '.*', $options: 'i' } },
                    { city: { $regex: '.*' + search + '.*', $options: 'i' } },
                    { country: { $regex: '.*' + search + '.*', $options: 'i' } }
                ]
            }
        ).limit((pre_page) * 1)
            .skip((page - 1) * pre_page)
            .exec();
        //page render
        if (data) {
            res.render('say_view', ({
                data: data,
                page_num: page_num,
                cpage: page,
                search: search
            }));
        }
    } catch (error) {
        console.log("say view page err: ", error);
    }
}
//delate Review 
module.exports.delet = async (req, res) => {
    try {
        let delet = await say.findByIdAndDelete(req.params.id);
        if (delet) {
            req.flash("sucess", `Review Dilated Successfully`);
            res.redirect('/say/view_page')
        }
    } catch (err) {
        console.log("say delet : ", err);
    }
}
//edit Review page
module.exports.edit_page = async (req, res) => {
    try {
        let data = await say.findById(req.params.id);
        if (data) {
            res.render('say_edit', ({ data: data }))
        }
    } catch (error) {
        console.log("say edit_page err : ", error);
    }
}
//edit Review post 
module.exports.edit = async (req, res) => {
    try {
        req.body.updatedAt = nDate;
        let id = req.body.eid;
        let update = await say.findByIdAndUpdate(id, req.body);
        if (update) {
            req.flash("sucess", `Review Updated Successfully`);
            res.redirect('/say/view_page');
        }
    } catch (error) {
        console.log("say edit err ", error);
    }

}
//multiple delate
module.exports.delMul = async (req, res) => {
    try {
        let ids = req.body.mulDel;

        ids.forEach(async element => {
            await say.findByIdAndDelete(element);
        });
        req.flash("sucess", `All Review Dilated Successfully`);
        return res.redirect('/say/view_page')
    } catch (error) {
        console.log('muldel err in say ', error);
    }
}
// *************** View Review  end ***************

// ------------------------------------------------------
