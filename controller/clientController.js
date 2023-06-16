const flash = require('express-flash');
const client = require('../model/client_model');
const path = require('path')
const fs = require('fs');

const nDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Calcutta'
});

// *************** add Client Start ***************
//client add page
module.exports.add = (req, res) => {
    res.render('client');
}
//client add post
module.exports.add_data = async (req, res) => {
    try {
        let i = '';
        if (req.file) {
            i = client.upPath + '/' + req.file.filename;
        }

        req.body.image = i;
        req.body.isActive = true;
        req.body.createdAt = nDate;
        req.body.updatedAt = nDate;

        await client.create(req.body);

        req.flash("sucess", `Client Add Successfully`);
        res.redirect('back');

    } catch (err) {
        console.log('add data err in client', err);
    }
}
// *************** add Client end ***************

// ------------------------------------------------------

// *************** view Client Start ***************
//view client page
module.exports.view_page = async (req, res) => {
    try {
        if (req.query.status == 'deActive') {
            await client.findByIdAndUpdate(req.query.id, { isActive: false })
        }
        if (req.query.status == 'Active') {
            await client.findByIdAndUpdate(req.query.id, { isActive: true })
        }
        let page = 1;
        if (req.query.page) {
            page = req.query.page;
        }

        let data_count = await client.find().countDocuments();
        let per_page = 2;
        let page_num = Math.ceil(data_count / per_page);

        let data = await client.find()
            .limit(per_page * 1)
            .skip((page - 1) * per_page)
            .exec();

        res.render('client_view', {
            data: data,
            cpage: page,
            page_num: page_num
        })

    } catch (err) {
        console.log('view page err in client :', err);
    }
}
//edit client page
module.exports.edit_page = async (req, res) => {
    try {
        let data = await client.findById(req.params.id);
        res.render('client_edit', ({ data: data }));
    } catch (err) {
        console.log('edit_page err in client ', err);
    }
}
//edit client post
module.exports.edit = async (req, res) => {
    try {
        //delate old image from folder 
        let data = await client.findById(req.body.eid);
        let i = path.join(__dirname, '..', data.image);
        fs.unlinkSync(i);
        //set new image path
        req.body.image = client.upPath + '/' + req.file.filename;
        //find by id and updated
        await client.findByIdAndUpdate(req.body.eid, req.body);

        req.flash("sucess", `Client Updated Successfully`);
        res.redirect('/client/view_page');
    } catch (err) {
        console.log('edit data err in client ', err);
    }
}
//single delate
module.exports.delet = async (req, res) => {
    try {
        //delate old image from folder 
        let data = await client.findById(req.params.id);
        let i = path.join(__dirname, '..', data.image);
        fs.unlinkSync(i);
        //delate
        await client.findByIdAndDelete(req.params.id);
        req.flash("sucess", `Client Deleted Successfully`);
        res.redirect('back');
    } catch (err) {
        console.log('delate err in client : ', err);
    }
}
//multiple delate
module.exports.mulDel = async (req, res) => {
    try {
        let ids=req.body.mulDel;
        //delate in loop
        ids.forEach(async element => {
            let data = await client.findById(element);
            let i = path.join(__dirname,'..',data.image);
            fs.unlinkSync(i);
            await client.findOneAndDelete(element);
        });
        req.flash("sucess", `All Client's Are Dilated Successfully`);
        res.redirect('back');
    } catch (err) {
        console.log('muldel err in client ', err);
    }
}
// *************** view Client end ***************

// ------------------------------------------------------

