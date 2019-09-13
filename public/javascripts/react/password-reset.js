class Form extends React.Component {
    constructor() {
        super();
        this.state = {
            repassword: '',
            passwordVal: '',
            repasswordVal: '',
            validForm: false,
        }
        this.handlePassword = this.handlePassword.bind(this);
        this.handleRePassword = this.handleRePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handlePassword(e){
        var val = e.target.value;
        this.setState({passwordVal: val});
        console.log(val);
        if(this.state.repasswordVal != val && this.state.repasswordVal != ''){
            this.setState({validForm: false, repassword: 'Mật khẩu không trùng khớp'});
        }
        else{
            this.setState({validForm: true, repassword: ''});
        }
    }

    handleRePassword(e){
        var val = e.target.value;
        this.setState({repasswordVal: val});
        console.log(val);
        if(this.state.passwordVal != val){
            console.log('False');
            this.setState({validForm: false, repassword: 'Mật khẩu không trùng khớp'});
        }
        else{
            console.log('True');
            this.setState({validForm: true, repassword: ''});
        }
    }

    handleSubmit(e){
        if(!this.state.validForm){
            e.preventDefault();
        }
    }

    render() {
        return (
            <form action="post/passwordreset" method="POST">
                <input type="hidden" name="id" value={window.userId} />
                <div className="form-group">
                    <label>Mật khẩu mới (Tối thiểu 8 ký tự): </label>
                    <input onChange={this.handlePassword} required minlength="8" type="password" name="password" className="form-control" placeholder="Nhập mật khẩu mới..." />
                </div>
                <div className="form-group">
                    <label>Nhập lại mật khẩu: </label>
                    <input onChange={this.handleRePassword} required minlength="8" type="password" className="form-control" placeholder="Nhập lại mật khẩu" />
                    <small className="text-danger mt-2">{this.state.repassword}</small>
                </div>
                <button onClick={this.handleSubmit} className="btn btn-primary">Xác nhận</button>
            </form>
        );
    }
}

ReactDOM.render(<Form />, document.getElementById('resetPassword'));