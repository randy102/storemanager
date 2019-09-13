class Form extends React.Component {
    constructor() {
        super();
        this.state = {
            email: '',
            validEmail: true,
            name: '',
            validName: true,
            password: '',
            validPassword: true,
            passwordVal: '',
            repassword: '',
            validRepassword: true,
            repasswordVal: '',

        };
        this.handleEmail = this.handleEmail.bind(this);
        this.handleName = this.handleName.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handleRePassword = this.handleRePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleEmail(e) {
        let val = e.target.value;
        fetch(`/data/register/find?email=${val}`)
            .then(res => res.json())
            .then(result => {
                console.log(result);
                if (result.found > 0)
                    this.setState({ email: 'Email đã tồn tại!', validEmail: false });
                else
                    this.setState({ email: '', validEmail: true });
            });


    }

    handleName(e) {
        let val = e.target.value;

        if (val.length > 15)
            this.setState({ name: 'Tên không hợp lệ', validName: false });
        else
            this.setState({ name: '', validName: true });
        console.log(this.state.validName);
    }

    handlePassword(e) {
        let val = e.target.value;
        this.setState({ passwordVal: val });

        if (val.length < 8)
            this.setState({ password: 'Mật khẩu không hợp lệ', validPassword: false });
        else
            this.setState({ password: '', validPassword: true });

        if (val != this.state.repasswordVal && this.state.repasswordVal != '')
            this.setState({ repassword: 'Mật khẩu không trùng khớp', validRepassword: false });
        else
            this.setState({ repassword: '', validRepassword: true });
    }

    handleRePassword(e) {
        let val = e.target.value;
        this.setState({ repasswordVal: val });
        if (val != this.state.passwordVal)
            this.setState({ repassword: 'Mật khẩu không trùng khớp', validRepassword: false });
        else
            this.setState({ repassword: '', validRepassword: true });
    }

    handleSubmit(e) {
        if (!this.state.validEmail ||
            !this.state.validName ||
            !this.state.validPassword ||
            !this.state.validRepassword)
            e.preventDefault();


        if (!this.state.validEmail) this.setState({ email: 'Email đã tồn tại!' });
        if (!this.state.validName) this.setState({ name: 'Tên không hợp lệ!' });
        if (!this.state.validPassword) this.setState({ password: 'Mật khẩu không hợp lệ!' });



    }

    render() {
        return (
            <form action="/post/register" method="post">
                <div className="form-group">
                    <label><i className="fas fa-at fa-fw"></i> Email</label>
                    <input required onChange={this.handleEmail} className="form-control" type="email" name="email" placeholder="Nhập email..." />
                    <small className="ml-2 form-text text-danger">{this.state.email}</small>
                </div>

                <div className="form-group">
                    <label><i className="fas fa-user fa-fw"></i> Họ tên (Tối đa 15 ký tự)</label>
                    <input required onChange={this.handleName} className="form-control" type="text" name="name" placeholder="Nhập họ tên... vd: N.T.Bích Ngọc" />
                    <small className="ml-2 form-text text-danger">{this.state.name}</small>
                </div>

                <div className="form-group">
                    <label><i className="fas fa-key fa-fw"></i> Mật khẩu (Tối thiểu 8 ký tự)</label>
                    <input required onChange={this.handlePassword} className="form-control" type="password" name="password" placeholder="Mật khẩu..." />
                    <small className="ml-2 form-text text-danger">{this.state.password}</small>
                </div>

                <div className="form-group">
                    <label><i className="fas fa-key fa-fw"></i> Nhập lại mật khẩu</label>
                    <input required onChange={this.handleRePassword} className="form-control" type="password" placeholder="Nhập lại mật khẩu..." />
                    <small className="ml-2 form-text text-danger">{this.state.repassword}</small>
                </div>

                <button onClick={this.handleSubmit} className="btn btn-outline-success rounded-pill mr-2">Đăng ký</button>

            </form>
        )
    }
}

ReactDOM.render(<Form />,
    document.getElementsByClassName('login-form')[0]);