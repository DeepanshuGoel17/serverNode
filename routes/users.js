const express = require('express');
const router = express.Router();
var mongoose = require('mongoose');
const cors  =   require('cors');
const jwt         =   require('jsonwebtoken');
const passport    =   require('passport');
router.use(cors());
userinfos = require('../models/user.js');
bookinfo = require('../models/book.js');
bookinfos = bookinfo.bookinfos;

// to add users to db
    router.post('/',(req,res,next)=>{
        userinfos.findOne({mid:req.body.mid}).then((user) =>{     
            // if user doesnt exist then create a new one
        if(!user){
        userinfos.create(req.body).then((users) =>{
        res.send('New User');    
        },(err)=> next(err));
         }
         // get user credentials for creating a unique jwt token
    userinfos.findOne({mid:req.body.mid}).then((user) =>{
    res.setHeader('content-type','application/json');
    res.statusCode = 200;
    if(user){
      const token = jwt.sign({
          data:user},'coco-cola',{
        expiresIn: 604800 //1 week
      });
      res.json({
        success:true,
        token : `Bearer ${token}`,
        user:{
          id:user._id,
          mid:user.mid
        }
      });
    } else {
      res.json({message: 'Token Creation Failed!!!'});
    }
},(err)=> next(err))
     .catch((err) => next(err));
      
     },(err)=> next(err))
     .catch((err) => next(err));
});

// to get all users from db
    router.get('/',passport.authenticate('jwt',{session:false}),(req,res,next)=>{
     userinfos.find({}).then((users) =>{
        res.statusCode = 200;
        res.setHeader('content-type','application/json');
        res.json(users);
     },(err)=> next(err))
     .catch((err) => next(err));
});


// to get user from db using mid
    router.get('/:userid',passport.authenticate('jwt',{session:false}),(req,res,next)=>{
      userinfos.findOne({mid:req.params.userid}).then((user) =>{
        res.statusCode = 200;
        res.setHeader('content-type','application/json');
        res.json(user);
     },(err)=> next(err))
     .catch((err) => next(err));
    });


    // Route to add books into wishlist
    // this route uses userid to select a particular user and 
    // inserts the req body into the wishlist of the user
    router.post('/:userid/addwish',(req,res,next)=>{
     userinfos.findOne({mid:req.params.userid}).then((user) =>{
        //here we are saving only the isbn of the book in the wishlist but not the whole book
        // !!!! to save the whole book in the wishlist we need to change the wishlist schema first 
       if(req.body.isbn != null && req.body.isbn != "" ){
       let array = user.wishlist;
       let index = array.indexOf(req.body.isbn);
       if (index > -1) {
           res.send('already exists');
       }   
       else{
        user.wishlist.push(req.body.isbn);
        user.save();
        res.statusCode = 200;
        res.setHeader('content-type','application/json');
        res.json(user); 
           
       }
    }
    else{
        res.send('isbn is null');
    }
     },(err)=> next(err))
     .catch((err) => next(err));
});

    // route to remove wishlisted books
  router.post('/:userid/removewish',(req,res,next)=>{
     userinfos.findOne({mid:req.params.userid}).then((user) =>{
         // Here we are accessing the user with his mid and popping the
         // isbn of book in  the wishlist 
       let array = user.wishlist;
       let index = array.indexOf(req.body.isbn);
       if(index > -1){
       if (index > -1) {
        array.splice(index, 1);
        }
        user.save();
        res.statusCode = 200;
        res.setHeader('content-type','application/json');
        res.json(user);
       }
       else{
           res.send("book doesn't exist");
       }    
     },(err)=> next(err))
     .catch((err) => next(err));
});



  router.post('/:userid/addborrow',(req,res,next)=>{
        var books;
      if(req.body.isbn!=""){
     userinfos.findOne({mid:req.params.userid}).then((user) =>{
        //here we are saving the  book details in the borrowedbooks 
        let array  = user.borrowedbooks;
        let result = array.filter(function( obj ) {
        return obj.isbn === req.body.isbn;
        });
        if(result.length===0){
            bookinfos.findOne({isbn:req.body.isbn}).then((book)=>{
                var options = { day: 'numeric', month: 'long',year: 'numeric'};
                var today  = new Date();
                var borrowDate = today.toLocaleDateString("en-US",options);
                today.setDate(today.getDate() + 7);
                var retDate = today.toLocaleDateString("en-US",options);
                    books = {
                    isbn:book.isbn,
                    title:book.title,
                    borrowedDate:borrowDate,
                    returnDate:retDate,
                    isRenewed:false,
                    url:book.url
                };
                user.borrowedbooks.push(books);
                user.save();
                res.statusCode = 200;
                res.setHeader('content-type','application/json');
                res.json(user);
            }); 
        }
        else{
            res.send('book already borrowed');
        }
       
     },(err)=> next(err))
     .catch((err) => next(err));
      }
      else{
          res.send('Null values found');
      }
});


// to remove borrow book in borrowed book

router.post('/:userid/deleteborrow',(req,res,next)=>{
     userinfos.findOne({mid:req.params.userid}).then((user) =>{
        //here we are saving the  book details in the borrowedbooks 
        let array  = user.borrowedbooks;
        let result = array.filter(function( obj ) {
        return obj.isbn === req.body.isbn;
    });
        if(result.length===0){
             res.send('book not borrowed');
        }
        else{
            user.borrowedbooks.remove(result[0]._id);
            user.save();
            res.statusCode = 200;
        res.setHeader('content-type','application/json');
            res.json(user);
           
        }
       
     },(err)=> next(err))
     .catch((err) => next(err));
});

module.exports = router;