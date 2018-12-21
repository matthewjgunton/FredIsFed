import React, {Component} from 'react';
import axios from 'axios';
// import ReactDOM from 'react-dom';

export default class Calendar extends Component{

  state = {
    person: "",
    loading: true,
    data: [],
    waitingFor: "",
  }

  componentDidMount(){

    axios.get("http://localhost:5000/fedStatus")
      .then((res)=>{
        this.setState({
          loading: false,
          data: res.data.data,
          waitingFor: res.data.waitingFor
        })
      })

  }

  handleSubmit = (e)=>{
    e.preventDefault();

    if(this.state.person === ""){
      alert("pick someone");
      return;
    }
      console.log("reached");

    axios.post('http://localhost:5000/fedStatus', {
      user: this.state.person
    })
    //might be something wrong here, error left this with no response
    .then((res)=>{
      if(res.data.error){
        alert("error with data",res.data.error);
      }else{
        alert("successfully sent data");
        this.setState({
          person: "",
          loading: true,
          data: [],
          waitingFor: "",
        })
        axios.get("http://localhost:5000/fedStatus")
          .then((res)=>{
            this.setState({
              loading: false,
              data: res.data.data,
              waitingFor: res.data.waitingFor
            })
          })
      }
    })

  }

  handleChange = (e) => {

    if(e.target.value !== "empty"){
      this.setState({
        person: e.target.value
      })
    }else{
      alert("you need to pick a person");
    }

  }

  render(){

    console.log(this.state);

    const whole = new Date();
    const currHour = whole.getHours();

    const lastWhole = new Date( (whole.getMonth())+"/"+(whole.getDate()-1)+"/"+(whole.getFullYear()) );

    const midWhole = new Date( whole.getFullYear(), whole.getMonth(), whole.getDate(), 12 );
    //we need to find out when the date line is

    var hideForm = true;
    var verb = "";

    if(!this.state.loading){

          if(this.state.waitingFor === "breakfast"){
            //need to find a way to check if dates are equal given only the miliseconds
            if(currHour < 12){
              //check if last fed miliseconds is less than today at midnight
              if(this.state.data.date < lastWhole.getTime() ){
                hideForm = false;
                verb = "needs to be";
              }else{
                hideForm = true;
                verb = "is";
              }
            }
          }
          if(this.state.waitingFor === "dinner"){

            if(currHour >= 12){
              console.log(this.state.data.date+" vs "+midWhole.getTime());
              if(this.state.data.date < midWhole.getTime()){
                console.log('entered');
                hideForm = false;
                verb = "needs to be";
              }else{
                hideForm = true;
                verb = "is";
              }
            }


          }else if (!this.state.loading){
            alert("issue with server");
          }
    }

    console.log(hideForm);

    const test = this.state.loading ? ('ak'):('bk');


    return(
      <div className = "bottomLine">
        <h1 hidden = {!this.state.loading}>Loading...</h1>


        <div hidden = {this.state.loading}>
          <h1>Fred {verb} Fed</h1>
          <div className="input-field col s12" hidden = {hideForm}>
            <form onSubmit = {this.handleSubmit}>
              <select className="browser-default" onChange = {this.handleChange}>
                {/*make these names reoder based on who feeds Fred the most*/}
                <option value = "empty">Who</option>
                <option value = "Matthew">Matthew</option>
                <option value = "John">John</option>
                <option value = "Sam">Sam</option>
                <option value = "Sue">Sue</option>
                <option value = "Mom">Mom</option>
                <option value = "Dad">Dad</option>
              </select>

              <button type = "submit">FED</button><span>Fred</span>
            </form>
          </div>
          <h2 hidden = {!hideForm}>{this.state.data.user} fed Fred {this.state.data.meal}</h2>

        </div>

      </div>
    )
  }
}
