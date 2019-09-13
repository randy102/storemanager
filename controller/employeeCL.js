var sql = require('../helper/sql');
var moment = require('moment');
function getEmployee(req,res){
    let data = {
        type: 'basic',
        view: 'employee',
        title: 'Nhân viên'
      };
      res.render('master',data);
}

function getEmployeeManage(req,res){
    let data = {
        type: 'basic',
        view: 'employee-manage',
        title: 'Quản lý nhân viên'
    };

    let sqlEmpList = `
        SELECT * FROM store_join AS j
        INNER JOIN employee AS e ON j.emp_id = e.id
        WHERE j.store_id = "${req.store.id}"
        AND NOT e.id = "${req.user.id}"
    `;

    let sqlApplyList = `
        SELECT * FROM store_apply AS a
        INNER JOIN employee AS e ON a.emp_id = e.id
        WHERE a.store_id = "${req.store.id}"
    `;

    sql.get(sqlEmpList)
        .then(result =>{
            if(result.length > 0)
                data.empList = result; 
        })
        .then(() => sql.get(sqlApplyList) ) 
        .then(result => {
            if(result.length > 0)
                data.applyList = result;
                
            res.render('master',data);
        })
    
}

function getEmployeeProfile(req,res){
    let data = {
        type: 'basic',
        view: 'employee-profile',
        title: 'Hồ sơ nhân viên'
    };

    sql.find('employee',{id: req.query.id})
        .then(result => {
            if(result.length > 0)
                data.employee = result[0];

            res.render('master',data);
        });
    
    
}

function doApproveApply(req,res){
    
    var fields = {
        emp_id: req.query.id, 
        store_id: req.store.id,
        joined_date: moment().format("YYYY-MM-DD")
    }
    sql.insert('store_join',fields)
        .then(() => sql.del('store_apply',{emp_id: req.query.id, store_id: req.store.id}))
        .then(()=>{
            res.send(true);
        });
        
}

function doDeleteApply(req,res){
   
    sql.del('store_apply',{emp_id: req.query.id, store_id: req.store.id})
        .then((result) => {
            if(result)
                res.send(true);
        });
}

function doDeleteEmployee(req,res){
   
    sql.del('store_join',{emp_id: req.query.id, store_id: req.store.id})
        .then((result) => {
            if(result)
                res.send(true);
        });
}

function doChangeRole(req,res){
    var userId = req.query.id;
    var userRole = req.query.role;
    sql.update('store_join',{emp_id: userId, store_id: req.store.id}, {role: userRole})
        .then(()=>{
            res.send(true);
        });
}

module.exports = {
    getEmployee,
    getEmployeeManage,
    getEmployeeProfile,

    doDeleteApply,
    doDeleteEmployee,
    doApproveApply,
    doChangeRole,
};