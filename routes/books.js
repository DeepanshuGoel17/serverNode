const express = require('express');
const router = express.Router();
var mongoose = require('mongoose');
const cors   =   require('cors');
const jwt         =   require('jsonwebtoken');
const passport    =   require('passport');
bookinfo = require('../models/book.js');
bookinfos = bookinfo.bookinfos;


router.use(cors());

// to add books to db
    router.post('/',(req,res,next)=>{
        if(req.body.isbn!= "" && req.body.title!= "" && req.body.author!= "" && req.body.category!= "" && req.body.publisher!= "" && req.body.rating!= "" && req.body.copies!= ""&& req.body.url!= ""&& req.body.year!= ""){
     bookinfos.create(req.body).then((books) =>{
        res.statusCode = 200;
        res.setHeader('content-type','application/json');
        res.json(books);    
        console.log('book added');
     },(err)=> next(err))
     .catch((err) => next(err));
    }
     else{
        res.send('book not added');
     }
});

// to get books from db
    router.get('/',passport.authenticate('jwt',{session:false}),(req,res,next)=>{
     bookinfos.find({}).then((books) =>{
         res.statusCode = 200;
         res.setHeader('content-type','application/json');
         res.json(books);
     },(err)=> next(err))
     .catch((err) => next(err));
});

// to get books from db using isbn
    router.get('/:isbn',passport.authenticate('jwt',{session:false}),(req,res,next)=>{
      bookinfos.findOne({isbn:req.params.isbn}).then((books) =>{
        res.statusCode = 200;
        res.setHeader('content-type','application/json');
        res.json(books);
     },(err)=> next(err))
     .catch((err) => next(err));
    });

    
// to edit book details using the book isbn from db
    router.put('/:bookid',(req,res,next)=>{
        if(req.body.isbn!= "" && req.body.title!= "" && req.body.author!= "" && req.body.category!= "" && req.body.publisher!= "" && req.body.rating!= "" && req.body.copies!= ""&& req.body.url!= ""&& req.body.year!= ""){
     const newBook = req.body;
 bookinfos.findOneAndUpdate({ _id: req.params.bookid }, req.body)
    .exec(function(err, book){
      if(err) return res.status(500).json({err: err.message});
        res.statusCode = 200;
        res.setHeader('content-type','application/json');
      res.json({newBook, message: 'Successfully updated'})
    });
        }
        else{
            res.send('book not updated, null values');
        }
     });

// to delete book details using the book isbn from db
    router.delete('/:isbn',(req,res,next)=>{
      bookinfos.remove({isbn:req.params.isbn}).then((books) =>{
         res.json(books);
     },(err)=> next(err))
      .catch((err) => next(err));
    });

  router.post('/:isbn/addreview',(req,res,next)=>{
       if(req.body.name!= "" && req.body.imageurl!= "" && req.body.title!= "" && req.body.rating!= "" && req.body.description!= ""){
     bookinfos.findOne({isbn:req.params.isbn}).then((book) =>{
        //here we are adding the  reviews in the books 
        let array  = book.reviews;
            array.push(req.body);
            book.save();
            res.statusCode = 200;
            res.setHeader('content-type','application/json');
            res.json(book);        
     },(err)=> next(err))
     .catch((err) => next(err));
       }
       else{
           res.send('empty review sent');
       }
});

module.exports = router;