const mongoose = require('mongoose')

const dbConnection = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/BlogDB')
        console.log('Connected to DB')
    } catch (err) {
        console.error(err)
    }
}
module.exports = dbConnection;