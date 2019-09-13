var sql = require('../helper/sql');

async function getDashboard(req, res) {
    var data = {
        type: 'basic',
        view: 'dashboard',
        title: 'Trang chủ',
    };

    if(typeof req.store == 'undefined')
        req.store = {
            id: ''
        }

    sql.get(`SELECT * FROM store WHERE id = "${req.store.id}"`)
        .then((result) => {
            if (result.length > 0) {
                data.data = result[0];
            }
            res.render('master', data);
        });





}

module.exports = {
    getDashboard: getDashboard,

}