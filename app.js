const express     =   require('express');
const path        =   require('path');
const bodyParser  =   require('body-parser');
const app         =   express();
const passport    =   require('passport');
const jwt         =   require('jsonwebtoken');
const mongoose = require('mongoose');
userinfos = require('./models/user.js');
//to handle mongoose promise
mongoose.Promise = global.Promise;
const url = 'mongodb://mongosql.westus2.cloudapp.azure.com:27017/lims';
const connect = mongoose.connect(url,{
  useMongoClient: true,
});

connect.then((con)=>{
console.log('Connection is created.');
},(err) => {console.log(err); });

const books       =   require('./routes/books');
const users       =   require('./routes/users');

//Body Parser 
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//Passport for authentication
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

//server port number
const port = process.env.PORT || 8080;

var router = express.Router();

//setting up cors
router.use(function (req, res, next) {
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Methods","HEAD,GET,POST,DELETE,PATCH,OPTIONS,PUT")
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
next();
});


router.get('/',function(req,res){
  res.json({message: 'Welcome to LiMS Angular Library API, The only page You can access without a api key, Have fun'})
});


//setting up routes
app.use('/',router);
app.use('/Books',books);
app.use('/UsersInfo',users);


//shows connected port 
app.listen(port);
console.log('Server started running on port '+ port);