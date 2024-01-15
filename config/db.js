const mongoose = require('mongoose');
const dbUrl = process.env.MONGODBURL;

mongoose.connect(dbUrl);

const db= mongoose.connection;

db.on('error',console.error.bind(console,'MongDb connection error'));
db.once('open',()=>{
    console.log('Connected to MongoDb');
})
module.exports = mongoose;