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

/*Register**/
router.get('/register/find', authCL.dataRegisterFind);
router.get('/resendactivate', authCL.dataResendActivate);

/**Employee */
router.get('/employee/apply/delete', employeeCL.doDeleteApply);
router.get('/employee/delete', employeeCL.doDeleteEmployee);
router.get('/employee/apply/approve', employeeCL.doApproveApply);
router.get('/employee/changerole',employeeCL.doChangeRole);
/**Calendar */
router.get('/calendar/register', calendarCL.dataCalendarRegister);
router.get('/calendar/schedule/user', calendarCL.dataCalendarUser);
router.get('/calendar/schedule/time', calendarCL.dataCalendarTime);
router.get('/calendar/schedule/registered', calendarCL.dataCalendarScheduleRegistered);
router.get('/calendar/schedule/timeweek', calendarCL.dataCalendarTimeWeek);
router.get('/calendar/schedule/timebyuser', calendarCL.dataCalendarTimeByUser);
/**Store */
router.get('/store/search', storeCL.dataSearch);
module.exports = router;
