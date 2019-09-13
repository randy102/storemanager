function getShiftTime(timeIn, timeOut) {
    timeIn = moment(timeIn, "HH:mm");
    timeOut = moment(timeOut, "HH:mm");
    let pivot = moment('12:00', "HH:mm");
    let day = Math.abs(timeIn.diff(pivot, 'hours', true));
    let night = Math.abs(timeOut.diff(pivot, 'hours', true));
    if (day >= night) return 'am';
    else return 'pm';
}

function cutDate(date) {
    return moment(date).format("YYYY-MM-DD");
}

class calendarReviewByUser {
    constructor(userData, firstDay) {
        this.userData = userData;
        this.firstDay = firstDay;
    }

    get() {
        var result = "";
        var curDay = moment(this.firstDay, "DD/MM/YYYY");

        //For each day of week
        for (let i = 0; i <= 6; i++) {
            //Get the HTML column of 1 day
            result += this.getHTML(curDay.format("YYYY-MM-DD"));
            curDay.add(1, 'day');
        }
        return result;
    }

    getHTML(curDay) {
        //Looking for the data in server
        for (let day of this.userData) {
            //If found data of that day
            if (curDay == cutDate(day.date)) {
                //If the in/out time not in default status ("00:00")
                if (day.time_in != day.time_out) {
                    let shift = getShiftTime(day.time_in, day.time_out);
                    return `<td ${shift}>${day.time_in} - ${day.time_out}</td>`;
                }
            }
        }
        //If not found data
        return `<td> - </td>`;
    }
}

class calendarReviewByDate {
    constructor(userData, firstDay) {
        this.userData = userData;
        this.firstDay = firstDay;
        this.color = this.createColor();
    }

    createColor() {
        var colorRange = [
            'rgb(122, 237, 255)',
            'rgb(255, 154, 146)',
            'rgb(201, 255, 137)',
            'rgb(238, 135, 255)',
            'rgb(255, 255, 255)',
            'rgb(210, 214, 234)',
            'rgb(40, 160, 255)',
            'rgb(255, 247, 171)',
            'rgb(250, 0, 85)',
            'rgb(24, 188, 173)',
            'rgb(218, 3, 255)',
            'rgb(244, 219, 0)',
        ];
        var index = 0;
        var Color = {};
        for (let emp of this.userData) {
            Color[emp.id] = {
                'color': colorRange[index],
                'name': emp.name
            };

            index++;
        }
        return Color;
    }

    createBars(DOW) {
        //Initiate timeBars
        var timeBars = "";
        var curDay = moment(this.firstDay, "DD/MM/YYYY").add(DOW, 'day').format("YYYY-MM-DD");

        //Clear content
        $(`#dow${DOW}`).html('');

        //fetch all user time in 1 day
        fetch(`/data/calendar/schedule/timebyuser?date=${curDay}`)
            .then(res => res.json())
            .then(result => {
                //for each user
                for (let emp of result) {
                    if (emp.time_in != emp.time_out) {
                        //Determine the length of bar
                        let from = Number(moment(emp.time_in, "HH:mm").format("HH")) + 1;
                        let to = Number(moment(emp.time_out, "HH:mm").format("HH")) + 1;

                        timeBars += `
                    <div class="time-element" data-toggle="tooltip" 
                        data-placement="bottom" title="${emp.name}" 
                        style="grid-column: ${from} / ${to}; background: ${this.color[emp.id]['color']};">
                        <span class="ml-2 float-left">${emp.time_in}</span>
                        <span class="mr-2 float-right">${emp.time_out}</span>
                    </div>
                `;
                    }

                }

                //Add bars
                $(`#dow${DOW}`).append(timeBars);

                /**Active Bootstrap Tooltip */
                $('[data-toggle="tooltip"]').tooltip();
            });
    }

    get() {
        for (let emp in this.color) {
            let html = `
            <div class="time-element" style="background: ${this.color[emp]['color']}">
                ${this.color[emp]['name']}
            </div>
        `;
            $('#empColors').append(html);
        }
        for (let DOW = 0; DOW <= 6; DOW++) {
            this.createBars(DOW);
        }
    }
}

/** React Component below...*/

function CalendarWeeks(props) {
    var nextMonday = moment().day(1);
    var dates = [];

    for (var i = 0; i <= 5; i++) {
        let from = nextMonday.format('DD/MM/YYYY');
        let to = nextMonday.add(6, 'day').format('DD/MM/YYYY');
        dates.push({ from: from, to: to });
        nextMonday.add(1, 'day');
    }

    var options = dates.map(date => (
        <option key={date.from} value={date.from}>Tuần từ {date.from} đến {date.to}</option>
    ));

    return (
        <div className="input-group mb-3 shadow-sm">
            <div className="input-group-prepend">
                <label className="input-group-text">Thời gian: </label>
            </div>
            <select value={props.firstDay} onChange={props.handleWeekChange} id="cal-regist" className="custom-select font-weight-bold">
                {options}
            </select>
        </div>
    );
}

class CalendarDateOfWeek extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            curDay: ''
        }
    }

    componentDidMount() {
        let DOW = this.props.curDOW;
        $(`.schedule-date button[data-day="${DOW}"]`).addClass('active');
    }

    componentWillUpdate() {
        let DOW = this.props.curDOW;
        $(`.schedule-date button[data-day="${DOW}"]`).removeClass('active');
    }

    componentDidUpdate() {
        let DOW = this.props.curDOW;
        $(`.schedule-date button[data-day="${DOW}"]`).addClass('active');
    }

    render() {
        return (
            <div className="schedule-date">
                <div className="font-weight-bold btn-group btn-group-toggle justify-content-center shadow">
                    <button data-day="1" onClick={this.props.handleDOWChange} className="btn btn-info">Thứ 2</button>
                    <button data-day="2" onClick={this.props.handleDOWChange} className="btn btn-info">Thứ 3</button>
                    <button data-day="3" onClick={this.props.handleDOWChange} className="btn btn-info">Thứ 4</button>
                    <button data-day="4" onClick={this.props.handleDOWChange} className="btn btn-info">Thứ 5</button>
                    <button data-day="5" onClick={this.props.handleDOWChange} className="btn btn-info">Thứ 6</button>
                    <button data-day="6" onClick={this.props.handleDOWChange} className="btn btn-info">Thứ 7</button>
                    <button data-day="7" onClick={this.props.handleDOWChange} className="btn btn-info">Chủ Nhật</button>
                </div>
                <h3>
                    <div className=" mt-3 badge badge-pill badge-secondary" id="curDay">{this.props.curDay}</div>
                </h3>

            </div>
        );
    }
}

class CalendarEditInput extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        $('.clockpicker1').clockpicker({ donetext: 'Lưu' });
    }

    render() {
        $(`#${this.props.empId}in`).val("Đang tải...");
        $(`#${this.props.empId}out`).val("Đang tải...");

        var date = moment(this.props.curDay, "DD/MM/YYYY").format("YYYY-MM-DD");
        fetch(`/data/calendar/schedule/time?d=${date}&emp=${this.props.empId}`)
            .then(res => res.json())
            .then(result => {

                if (result.length > 0) {
                    $(`#${this.props.empId}in`).val(result[0]['time_in']);
                    $(`#${this.props.empId}out`).val(result[0]['time_out']);
                }
                else {
                    $(`#${this.props.empId}in`).val("00:00");
                    $(`#${this.props.empId}out`).val("00:00");
                }

            });

        return (
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <span className="input-group-text">{this.props.empName}</span>
                </div>
                <input onClick={this.props.handleCalendarEdited} id={this.props.empId + 'in'} name={this.props.empId} type="text" className="form-control clockpicker1" placeholder="Giờ vào" autoComplete="off" />
                <input onClick={this.props.handleCalendarEdited} id={this.props.empId + 'out'} name={this.props.empId} type="text" className="form-control clockpicker1" placeholder="Giờ ra" autoComplete="off" />
                <div className="input-group-append">
                    <button className="btn btn-danger" data-toggle="tooltip" title="Tăng ca">
                        <i className="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        )
    }
}

class CalendarEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            emps: [],
        }

    }

    componentDidMount() {
        fetch(`/data/calendar/schedule/user`)
            .then(res => res.json())
            .then(emps => {
                this.setState({ emps });
            });
    }


    render() {
        var inputs = this.state.emps.map(emp => (
            <CalendarEditInput
                key={emp.id}
                empId={emp.id}
                empName={emp.name}
                curDay={this.props.curDay}
                handleCalendarEdited={this.props.handleCalendarEdited}
            />
        ));

        return (
            <div className="schedule-edit">
                <form id="calendarEditForm" method="post" >
                    <input type="hidden" value={this.props.curDay} name="date" />
                    {inputs}
                    <button id="saveCalendar" type="submit" className="invisible"></button>
                </form>

            </div>

        );
    }
}


class CalendarRegistered extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let loading = `
            <tr>
                <th className="table-warning">
                    <div class="spinner-grow text-dark" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                </th>
                <td>
                    <div class="spinner-grow text-dark" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                </td>
            </tr>
        `;
        $('#calendar-registerd').html(loading);

        let curDay = moment(this.props.curDay, "DD/MM/YYYY").format("YYYY-MM-DD");

        fetch(`/data/calendar/schedule/registered?date=${curDay}`)
            .then(res => res.json())
            .then(result => {
                var nothing = `
                            <tr>
                                <th className="table-warning">-</th>
                                <td>-</td>
                            </tr>
                        `;

                //If exist at least 1 registered
                if (result.length > 0) {
                    var userList = "";
                    var userCount = 0;

                    for (let emp of result) {

                        if (emp.time_in != '' && emp.time_out != '') {

                            userCount++; //Counting the row of users

                            //Get the am/pm through time in/out
                            let shift = getShiftTime(emp.time_in, emp.time_out);

                            //Push user registered timess
                            userList += `
                                <tr>
                                    <th className="table-warning">${emp.name}</th>
                                    <td ${shift}>${emp.time_in} - ${emp.time_out}</td>
                                </tr>
                            `;
                        }
                    }
                    if (userCount > 0)
                        $('#calendar-registerd').html(userList);
                    else
                        $('#calendar-registerd').html(nothing);

                    /**Add color to shift table*/
                    $('cal-body td[am]').addClass('table-info');
                    $('cal-body td[pm]').addClass('table-danger');
                }
                //If not have any registered
                else {
                    $('#calendar-registerd').html(nothing);
                }

            });
        return (
            <div className="schedule-registered">
                <cal-body>
                    <table className="table table-bordered text-center shadow">
                        <thead>
                            <tr className="thead-dark">
                                <th>Nhân viên</th>
                                <th>Giờ đăng ký</th>
                            </tr>
                        </thead>
                        <tbody id="calendar-registerd">
                            <tr>
                                <th className="table-warning">
                                    <div className="spinner-grow text-dark" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </th>
                                <td>
                                    <div className="spinner-grow text-dark" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </cal-body>
            </div>
        );
    }
}

class CalendarByUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            emps: []
        }
    }

    componentDidMount() {

        //Get the user list of store
        fetch(`/data/calendar/schedule/user`)
            .then(res => res.json())
            .then(emps => {
                this.setState({ emps });
            });
    }

    render() {
        //Clear the table calendar
        $('#schedule-result-user').html('');

        //Initialize the date range
        var firstDay = moment(this.props.firstDay, "DD/MM/YYYY").format("YYYY-MM-DD");
        var endDay = moment(this.props.firstDay, "DD/MM/YYYY").add(6, 'day').format("YYYY-MM-DD");

        //For each line of employee
        for (let emp of this.state.emps) {

            //Create name column
            let row = `<tr><th class="table-warning">${emp.name}</th>`;

            //Get the scheduled time in 1 week
            fetch(`/data/calendar/schedule/timeweek?id=${emp.id}&firstday=${firstDay}&endday=${endDay}`)
                .then(res => res.json())
                .then(result => {
                    let Calendar = new calendarReviewByUser(result, this.props.firstDay);
                    row += Calendar.get();
                    row += '</tr>';

                    $('#schedule-result-user').append(row);

                    /**Add color to shift table*/
                    $('cal-body td[am]').addClass('table-info');
                    $('cal-body td[pm]').addClass('table-danger');
                });

        }



        return (
            <cal-body>
                <table className="table table-bordered text-center shadow">
                    <thead>
                        <tr className="thead-dark">
                            <th>N.Viên</th>
                            <th>T.2</th>
                            <th>T.3</th>
                            <th>T.4</th>
                            <th>T.5</th>
                            <th>T.6</th>
                            <th>T.7</th>
                            <th>CN</th>
                        </tr>

                    </thead>
                    <tbody id="schedule-result-user">
                        <tr>
                            <th className="table-warning">Trần Quang</th>
                            <td am="true">6:00 - 14:30</td>
                            <td pm="true">14:30 - 23:00</td>
                            <td pm="true">14:30 - 23:00</td>
                            <td pm="true">14:30 - 23:00</td>
                            <td>OFF</td>
                            <td am="true">6:00 - 14:30</td>
                            <td am="true">6:00 - 14:30</td>
                        </tr>



                        <tr className="thead-light">
                            <th>Tổng giờ</th>
                            <th>45</th>
                            <th>45</th>
                            <th>45</th>
                            <th>45</th>
                            <th>45</th>
                            <th>45</th>
                            <th>45</th>
                        </tr>
                    </tbody>
                </table>
            </cal-body>

        );
    }
}

class CalendarByDate extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        $('#empColors').html('');
        fetch('/data/calendar/schedule/user')
            .then(res => res.json())
            .then(result => {
                let Calendar = new calendarReviewByDate(result,this.props.firstDay);
                Calendar.get();
            });




        return (
            <div>
                <div id="testcolor"></div>
                <table className="time-calendar shadow-lg">
                    <thead>
                        <tr>
                            <th style={{ width: 100 }}>Thời gian</th>
                            <th id="time-header">
                                <div className="timeh1">06:00</div>
                                <div className="timeh2">12:00</div>
                                <div className="timeh3">18:00</div>
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <th>T.2</th>
                            <td className="time-bar" id="dow0">

                            </td>
                        </tr>

                        <tr>
                            <th>T.3</th>
                            <td className="time-bar" id="dow1">

                            </td>
                        </tr>

                        <tr>
                            <th>T.4</th>
                            <td className="time-bar" id="dow2">

                            </td>
                        </tr>

                        <tr>
                            <th>T.5</th>
                            <td className="time-bar" id="dow3">

                            </td>
                        </tr>

                        <tr>
                            <th>T.6</th>
                            <td className="time-bar" id="dow4">

                            </td>
                        </tr>

                        <tr>
                            <th>T.7</th>
                            <td className="time-bar" id="dow5">

                            </td>
                        </tr>

                        <tr>
                            <th>CN</th>
                            <td className="time-bar" id="dow6">

                            </td>
                        </tr>
                    </tbody>
                </table>

                <hr />

                <div className="cal-note" id="empColors">

                </div>
            </div>
        );
    }
}

class CalendarReport extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <cate-head className="shadow">
                    <i className="fas fa-exclamation-circle fa-fw"></i>
                    Báo lỗi
                </cate-head>
                <table className="table table-bordered mt-3">
                    <thead>
                        <tr className="table-warning">
                            <th>N.Viên</th>
                            <th>Nội dung</th>
                            <th>Ngày gửi</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>Trần Quang</td>
                            <td>T2 em không làm được ca 6h anh ơi</td>
                            <td>12/06/2019</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

class CalendarSchedule extends React.Component {
    constructor(props) {
        super(props);

        let firstDay = moment().day(1).format('DD/MM/YYYY');
        let curDay = moment(firstDay, 'DD/MM/YYYY').day(1).format("DD/MM/YYYY");

        this.state = {
            firstDay,
            curDay,
            curDOW: 1,
        }

        //Sign that whatever inputs change
        this.editedCalendar = false;

        this.handleWeekChange = this.handleWeekChange.bind(this);
        this.handleDOWChange = this.handleDOWChange.bind(this);
        this.handleSaveCalendar = this.handleSaveCalendar.bind(this);
        this.handleCalendarEdited = this.handleCalendarEdited.bind(this);
    }

    handleWeekChange(e) {
        let firstDay = e.target.value;
        let curDay = moment(firstDay, 'DD/MM/YYYY').day(1).format("DD/MM/YYYY");
        this.setState({ firstDay, curDOW: 1, curDay });

        if (this.editedCalendar) {
            console.log("SAVE");
            $.post('/post/calendar/schedule/auto', $("#calendarEditForm").serialize(), function(){
                this.editedCalendar = false;
            });
        }
        
    }

    handleDOWChange(e) {
        let curDOW = e.target.dataset.day;
        let curDay = moment(this.state.firstDay, 'DD/MM/YYYY').day(curDOW).format("DD/MM/YYYY");
        this.setState({ curDay, curDOW });

        if (this.editedCalendar) {
            console.log("SAVE");
            $.post('/post/calendar/schedule/auto', $("#calendarEditForm").serialize(), function(){
                this.editedCalendar = false;
            });
        }

        
    }

    handleCalendarEdited(e) {
        this.editedCalendar = true;
    }

    handleSaveCalendar(e) {

        if (this.editedCalendar) {
            console.log("SAVE");
            $.post('/post/calendar/schedule/auto', $("#calendarEditForm").serialize(), () => {
                alert("Đã lưu!");
                this.editedCalendar = false;
                this.forceUpdate();
            });
        }

    }

    render() {

        return (

            <div>
                <cate-head className="shadow">
                    <i className="fas fa-calendar fa-fw"></i>
                    Xếp lịch
                </cate-head>

                <CalendarWeeks
                    firstDay={this.state.firstDay}
                    handleWeekChange={this.handleWeekChange} />

                <hr />

                <div className="alert alert-danger">
                    <strong>Lưu ý!</strong> Những nhân viên không được xếp lịch làm sẽ được xem là <strong>OFF</strong>
                </div>

                <CalendarDateOfWeek
                    handleDOWChange={this.handleDOWChange}
                    curDOW={this.state.curDOW}
                    curDay={this.state.curDay} />

                <div className="schedule-wrap">
                    <CalendarEdit
                        curDay={this.state.curDay}
                        handleCalendarEdited={this.handleCalendarEdited} />

                    <CalendarRegistered
                        curDay={this.state.curDay} />
                </div>
                <cate-btn>
                    <a onClick={this.handleSaveCalendar} href="#" className="btn btn-lg btn-outline-success rounded-pill">
                        <i className="fas fa-check-circle fa-fw"></i>
                        Lưu
                    </a>
                </cate-btn>

                <cate-btn>
                    <a href="/calendar" className="btn btn-lg btn-outline-info rounded-pill">
                        <i className="fas fa-arrow-alt-circle-left fa-fw"></i>
                        Trở về
                    </a>
                </cate-btn>

                <CalendarByUser firstDay={this.state.firstDay} />

                <CalendarByDate firstDay={this.state.firstDay} />

                <hr />

                <CalendarReport firstDay={this.state.firstDay} />


            </div>
        );
    }
}