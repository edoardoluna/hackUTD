import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { withTracker } from 'meteor/react-meteor-data';
import { Events } from '../api/events.js';
import { Meteor } from 'meteor/meteor';
var request = require("request");

export class Create extends Component{
  constructor(props){
    super(props);
    this.state = {send: false, name: '', title: '', add: '', cate: '', city: '', zip: 0, state: '', lat: 0, lng: 0, desc: ''};
    this.send = this.send.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }
  handleChange(e){
    var type = e.target.name;
    var val = e.target.value;
    if (type == 'name'){
      this.setState({name: val});
    }
    else if (type == 'title'){
      this.setState({title: val});
    }
    else if (type == 'add'){
      this.setState({add: val});
    }
    else if (type == 'cate'){
      this.setState({cate: val});
    }
    else if (type == 'city'){
      this.setState({city: val});
    }
    else if (type == 'state'){
      this.setState({state: val});
    }
    else if (type == 'zip'){
      this.setState({zip: val});
    }
    else if (type == 'desc'){
      this.setState({desc: val});
    }
  }
  handleSelect(e){
    e.preventDefault();
    console.log(this.state);

    this.props.select(true);
  }

  send(){
    console.log(this.state);
    this.setState({send: true});

    var geocoder = new google.maps.Geocoder();
    const promise = new Promise((resolve, reject) => {
      geocoder.geocode({'address' : this.state.add}, (res, status) => {
      if (status == 'OK') {
        console.log(res);
        //console.log(res[0].geometry.location.lat());
        var foo = [0,0];
        foo[0] = res[0].geometry.location.lat();
        foo[1] = res[0].geometry.location.lng();
        resolve(foo);
        console.log(foo);
      }
      else {
        reject("error")
        console.log(status);
      }
    })}, () => {reject("error")});

    promise.then((coords) =>{

    var foo = {
      name: this.state.name,
      title: this.state.title,
      address: this.state.add,
      city : this.state.city,
      state : this.state.state,
      zip : this.state.zip,
      category: this.state.cate,
      description: this.state.desc,
      dist: 0,
      lat: coords[0],
      lng: coords[1],
     };
    Meteor.call('events.insert', foo);}
    );
    //SEND INFO
    this.setState = {send: false, name: '', title: '', add: '', cate: '', city: '', zip: 0, state: ''};
    this.props.change('none');
  }
  render(){
    console.log(this.props);
    if (this.state.send){
      return null;
    }
    else{
      return(
        <section id="create">
          <form id="itemText">
            <input type='text' placeholder="Name" name='name' id="itemInput" onChange={this.handleChange}/>
            <input type='text' placeholder="Title" name='title' id="itemInput" onChange={this.handleChange}/>
            <input type="text" placeholder="Address" name='add' id="itemInput" onChange={this.handleChange}/>
            <input type="text" placeholder="City" name='city' id="itemInput" onChange={this.handleChange}/>
            <input type="text" placeholder="State" name='state' id="itemInput" onChange={this.handleChange}/>
            <input type="number" placeholder="Zip" name='zip' id="itemInput" min={0} max={99999} onChange={this.handleChange}/>
            <textarea placeholder="Description" id="itemInput" className="itemTextArea" rows="1" cols="22" onChange={this.handleChange}/>
            <select name='cate' id="itemInput" onClick={this.handleSelect}>
              <option value={this.props.category}>{this.props.category}</option>
            </select>
            <button id="itemInput" style={{backgroundColor: '#fff'}} onClick={this.send}>CREATE</button>
          </form>
        </section>
      )
    }

  }
}

export default withTracker(() => {
  const subscription = Meteor.subscribe('events');
  return {
    isReady : subscription.ready(),
    events: subscription.ready() && Events.find({}).fetch()
  };
})(Create);
