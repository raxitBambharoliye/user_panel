const comment = require('../model/comment_model');
const mongoose = require('mongoose');
const path = require('path')
const fs = require('fs');
//time
const nDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Calcutta'
});
//date
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
// *************** Add Comment  ***************

module.exports.add_comment = async (req, res) => {
    try {
        let i = ' ';
        let anyDate = new Date;

        if (req.file) {
            i = comment.upPath + "/" + req.file.filename;
        }

        req.body.image = i;
        req.body.createdAt = nDate;
        req.body.updatedAt = nDate;
        req.body.isActive = true;
        req.body.date = anyDate.toShortFormat();

        let data = await comment.create(req.body);

        if (data) {
            req.flash("sucess", `Comment Added Successfully`);
            return res.redirect('back');
        }
    } catch (error) {
        console.log("comment enter err in add_comment ", error);
    }
}
// *************** Delate Comment  ***************

module.exports.delet = async (req, res) => {
    let data = await comment.findById(req.params.id);
    if (data) {
        let i = path.join(__dirname, '..', data.image);
        fs.unlinkSync(i);

        let delet = await comment.findByIdAndDelete(req.params.id);
        if (delet) {
            req.flash("sucess", `Comment Dilated Successfully`);
            return res.redirect('/blog/view_comment')
        }

    }
}
// *************** Multiple Delate Comment  ***************

module.exports.mulDel = async (req, res) => {
    try {
        let ids = req.body.mulDel;
        ids.forEach(async element => {
            let data = await comment.findById(element);
            if (data) {
                let i = path.join(__dirname, '..', data.image);
                fs.unlinkSync(i);

                await comment.findByIdAndDelete(element);
            }
        });
        req.flash("sucess", `All Comments Are Dilated Successfully`);
        res.redirect('back');
    } catch (err) {
        console.log('multi delate err in comment : ', err);
    }
}