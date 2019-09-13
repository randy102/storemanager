var sql = require('../helper/sql');
var mail = require('../helper/mail');
var auth = require('../helper/auth');
var md5 = require('md5');

const host = 'http://localhost:3000';

/**GET */
function getLogin(req, res) {
    if (req.isAuthenticated())
        res.redirect('/');
    else {
        let data = {
            title: 'Đăng nhập',
            type: 'others',
            view: 'login',
            error: req.flash('error'),
        };

        res.render('master', data);
    }

}

function getRegister(req, res) {
    if (req.isAuthenticated())
        res.redirect('/');
    else {
        let data = {
            title: 'Đăng ký',
            type: 'others',
            view: 'register',
        }
        res.render('master', data);
    }
}

function getLogout(req, res) {
    if (req.isAuthenticated()) {
        req.logout();
    }
    res.clearCookie('store');
    res.redirect('/login');

}

function dataRegisterFind(req, res) {
    var email = req.query.email;
    sql.find('employee', { email: email })
        .then(result => {
            if(result)
                res.json({ found: result.length });
        })
        .catch(e=>{
            console.log(e);
        }); 
}

function getActivateUser(req, res) {
    var userId = req.query.id;
    sql.find('employee', { id: userId })
        .then(result => {
            if (result.length == 0) {
                res.render('master', { type: 'error' });
            }
            else if (result[0].activated) {
                res.redirect('/login');
            }
            else {
                let data = {
                    title: 'Xác thực tài khoản',
                    type: 'others',
                    view: 'active',
                    userAct: result[0],
                };
                res.render('master', data);
            }

        });
}

function getActivateSuccess(req, res) {
    var userId = req.query.id;
    var userToken = req.query.token;

    //Find user ID
    sql.find('employee', { id: userId })
        .then(result => {

            //If not found
            if (result.length == 0)
                res.render('master', { type: 'error' });

            //If user is activated
            else if (result[0].activated)
                res.redirect('/login');

            //If user is not activated
            else {
                //Check token
                sql.find('token', { id: userToken, type: 'register' })
                    .then(result => {

                        //If  not found token
                        if (result.length == 0)
                            res.render('master', { type: 'error' });

                        //If found token and match ID
                        else if (userToken == auth.crypt(userId)) {

                            //Activate user
                            sql.update('employee', {id:userId} , { activated: 1 })
                                .then(() => {
                                    console.log("Updated");
                                    let data = {
                                        title: 'Xác thực thành công',
                                        view: 'active-success',
                                        type: 'others'
                                    }
                                    res.render('master', data);
                                });
                        }

                        //If not match
                        else
                            res.render('master', { type: 'error' });

                    });
            }
        });

}

function dataResendActivate(req, res) {
    var id = req.query.id;
    let mailHTML = `
        <p>
            Vui lòng nhấn vào 
            <a href="${host}/activatesuccess?id=${id}&token=${auth.crypt(id)}">XÁC NHẬN</a> 
            để xác thực tài khoản của bạn!
        </p>`;

    let mailData = {
        to: req.query.email,
        subject: 'Xác thực tài khoản',
        html: mailHTML
    }

    //Send activated mail
    mail.sendMail(mailData)
        .then(() => {
            res.json({ mail: "Đã gửi" });
        });
}

function getPasswordForgot(req, res) {
    let data = {
        title: 'Quên mật khẩu',
        view: 'password-forgot',
        type: 'others',
        error: req.flash('userNotFound'),
        sendmail: req.flash('sendMail'),
    }
    res.render('master', data);
}

function getPasswordReset(req, res) {
    var id = req.query.id;
    var token = req.query.token;
    //If id is empty
    if (id == '')
        res.render('master', { type: 'error' });

    //If id is not empty
    else {
        //Check token
        sql.find('token', { id: token, type: 'password' })
            .then(result => {

                //if invalid token
                if (result.length == 0)
                    res.render('master', { type: 'error' });

                //If valid token
                else if (token == auth.crypt(id)) {

                    //find user
                    sql.find('employee', { id: id })
                        .then(result => {
                            if (result.length == 0)
                                res.render('master', { type: 'error' });
                            else {
                                let data = {
                                    title: 'Tái lập mật khẩu',
                                    view: 'password-reset',
                                    type: 'others',
                                    userId: id,
                                }
                                res.render('master', data);
                            }
                        });
                }
                else
                    res.render('master', { type: 'error' });

            });



    }
}

function getPasswordSuccess(req, res) {
    let data = {
        title: 'Thành công',
        view: 'password-success',
        type: 'others'
    }
    res.render('master', data);
}

/**POST */
function postLogin(req,res){
    var sqlStore = `
        SELECT * FROM employee AS e
        INNER JOIN store_join AS j ON j.emp_id = e.id
        INNER JOIN store AS s ON j.store_id = s.id
        WHERE e.email = "${req.user}" 
    `;
    
    sql.get(sqlStore)
        .then(result => {
            if(result.length > 0){
                res.cookie('store', JSON.stringify(result[0])); 
            }
            
            res.redirect('/dashboard');
        });
        
    
    
}

function postRegister(req, res) {
    let fields = {
        email: req.body.email,
        name: req.body.name,
        password: auth.crypt(req.body.password),
        avatar: 't.png'
    };

    //Insert new user
    sql.insert('employee', fields)
        .then(id => {

            let tokenFields = {
                id: auth.crypt(id),
                type: 'register'
            };

            //Create token
            sql.insert('token', tokenFields)
                .then(() => {

                    let mailHTML = `
                        <p>
                            Vui lòng nhấn vào 
                            <a href="${host}/activatesuccess?id=${id}&token=${auth.crypt(id)}">XÁC NHẬN</a> 
                            để xác thực tài khoản của bạn!
                        </p>`;

                    let mailData = {
                        to: req.body.email,
                        subject: 'Xác thực tài khoản',
                        html: mailHTML
                    }

                    //Send activated mail
                    mail.sendMail(mailData)
                        .then(() => {
                            res.redirect(`/activateuser?id=${id}`);
                        });
                });

        });
}

function postPasswordForgot(req, res) {
    var email = req.body.email;

    //Find user
    sql.find('employee', { email: email })
        .then(result => {

            //if not found
            if (result.length == 0) {
                req.flash('userNotFound', 'Không tìm thấy Email của bạn');
                res.redirect('/passwordforgot');

                //If found user
            } else {
                let userId = result[0].id;
                let tokenFields = {
                    id: auth.crypt(userId),
                    type: 'password'
                }
                //set token
                sql.insert('token', tokenFields)
                    .then(() => {
                        let mailHTML = `Vui lòng nhấp vào <a href="${host}/passwordreset?id=${userId}&token=${auth.crypt(userId)}">Đây</a> để thiết lập lại mật khẩu`;
                        let mailData = {
                            to: result[0].email,
                            subject: 'Tái lập mật khẩu',
                            html: mailHTML,
                        }

                        //send reset mail
                        mail.sendMail(mailData)
                            .then((info) => {
                                req.flash('sendMail', 'Chúng tôi đã gửi cho bạn một thư, vui lòng truy cập vào hộp thư và làm theo hướng dẫn');
                                res.redirect('/passwordforgot');
                            });
                    });


            }
        });
}

function postPasswordReset(req, res) {
    let id = req.body.id;

    let fields = {
        password: auth.crypt(req.body.password)
    }

    sql.update('employee', id, fields)
        .then(() => {
            res.redirect('/passwordsuccess');
        });
}

module.exports = {
    getLogin,
    getRegister,
    getLogout,
    getActivateUser,
    getActivateSuccess,
    getPasswordForgot,
    getPasswordReset,
    getPasswordSuccess,

    postLogin,
    postPasswordForgot,
    postPasswordReset,
    postRegister,

    dataRegisterFind,
    dataResendActivate
};