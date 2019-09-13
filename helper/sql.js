var mysql = require('mysql');
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'store_manager',
    connectionLimit: 10,
});

function get(sql) {
    return new Promise(resolve => {
        pool.getConnection((err, con) => {
            if (err) throw err;
            con.query(sql, (err, res, fields) => {
                resolve(res);
            });
            con.release();
        });
    });
}

function check(email, password) {
    return new Promise(resolve => {
        let sql = `SELECT COUNT(*) AS count FROM employee WHERE email='${email}' AND password='${password}'`;
        pool.getConnection((err, con) => {
            con.query(sql, (err, res, fields) => {
                if (res[0]['count'] > 0)
                    resolve(true);
                else resolve(false);
            });
            con.release();
        });
    });
}

function insert(table, fields) {
    return new Promise(resolve => {
        let sql = `INSERT INTO ${table} SET ?`; 
        pool.getConnection((err, con) => {
            con.query(sql, fields ,(err, res, fields) => {
                if(res.insertId)
                    resolve(res.insertId);
                else
                    resolve();
            });
            con.release();
        });
    });
}

function replace(table, fields){
    return new Promise(resolve => {
        let sql = `REPLACE INTO ${table} SET ?`; 
        pool.getConnection((err, con) => {
            con.query(sql, fields ,(err, res, fields) => {
                if(err) throw err; 
                resolve();
            });
            con.release();
        });
    });
}

function find(table, fields){
    return new Promise(resolve => {
        let sqlFields = '';
        for(let field in fields){
            sqlFields += ` ${field}="${fields[field]}" AND`;
        }
        sqlFields = sqlFields.slice(0,-3);
        let sql = `SELECT * FROM ${table} WHERE ${sqlFields}`;
        pool.getConnection((err,con) => {
            con.query(sql,(err,res,fields) =>{
                resolve(res);
            });
            con.release();
        });
    });
}

function search(table, fields, limit){
    return new Promise(resolve => {
        let sqlFields = '';
        for(let field in fields){
            sqlFields += ` ${field} LIKE "%${fields[field]}%" OR`;
        }
        sqlFields = sqlFields.slice(0,-2);
        let sql = `SELECT * FROM ${table} WHERE ${sqlFields} LIMIT ${limit}`;
        pool.getConnection((err,con) => {
            con.query(sql,(err,res,fields) =>{
                resolve(res);
            });
            con.release();
        });
    });
}

function update(table, conditions, fields){
    return new Promise(resolve => {
        let cons = '';
        console.log("conditions: ",conditions);
        for(let field in conditions){
            cons += `${field}="${conditions[field]}" AND`;
        }
        cons = cons.slice(0,-3);
        
        let sql = `UPDATE ${table} SET ? WHERE ${cons}`;
        
        pool.getConnection((err, con) => {
            con.query(sql, fields ,(err, res, fields) => {
                if(err) console.log(err);
                resolve();
            });
            con.release();
        });
    });
}

function del(table, fields){
    return new Promise(resolve => {
        let sqlFields = '';
        for(let field in fields){
            sqlFields += ` ${field}="${fields[field]}" AND`;
        }
        sqlFields = sqlFields.slice(0,-3);
        let sql = `DELETE FROM ${table} WHERE ${sqlFields}`;
        pool.getConnection((err,con) => {
            con.query(sql,(err,res,fields) =>{
                resolve(res.affectedRows);
            });
            con.release();
        });
    });
}

module.exports = {
    get,
    check,
    insert,
    replace,
    find,
    search,
    update,
    del
}