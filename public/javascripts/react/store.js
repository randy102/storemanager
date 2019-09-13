function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

class StoreResult extends React.Component {
    constructor(props) {
        super(props);
        
        this.handleStoreApply = this.handleStoreApply.bind(this);
    }

    handleStoreApply(e){
        let storeId = e.target.dataset.storeid;
        fetch(`/store/apply?id=${storeId}`)
            .then(res => res.json())
            .then(result => {
                if(result.res)
                    $('#storeApplyModalS').modal('show');
                else
                    $('#storeApplyModalF').modal('show');
            });
    }

    render() {

        if (!this.props.searching)
            return (<div className="text-center">Hãy nhập từ khóa để tìm kiếm</div>);
        else {
            if (this.props.loading)
                return (
                    <div class="d-flex justify-content-center">
                        <div class="spinner-border" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>
                );

            if (!isJson(this.props.result) || !this.props.result)
                return (<div className="text-center">Không tìm thấy cửa hàng.</div>);
            else {
                var result = JSON.parse(this.props.result);
                var resultList = result.map(store =>
                    (
                        <div key={store.id} className="store-s-result">
                            <div className="store-result-item shadow">
                                <div className="result-brand">
                                <span className="mr-2 badge badge-success rounded-pill">{store.id}</span> {store.name} 
                                </div>
                                <div className="result-address">
                                    {store.address}
                                </div>
                                <button onClick={this.handleStoreApply} data-storeid={store.id} className="btn btn-success">Gia nhập</button>
                            </div>
                        </div>
                    )
                );

                return (<div>{resultList}</div>);
            }

        }

    }
}

class StoreSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            result: '',
            searching: false,
            loading: false,
        }
        this.handleSearch = this.handleSearch.bind(this);
    }

    handleSearch(e) {
        var keyword = e.target.value;

        if (keyword != '') {
            this.setState({ searching: true, loading: true });

            fetch(`/data/store/search?key=${keyword}`)
                .then(res => res.json())
                .then(result => {
                    if (result.length > 0)
                        this.setState({ result: JSON.stringify(result), loading: false });
                    else
                        this.setState({ result: 0, loading: false });
                });
        }
        else
            this.setState({ searching: false });
    }

    render() {
        return (
            <div>
                <cate-head>
                    <i className="fas fa-search fa-fw"></i>
                    Tìm cửa hàng
                </cate-head>
                <div className="store-search">
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Nhập Mã hoặc Tên CH: </span>
                        </div>
                        <input onChange={this.handleSearch} className="form-control" type="text" placeholder="Ví dụ: 880803 hoặc 197NT..." />
                        <div className="input-group-append">
                            <button className="btn btn-outline-secondary">
                                <i className="fas fa-search"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <StoreResult loading={this.state.loading} result={this.state.result} searching={this.state.searching} />

            </div>
        );
    }
}

ReactDOM.render(<StoreSearch />, document.getElementById('store-search'));