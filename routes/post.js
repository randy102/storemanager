var express = require('express');
var router = express.Router();
var passport = require('passport');

/**Controllers */
var dashboardCL = require('../controller/dashboardCL');
var calendarCL = require('../controller/calendarCL')
var employeeCL = require('../controller/employeeCL');
var notificationCL = require('../controller/notificationCL');
var chatCL = require('../controller/chatCL');
var storeCL = require('../controller/storeCL');
var profileCL = require('../controller/profileCL');
var manageCL = require('../controller/manageCL');
var authCL = require('../controller/authCL');

/**Passport Config */
require('../helper/passport-cog');


/**Auth pages */
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: 'Email hoặc mật khẩu sai!',
}),authCL.postLogin);
router.post('/register', authCL.postRegister);
router.post('/passwordforgot',authCL.postPasswordForgot);
router.post('/passwordreset',authCL.postPasswordReset);


/**Calendar pages */
router.post('/calendar/register', calendarCL.postCalendarRegister);
//router.post('/calendar/schedule', calendarCL.postCalendarSchedule);
router.post('/calendar/schedule/auto', calendarCL.postCalendarScheduleAuto);

/**Store pages */
router.post('/store/create', storeCL.postStoreCreate);
module.exports = router;