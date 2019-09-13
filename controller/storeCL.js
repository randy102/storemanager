var sql = require("../helper/sql");
var auth = require("../helper/auth");
var moment = require("moment");

function getStore(req, res) {
    let data = {
        type: 'basic',
        view: 'store',
        title: 'Cửa hàng'
    };

    let sqlStoreList = `
        SELECT * FROM store 
        INNER JOIN store_join ON store.id = store_join.store_id
        WHERE emp_id = ${req.user.id}
    `;

    sql.get(sqlStoreList)
        .then(result => {
            if(result.length > 0)
                data.storeList = result;
            else
                data.storeList = false;

            res.render('master', data);
        });
}

function getSwitchStore(req,res){
    var storeId = req.query.id;
    var sqlStore = `
        SELECT * FROM store_join AS j
        INNER JOIN store AS s ON j.store_id = s.id
        WHERE j.store_id = "${storeId}" AND j.emp_id = "${req.user.id}"
    `;
    
    sql.get(sqlStore)
        .then(result => {
            if(result.length > 0){
                res.cookie('store', JSON.stringify(result[0])); 
            }
            res.redirect('back');
        });
    
}

function getStoreApply(req,res){
    let userId = req.user.id;
    let storeId = req.query.id;
    sql.find('store_join',{emp_id: userId, store_id: storeId})
        .then(result =>{
            if(result.length > 0)
                res.json({res: false, mess: "Bạn đã gia nhập cửa hàng!"});
            else{
                sql.replace('store_apply',{emp_id: userId, store_id: storeId})
                    .then(result => {
                        res.json({res:true, mess: "Xin gia nhập thành công!"});
                    });
            }
        })
}

function dataSearch(req,res){
    let key = req.query.key;
    sql.search('store',{id: key, brand: key, address: key, name: key}, 10)
        .then(result => {
            res.json(result);
        }); 
}   

function postStoreCreate(req,res){
    let type = req.body.type.split(',');

    let idStr = req.body.brand + req.body.address + req.body.name;
    let idCrypted =  auth.crypt(idStr).slice(0,6);

    let storeFields = {
        id: idCrypted,
        brand: req.body.brand,
        name: req.body.name,
        address: req.body.address,
        type: type[0],
        icon: type[1],
        background: 'default.jpg',
    }

    let storeJoinFields = {
        emp_id: req.user.id,
        store_id: idCrypted,
        joined_date: moment().format("YYYY-MM-DD"),
        role: 0
    }
    
    sql.insert('store',storeFields)
        .then(()=>{
            return sql.insert('store_join', storeJoinFields);
        })
        .then(()=>{
            res.redirect(`/store/switch?id=${idCrypted}`);
        });
}



module.exports = {
    getStore,
    getSwitchStore,
    getStoreApply,
    
    dataSearch,

    postStoreCreate,
}