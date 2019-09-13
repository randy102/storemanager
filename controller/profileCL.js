function getProfile(req,res){
    let data = {
        type: 'basic',
        view: 'profile',
        title: 'Hồ sơ cá nhân'
      };
      res.render('master',data);
}

module.exports = {
    getProfile: getProfile,
}