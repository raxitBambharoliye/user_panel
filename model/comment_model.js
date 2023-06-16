
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const upPath = '/uplod/comment';

const Schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    }, 
    date:{
        type:String,
        required:true
    },
    post_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'blog',
        required:true
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
        required:true
    }
},    {
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

const comment = mongoose.model('comment', Schema);
module.exports = comment;
