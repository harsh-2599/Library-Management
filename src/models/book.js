var mongoose = require('mongoose');
const { ObjectID, ObjectId } = require('bson');
var Schema = require('mongoose').Schema;

var bookSchema = new Schema({
    bookName: {
        type: String,
        required: true,
    },
    authorName:{
        type: String,
        required: true,
    },
    publishedYear: {
        type: String,
        required: true,
    },
    count : {
        type: Number,
        required: true
    }
});

var bookExports = mongoose.model('bookDetails', bookSchema);
module.exports = bookExports;