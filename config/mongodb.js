const mongoose=require('mongoose');

const db= mongoose.connect('mongodb+srv://raxitbambharoliya:raxit08@cluster0.h789rwv.mongodb.net/admin_pr', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })


module.exports=db;