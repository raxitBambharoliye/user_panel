const team = require('../model/team_model');
const path = require('path');
const fs = require('fs');
const nDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Calcutta'
})
// *************** Add Team Start ***************
//add team page
module.exports.add = (req, res) => {
    res.render('team');
}
//add team post
module.exports.add_data = async (req, res) => {
    try {
        let i = '';
        if (req.file) {
            i = team.upPath + '/' + req.file.filename;
        }
        req.body.image = i;
        req.body.isActive = true;
        req.body.createdAt = nDate;
        req.body.updatedAt = nDate;

        let data = await team.create(req.body);
        if (data) {
            req.flash("sucess", `Team Member Added Successfully`);
            res.redirect('back');
        }
    } catch (err) {
        console.log('add_data err in team', err);
    }
}
// *************** Add team end ***************

// ------------------------------------------------------

// *************** view Team Start ***************
//view team
module.exports.view_page = async (req, res) => {
    try {
        //active & deActive
        if (req.query.status == 'deActive') {
            await team.findByIdAndUpdate(req.query.id, { isActive: false });
        }
        if (req.query.status == 'Active') {
            await team.findByIdAndUpdate(req.query.id, { isActive: true });
        }

        //search & pagination

        let search = '';
        let page = 1;
        let per_page = 2;

        if (req.query.search) {
            search = req.query.search;
        }
        if (req.query.page) {
            page = req.query.page;
        }

        let data_count = await team.find({
            $or: [
                { name: { $regex: '.*' + search + '.*', $options: 'i' } },
                { about: { $regex: '.*' + search + '.*', $options: 'i' } },
                { post: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        }).countDocuments();
        let page_num = Math.ceil(data_count / per_page);

        let data = await team.find({
            $or: [
                { name: { $regex: '.*' + search + '.*', $options: 'i' } },
                { about: { $regex: '.*' + search + '.*', $options: 'i' } },
                { post: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        }).limit(per_page * 1)
            .skip((page - 1) * per_page)
            .exec();

        res.render('team_view', ({
            data: data,
            search: search,
            pageNum: page_num,
            cpage: page,
        }))
    } catch (err) {
        console.log('view-page err in team : ', err);
    }
}
//edit team page
module.exports.edit_page = async (req, res) => {
    try {
        let data = await team.findById(req.params.id);
        if (data) {
            res.render('team_edit', ({ data: data }));
        }
    } catch (err) {
        console.log('edit_page err in team: ', err);
    }
}
//edit team post
module.exports.edit = async (req, res) => {
    try {
        let id = req.body.eid;
        let data = await team.findById(id);
        if (data) {
            if (req.file) {
                let di = path.join(__dirname, '..', data.image);
                fs.unlinkSync(di);

                req.body.image = team.upPath + '/' + req.file.filename;
                req.body.updatedAt = nDate;

                let update = await team.findByIdAndUpdate(id, req.body);
                if (update) {
                    req.flash("sucess", `Team Member Updated Successfully`);
                    res.redirect('/team/view_page');
                }
            } else {
                req.body.image = data.image;
                req.body.updatedAt = nDate;

                let update = await team.findByIdAndUpdate(id, req.body);
                if (update) {
                    req.flash("sucess", `Team Member Updated Successfully`);
                    res.redirect('/team/view_page');
                }
            }
        }
    } catch (err) {
        console.log('edit err in team : ', err);
    }
}
// delate team
module.exports.delet = async (req, res) => {
    try {
        let data = await team.findById(req.params.id);
        let i = path.join(__dirname, '..', data.image);
        fs.unlinkSync(i);
        await team.findByIdAndDelete(req.params.id);
        req.flash("sucess", `Team Member Dilated Successfully`);
        res.redirect('back');
    } catch (err) {
        console.log('delate err in team : ', err);
    }
}
//multiple delate
module.exports.mulDel = async (req, res) => {
    try {
        let ids = req.body.mulDel;
        ids.forEach(async element => {
            let data = await team.findById(element);
            let i = path.join(__dirname, '..', data.image);
            fs.unlinkSync(i);
            await team.findByIdAndDelete(element);
        });
        req.flash("sucess", `All Team Members Dilated Successfully`);
        res.redirect('back')
    } catch (err) {
        console.log('muldel errr in team : ', err);
    }
}
// *************** view team end ***************

// ------------------------------------------------------
