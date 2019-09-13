var Express = require('express');
var App = Express();
var passport = require('passport');
var session = require('express-session');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var authHelper = require('./helper/auth');
var middlewareHelper = require('./helper/middleware');

/* Route */
var indexRoutes = require('./routes/index');
var ajaxRoutes = require('./routes/ajax');
var postRoutes = require('./routes/post');



/* Setup */
App.set('view engine', 'ejs');
App.use('/public', Express.static('public'));

App.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));
App.use(bodyParser.urlencoded({ extended: true }));
App.use(passport.initialize());
App.use(passport.session());
App.use(cookieParser('keyboard cat'));
App.use(flash());


/* App */

App.use(middlewareHelper.index);

App.use('/', indexRoutes);
App.use('/post', postRoutes);
App.use('/data', ajaxRoutes);

App.listen(3000);
