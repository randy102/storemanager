$(function () {
   $(window).on('beforeunload', function () {
      return "";
   });
});



function CalendarWeeks(props) {
   var nextMonday = moment().day(8);
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
         <select value={props.valueWeek} onChange={props.handleWeekChange} id="cal-regist" className="custom-select font-weight-bold">
            {options}
         </select>
      </div>
   );
}

class CalendarInput extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         in: 'Đang tải...',
         out: 'Đang tải...'
      }
      this.handleInputIn = this.handleInputIn.bind(this);
      this.handleInputOut = this.handleInputOut.bind(this);
   }

   componentDidMount() {
      let date = moment(this.props.date, 'DD/MM/YYYY').format('YYYY-MM-DD');
      fetch(`/data/calendar/register?date=${date}&user=${this.props.user}&store=${this.props.store}`)
         .then(res => res.json())
         .then(result => {
            if (result.length > 0)
               this.setState({ in: result[0]['time_in'], out: result[0]['time_out'] });
            else
               this.setState({ in: '', out: '' });
         });
   }

   handleInputIn(e) {
      this.setState({ in: e.target.value });
   }

   handleInputOut(e) {
      this.setState({ out: e.target.value });
   } 

   render() {
      $('.clockpicker').clockpicker({ donetext: 'Lưu' });
      return (
         <div className="input-group mb-3 shadow-sm">
            <div className="input-group-prepend">
               <label className="input-group-text">({this.props.dateOfWeek}) {this.props.date}</label>
            </div>

            <input onChange={this.handleInputIn} name={this.props.date} type="text" autocomplete="off" className="form-control clockpicker" placeholder="Giờ vào" value={this.state.in} />

            <input onChange={this.handleInputOut} name={this.props.date} type="text" autocomplete="off" className="form-control clockpicker" placeholder="Giờ ra" value={this.state.out} />

         </div>
      );
   }
}


class CalendarForm extends React.Component {
   constructor(props) {
      super(props);
   }

   render() {
      let dateData = [];
      let curDate = moment(this.props.firstDay, 'DD/MM/YYYY').subtract(1, 'day');
      for (let i = 2; i <= 8; i++) {
         let dateOfWeek = '';

         if (i == 8) dateOfWeek = 'CN';
         else dateOfWeek = 'T.' + i;

         let tempDate = {
            dateOfWeek: dateOfWeek,
            date: curDate.add(1, 'day').format('DD/MM/YYYY')
         }

         dateData.push(tempDate);
      }

      this.inputs = dateData.map(date => (
         <CalendarInput key={date.date} date={date.date} dateOfWeek={date.dateOfWeek} user={this.props.user} store={this.props.store} />
      ));

      return (
         <cal-regist>
            {this.inputs}
         </cal-regist>
      )

   }
}

class CalendarRegister extends React.Component {
   constructor(props) {
      super(props);

      this.state = {
         firstDay: moment().day(8).format('DD/MM/YYYY'),
         valueWeek: ''
      };

      this.handleWeekChange = this.handleWeekChange.bind(this);
   }

   handleWeekChange(e) {
      $.post('/post/calendar/register', $("#calendarRegisterForm").serialize());
      let firstDay = e.target.value;
      this.setState({firstDay});
   }

   handleSave(e){
      $.post('/post/calendar/register', $("#calendarRegisterForm").serialize(), ()=>{
         alert("Đã lưu!");
         this.forceUpdate();
      });
   }

   handleWindowClose(){
      alert("Alerted Browser Close");
  }

   render() {
      return (
         <div>

            <CalendarWeeks handleWeekChange={this.handleWeekChange} valueWeek={this.state.firstDay} />

            <hr />

            <form id="calendarRegisterForm" action="/post/calendar/register" method="post">

               <CalendarForm user={this.props.user} store={this.props.store} firstDay={this.state.firstDay} />

               <input type="hidden" name="user" value={this.props.user}></input>
               <input type="hidden" name="store" value={this.props.store}></input>

               <div className="alert alert-danger">
                  <strong>Lưu ý!</strong> Những ngày để trống lịch làm sẽ được xem là <strong>OFF</strong>
               </div>

               <button type="submit" id="calendar-submit" className="invisible"></button>
            </form>

            <cate-btn>
               <a onClick={this.handleSave} href="#" id="calendar-save" className="btn btn-lg btn-outline-success rounded-pill">
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

         </div>
      );
   }
}

