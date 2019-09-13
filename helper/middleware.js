var authHelper = require('../helper/auth');
var sql = require('../helper/sql');

function index(req,res,next){
    if (authHelper.exceptPath(req.path)) 
        next();
    
    else if (req.isAuthenticated()) {
        //User info
        res.locals.user = req.user;

        //Current Store info
        if(req.cookies.store){
            res.locals.user.store = JSON.parse(req.cookies.store);
            req.store = JSON.parse(req.cookies.store);
        }
        

        //List Store of User
        var sqlStoreList = `
            SELECT s.name, s.id FROM  store_join AS j 
            INNER JOIN store AS s ON j.store_id = s.id
            WHERE j.emp_id = "${req.user.id}" 
        `;
        
        sql.get(sqlStoreList)
            .then(result => {
                if(result.length > 0)
                    res.locals.user.storeList = result;
                next();
            });
        
    }
    else 
        res.redirect('/login');
}

module.exports = {
    index,
}