function getNotification(req,res){
    let data = {
        type: 'basic',
        view: 'notification',
        title: 'Thông báo'
      };
      res.render('master',data);
}

function getNotificationList(req,res){
    let data = {
        type: 'basic',
        view: 'notification-list',
        title: 'Thông báo đã đăng'
      };
      res.render('master',data);
}
module.exports = {
    getNotification: getNotification,
    getNotificationList: getNotificationList,
}