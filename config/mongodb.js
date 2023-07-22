const mongoose = require('mongoose');


const url = "mongodb+srv://raxitbambharoliya:raxit08@cluster0.h789rwv.mongodb.net/admin_pr";

const connectionParams={
    useNewUrlParser: true,
    useUnifiedTopology: true 
}
const db = mongoose.connect(url,connectionParams)
    .then( () => {
        console.log('Connected to the database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. n${err}`);
    })

module.exports = db;