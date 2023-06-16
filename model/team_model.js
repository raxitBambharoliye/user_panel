const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const upPath = '/uplod/team';
const Schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    post: {
        type: String,
        required: true
    },
    about: {
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


Schema.statics.upImg = multer({ storage: imgObj }).single('image');
Schema.statics.upPath = upPath;
const team = mongoose.model('team', Schema);

module.exports = team;
