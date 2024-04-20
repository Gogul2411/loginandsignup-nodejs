const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb+srv://gogul:gogul1234@nodebasic.ttvnigw.mongodb.net/login-pro");

//check database connected or not
connect.then(() => {
    console.log('Database connected successfully');
}).catch((e) => {
    console.log(`Database can't be connected: ${e}`);
});

// Create a schema
const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

//Collection part

const collection = new mongoose.model('users', LoginSchema);

module.exports = collection;
