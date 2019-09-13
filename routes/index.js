var express = require('express');
var router = express.Router();

/* Controllers */
var dashboardCL = require('../controller/dashboardCL');
var calendarCL = require('../controller/calendarCL')
var employeeCL = require('../controller/employeeCL');
var notificationCL = require('../controller/notificationCL');
var chatCL = require('../controller/chatCL');
var storeCL = require('../controller/storeCL');
var profileCL = require('../controller/profileCL');
var manageCL = require('../controller/manageCL');
var authCL = require('../controller/authCL');

/* GET Dashboard pages. */
router.get('/', dashboardCL.getDashboard);
router.get('/dashboard', dashboardCL.getDashboard);


/* GET Calendar pages. */
router.get('/calendar', calendarCL.getCalendar);
router.get('/calendar/register', calendarCL.getCalendarRegister);
router.get('/calendar/schedule', calendarCL.getCalendarSchedule);

/* GET Employee pages */
router.get('/employee', employeeCL.getEmployee);
router.get('/employee/manage', employeeCL.getEmployeeManage);
router.get('/employee/profile', employeeCL.getEmployeeProfile);

/* GET Notification pages */
router.get('/notification', notificationCL.getNotification);
router.get('/notification/list', notificationCL.getNotificationList);

/* GET Chat pages*/
router.get('/chat', chatCL.getChat);

/* GET Store pages */
router.get('/store', storeCL.getStore);
router.get('/store/switch', storeCL.getSwitchStore);
router.get('/store/apply', storeCL.getStoreApply);

/* GET Profile pages */
router.get('/profile', profileCL.getProfile);

/* GET Manage pages */
router.get('/manage', manageCL.getManage);

/**GET Login/Register pages */
router.get('/login', authCL.getLogin);
router.get('/logout',authCL.getLogout);
router.get('/register',authCL.getRegister);
router.get('/activateuser', authCL.getActivateUser);
router.get('/activatesuccess',authCL.getActivateSuccess);
router.get('/passwordforgot',authCL.getPasswordForgot);
router.get('/passwordreset', authCL.getPasswordReset);
router.get('/passwordsuccess', authCL.getPasswordSuccess);
module.exports = router;
