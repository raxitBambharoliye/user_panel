const mongoose = require('mongoose');

const Schema = mongoose.Schema({
    category: {
        type: String,
        required: true
    }, createdAt:{
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

const category = mongoose.model('category', Schema);
module.exports = category;
