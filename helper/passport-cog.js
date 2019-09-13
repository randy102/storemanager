var passport = require('passport');
var md5 = require('md5');
var localStrategy = require('passport-local').Strategy;
var sql = require('../helper/sql');
var auth = require('../helper/auth');

passport.use(new localStrategy(
    {
        usernameField: 'email',
        
    },

    (username, password, done) => {
        
        sql.check(username, auth.crypt(password)).then(result => {
            if (result) done(null, username);
            else done(null, false);
        }); 
    }
));

passport.serializeUser((username, done) => {
    done(null, username);
});

passport.deserializeUser((username, done) => {

    sql.find('employee',{email: username})
        .then(result => {
            done(null, result[0]);
        });
});
