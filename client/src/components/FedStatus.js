import React, {Component} from 'react';
import axios from 'axios';

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

    axios.post('http://localhost:5000/fedStatus', {
      user: this.state.person
    })
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

    if(e.target.value != "empty"){
      this.setState({
        person: e.target.value
      })
    }else{
      alert("you need to pick a person");
    }

  }

  render(){

    console.log(this.state);

    //i need 2 variables, one to see if

    const show = this.state.loading ? (true) : (false);

    //this will need to be changed, because it doesn't account for laziness
    const verb = this.state.data.meal === this.state.waitingFor ? ("is") : ("needs to be");
    const allowPost = verb === "needs to be" ? (true) : (false);

    return(
      <div>
        <h1 hidden = {!show}>Loading...</h1>
        <div hidden = {show}>
          <h1>Fred {verb} Fed</h1>
          <div hidden = {!allowPost}>
            <form onSubmit = {this.handleSubmit}>
              <select onChange = {this.handleChange}>
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
