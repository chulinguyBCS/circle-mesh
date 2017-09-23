var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
var User = require('../models/User.js');

var passport = function(passport) {
	passport.serializeUser(function(user, done){
    console.log('serializeUser is being called!')
    console.log('user obj is')
    console.log(user)
    done(null, user.id);
	});

  passport.deserializeUser(function(id, done){
    console.log('deserializeUser is being called!')
    User.findById(id, function(err, user){
			done(null, user);
		});
  });
  
  if (process.env.MONGODB_URI || process.env.PORT){
    var clientID = process.env.linkedin_CLIENT_ID;
    var clientSecret = process.env.linkedin_CLIENT_SECRET;
    var callbackURL = process.env.linkedin_CALLBACK_URL;
  } else {
    var configAuth = require('./auth.js');
    var clientID = configAuth.linkedinAuth.clientID;
	  var clientSecret = configAuth.linkedinAuth.clientSecret;
	  var callbackURL = configAuth.linkedinAuth.callbackURL;

  }

	passport.use(new LinkedInStrategy({
	    clientID: clientID,
	    clientSecret: clientSecret,
      callbackURL: callbackURL,
          scope: ['r_emailaddress', 'r_basicprofile'],
    },
	  function(accessToken, refreshToken, profile, done) {
      console.log("access", accessToken)
      console.log("refresh", refreshToken)
      console.log("profile", profile)
      process.nextTick(function(){
        console.log('trying to find user')
        // console.log(`profile displayname is ${profile.displayName}`)
        User.findOne({'username': profile.displayName}, function(err, user){
          if(user){
            console.log('user found!')
            // console.log(user);
            // user.accessToken = accessToken;
            // user.refreshToken = refreshToken
            // user.save()

            return done(null, user);
          }
          else {
            console.log('creating a new user');
            // console.log('profile is')
            // console.log(profile)
            User.create({
              'username' : profile.displayName,
            }, function(err, data){
              if (err) {
                console.log(err)
              } else {
                console.log('done creating a new user')
                console.log(data);
                return done(null, data)
              };
            })  
          }      
        })
      })
    }
	));

};


module.exports = passport; 