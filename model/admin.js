const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const upPath = '/uplod/admin';
const adminSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    hobby: {
        type: Array,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    createdAt:{
        type: String,
        required: true
    },
    updatedAt:{
        type: String,
        required: true
    },
    isActive:{
        type:Boolean,
        require:true
    }
},{
    timestamps:true
})

const imgObj = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', upPath));
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now());
    }
});


adminSchema.statics.upImg = multer({ storage: imgObj }).single('image');
adminSchema.statics.upPath = upPath;
const admin = mongoose.model('admin', adminSchema);

module.exports = admin;
