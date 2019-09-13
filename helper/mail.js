var nodemailer = require('nodemailer');

function sendMail(data) {
    return new Promise(resolve => {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'welldey8800@gmail.com',
                pass: 'bemyself@88'
            }
        });

        var mailOptions = {
            from: 'Store Manager <welldey8800@gmail.com>',
            to: data.to,
            subject: data.subject,
            html: data.html,
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
                resolve(info);
            }
        });
    });
}

module.exports = {
    sendMail,
}