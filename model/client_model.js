const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const upPath = '/uplod/client';
const Schema = mongoose.Schema({
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


Schema.statics.upImg = multer({ storage: imgObj }).single('image');
Schema.statics.upPath = upPath;
const client = mongoose.model('client', Schema);

module.exports = client;
