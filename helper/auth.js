var md5 = require('md5');
function exceptPath(reqPath){
    var validPath = [
        '/login',
        '/register',
        '/post/login',
        '/post/register',
        '/data/register/find',
        '/post/register',
        '/activateuser',
        '/activatesuccess',
        '/passwordforgot',
        '/passwordreset',
        '/passwordsuccess',
        '/post/passwordforgot',
        '/post/passwordreset',
        '/data/resendactivate'
    ];
    for(path of validPath){
        if(reqPath == path) return true;
    }
    return false;
}

function crypt(str){
    var secretKey = 'bemyself';
    str += secretKey;
    return md5(str);
}

module.exports = {
    exceptPath,
    crypt,
}