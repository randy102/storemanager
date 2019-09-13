function getChat(req, res) {
    let data = {
        type: 'basic',
        view: 'chat',
        title: 'Phòng chat'
    };
    res.render('master', data);
}

module.exports= {
    getChat: getChat,
}