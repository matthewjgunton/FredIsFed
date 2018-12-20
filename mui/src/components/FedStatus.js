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
    console.log("reached");

    if(this.state.person == ""){
      alert("pick someone");
      return;
    }

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

    //we need to figure out:
    //has he been fed already?

    //we know
    //breakfast:
    //date last fed would not be today
    //hours of the day need to be less than 12

    //dinner:
    //hours of the day need to be greater than 12
    //if date is equal to today, then last meal must have been breakfast

    //let's base it on the waitingFor variable

    const whole = new Date();
    const hour = whole.getHours();

    //we need to find out when the date line is
    console.log(this.state.data.date);

    if(waitingFor == "breakfast"){
      //need to find a way to check if dates are equal given only the miliseconds
      // if(hour > 12)
    }
    if(waitingFor == "dinner"){

    }else{
      alert("issue with server");
    }


    return(
      <div>
        <h1 hidden = {!show}>Loading...</h1>


        <div hidden = {show}>
          <h1>Fred {verb} Fed</h1>
          <div className="input-field col s12" hidden = {!allowPost}>
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
          <h2 hidden = {allowPost}>{this.state.data.user} fed Fred {this.state.data.meal}</h2>

        </div>

      </div>
    )
  }
}
