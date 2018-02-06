var mongoose = require('mongoose');
var Schema = mongoose.Schema;
        
//Borrowbook subSchema
var borrowbookSchema = new Schema({
        isbn:{type:String},
        title:{type:String},
        borrowedDate:{type:Date},
        returnDate:{type:Date},
        isRenewed:{type:Boolean},
        url:{type:String}
});

//User mainSchema
var userInfoSchema = new Schema({
         name:{type:String},
         email:{type:String},
         mid:{type:String},
         password:{type:String},
         role:{type:String},
         preference:[{type:String}],
         borrowedbooks:[borrowbookSchema],
         wishlist:[{type:String}]
});
var userinfos = mongoose.model('userinfos',userInfoSchema,'UsersInfo');
                    // mongoose.model(modelName,Schema,collectionName)
//userinfos is model which stores data from usersinfo collection in mean db
module.exports = userinfos;

module.exports.getUserByMid = function(userMid,callback){
        userinfos.findById(userMid,callback);
}