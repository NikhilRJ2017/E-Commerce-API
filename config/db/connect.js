const mongoose = require('mongoose');
const connectDB = (dbURI)=>{
    return mongoose.connect(dbURI);
}
module.exports = connectDB;