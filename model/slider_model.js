const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const upPath = '/uplod/slider';
const sliderSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
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


sliderSchema.statics.upImg = multer({ storage: imgObj }).single('image');
sliderSchema.statics.upPath = upPath;
const slider = mongoose.model('slider', sliderSchema);

module.exports = slider;
