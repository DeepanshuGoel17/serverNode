var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ReviewSchema = new Schema({

        name:{type:String},
        imageurl:{type:String},
        title:{type:String},
        rating:{type:Number},
        description:{type:String}
});
//Book Schema
var BookSchema = new Schema({
        isbn:{type:String},
        title:{type:String},
        author:{type:String},
        category:{type:String},
        publisher:{type:String},
        rating:{type:Number},
        copies:{type:Number},
        url:{type:String},
        year:{type:String},
        reviews:[ReviewSchema]
});
var bookinfos = mongoose.model('bookinfos',BookSchema,'Books');
//booksinfo is model which stores data from books collection in mean db
module.exports ={bookinfos,BookSchema}
 
