var mongoose = require('mongoose');
const { ObjectID, ObjectId } = require('bson');
var Schema = require('mongoose').Schema;

var userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        required: true,
    },
    books : {
        type: Array,
    }
});

var userExports = mongoose.model('userDetails', userSchema);
module.exports = userExports;