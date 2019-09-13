function getManage(req, res) {
    let data = {
        type: 'basic',
        view: 'manage',
        title: 'Quản lý cửa hàng'
    };
    res.render('master', data);
}

module.exports = {
    getManage: getManage,
}