var moment = require('moment');
var sql = require('../helper/sql');
/**GET */

function getCalendar(req, res) {
    let data = {
        type: 'basic',
        view: 'calendar',
        title: 'Lịch làm việc'
    };
    res.render('master', data);
}

function getCalendarRegister(req, res) {
    let data = {
        type: 'basic',
        view: 'calendar-register',
        title: 'Đăng ký lịch'
    };
    res.render('master', data);
}

function getCalendarSchedule(req, res) {
    let data = {
        type: 'basic',
        view: 'calendar-schedule',
        title: 'Xếp lịch',
        curDay: req.flash('curDay'),
    };
    res.render('master', data);
}

/**DATA */

function dataCalendarRegister(req, res) {
    let fields = {
        emp_id: req.query.user,
        store_id: req.query.store,
        date: req.query.date,
    }

    sql.find('calendar_register', fields)
        .then((result) => {
            res.json(result);
        });
}

function dataCalendarUser(req,res){
    var storeId = req.store.id;
    var sqlUser = `
        SELECT * FROM store_join AS j
        INNER JOIN employee AS e ON j.emp_id = e.id
        WHERE j.store_id = "${storeId}"
    `;
    sql.get(sqlUser)
        .then(result => {
            res.json(result);
        });
}


function dataCalendarTime(req,res){
    let fields = {
        emp_id: req.query.emp,
        store_id: req.store.id,
        date: req.query.d,
    }

    sql.find('calendar', fields)
        .then((result) => {
            res.json(result);
        });
}

function dataCalendarScheduleRegistered(req,res){
    var date = req.query.date;
    var sqlUser =  `
        SELECT * FROM store_join AS j
        JOIN employee AS e ON e.id = j.emp_id
        JOIN calendar_register AS r ON r.emp_id = j.emp_id AND r.store_id = j.store_id
        WHERE j.store_id="${req.store.id}" AND r.date="${date}"

    `;
    sql.get(sqlUser).then(result=>{ 
        res.json(result); 
    });
    
}

function dataCalendarTimeWeek(req,res){
    
    var sqlUser = `
        SELECT * FROM calendar
        WHERE emp_id="${req.query.id}" AND store_id="${req.store.id}"
        AND date BETWEEN "${req.query.firstday}" AND "${req.query.endday}"
    `;
    sql.get(sqlUser).then(result=>{ 
        
        res.json(result); 
    });
    
}

function dataCalendarTimeByUser(req,res){
    var sqlUser = `
        SELECT * FROM calendar AS c
        JOIN employee AS e ON c.emp_id = e.id
        WHERE c.date = "${req.query.date}" AND c.store_id="${req.store.id}"
    `;

    sql.get(sqlUser).then(result=>{ 
        
        res.json(result); 
    });
}

/**POST */

function postCalendarRegister(req, res) {
    var calendar = req.body;
    for (date in calendar) {
        let fields = {
            time_in: calendar[date][0],
            time_out: calendar[date][1],
            date: moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD'),
            emp_id: calendar.user,
            store_id: calendar.store
        }
        sql.replace('calendar_register', fields)
            
    }

    res.redirect('back');
}

//***************** NOT USE ***********************//

/* function postCalendarSchedule(req,res){
    var calendar = req.body;
    var date = req.body.date;
    
    for (emp in calendar) {
        if(emp != 'date'){
            var time_in = moment(calendar[emp][0],"HH:mm");
            var time_out = moment(calendar[emp][1],"HH:mm");
            var total = Math.abs(time_out.diff(time_in,'hours',true));
            
            var fields = {
                time_in: calendar[emp][0],
                time_out: calendar[emp][1],
                date: moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                emp_id: emp,
                total,
                store_id: req.store.id,
            }
           
            sql.replace('calendar', fields);
                
        }
    }
    req.flash('curDay',date);
    res.redirect('back');
} */

function postCalendarScheduleAuto(req,res){
    var calendar = req.body;
    var date = req.body.date;
    
    for (emp in calendar) {
        if(emp != 'date'){
            var time_in = moment(calendar[emp][0],"HH:mm");
            var time_out = moment(calendar[emp][1],"HH:mm");
            var total = time_out.diff(time_in,'hours',true);
            
            if(total < 0){
                let temp =  calendar[emp][0];
                calendar[emp][0] =  calendar[emp][1];
                calendar[emp][1] = temp;
            }
            var fields = {
                time_in: calendar[emp][0],
                time_out: calendar[emp][1],
                date: moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                emp_id: emp,
                total: Math.abs(total),
                store_id: req.store.id,
            }
           
            sql.replace('calendar', fields)
            .then(()=>{res.end(); return;})
            .catch(e=>{
                console.log(e);
            });
                
        }
    }
    
    
}

module.exports = {
    getCalendar, //Load Calendar Page
    getCalendarRegister, //Load Register Page
    getCalendarSchedule, //Load Schedule Page

    dataCalendarRegister, //Get each user's registered time in Register Page
    dataCalendarUser, //Get user list of a store in Schedule Page
    dataCalendarTime, //Get  each user's scheduled time in Schedule Page
    dataCalendarScheduleRegistered, //Get user's registered time in 1 day in Schedule Page
    dataCalendarTimeWeek, //Get user's time in 1 week
    dataCalendarTimeByUser, //Get scheduled time of all users in 1 day in Schedule Page

    postCalendarRegister, //Save user's registered time of 1 day
    //postCalendarSchedule, //Save scheduled time of 1 day when click save button
    postCalendarScheduleAuto, //Save scheduled time of 1 day automately when switch to another day/week


}