import React, {Component} from 'react';
import axios from 'axios';

export default class Calendar extends Component{


  state = {
    loading: true,
    day: {},
    data: []
  }

  componentDidMount(){
    //let's look into the voss way of replacing this variable below
    axios.get("http://10.0.0.134:5000/calendar")
      .then((res) => {
        var grab = [];
        try{
          for(var m = 0; m < res.data.data.length; m+=3){
            grab.push({
              start: res.data.data[m],
              end: res.data.data[m+1],
              event: res.data.data[m+2],
            })
          }
        }catch(e){
          console.log(e);
        }

        this.setState({
          day: res.data.date,
          data: grab,
          loading: false
        })
      })

  }


  render(){

    const calendarTitle = !this.state.loading ?
                          (this.state.day.wordMonth+" "+this.state.day.day+", "+this.state.day.year) :
                          ("Loading...");

      //we need to look into how we serve the data
    const tableData = this.state.data.length === 0 ?
                      (<tr>
                        <td>Your events for today</td>
                        </tr>) :
                       (this.state.data.map( (events, i) => {
                         return (
                           <tr key = {i}>
                              {/*I have to figure out how to remove the end if it is an all day event*/}
                              <td>{events.start} - {events.end}</td>
                              <td>{events.event}</td>
                           </tr>
                         )
                       }));

    return(
      <table>
        <tbody>
        <tr>
          <th colSpan = "2">{calendarTitle}</th>
        </tr>
        <tr>
          <th>Time</th>
          <th>Event</th>
        </tr>
        {tableData}
        </tbody>
      </table>
    )
  }
}
