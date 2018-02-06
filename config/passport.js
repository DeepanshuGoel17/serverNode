const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const userinfos = require('../models/user.js');


module.exports = function(passport){
    let opts    =  {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = 'coco-cola';
    passport.use(new JwtStrategy(opts,(jwt_payload,done) => {
        userinfos.getUserByMid(jwt_payload.data._id,(err,user) =>{
        if(err){
            return done(err,false);
        }
        if(user){
            return done(null , user);
        }
        else{
            return done(null, false);
        }
    });
    }));
}