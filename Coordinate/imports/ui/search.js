import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { withTracker } from 'meteor/react-meteor-data';
import { Events } from '../api/events.js';

export class Search extends Component{
  constructor(props){
    super(props);
    this.state = {text: '', stuff: []};
    this.send = this.send.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getDistanceFromLatLonInMi = this.getDistanceFromLatLonInMi.bind(this);
    this.deg2rad = this.deg2rad.bind(this);
  }
  handleChange(e){
    var val = e.target.value;
    this.setState({text: val});
  }
  send(e){
    e.preventDefault();
    let text = this.state.text;

    let searched = Events.find({address : text}).fetch();
    //this.setState({text: {text}, stuff: {searched}});
    console.log(typeof text);
    var geocoder = new google.maps.Geocoder();
    const promise = new Promise((resolve, reject) => {
      geocoder.geocode({'address' : text}, (res, status) => {
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
        var bar = Events.find({poi : { $exists: true}}).fetch()[0]._id;
        console.log(Events.find({poi : { $exists: true}}).fetch());
        console.log(Events.find({poi : { $exists: true}}).fetch()[0]._id);
        Meteor.call('events.updateCenter', bar, text, coords[0], coords[1]);
        Events.find(
          {poi:{ $exists : false}}
        ).fetch().forEach((obj) => {
          var dist = this.getDistanceFromLatLonInMi(coords[0], coords[1], obj.lat, obj.lng);
          var id = obj._id;
          Meteor.call('events.update', id, dist);
          console.log(obj.dist);
        });

      });
      this.setState();
    }

    getDistanceFromLatLonInMi(lat1,lon1,lat2,lon2) {
      var R = 3959; // Radius of the earth in km
      var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
      var dLon = this.deg2rad(lon2-lon1);
      var a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ;
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c; // Distance in km
      return d;
    }

    deg2rad(deg) {
      return deg * (Math.PI/180)
    }

    render(){
      return(
        <section id="find">
          <form id="sForm">
            <input type="text" id="itemSearch" placeholder="Search" name="search" onChange={this.handleChange}/>
            <button id="seButton" onClick={this.send}>SEND</button>
          </form>
          <Terms stuff={this.state.stuff}/>
        </section>
      )};
    }

    class Terms extends Component{
      render(){
        let searched = Events.find({dist : {$lte : 20}}).fetch();
        let list = [];
        console.log(searched);
        //console.log(list);
        for (let x in searched)
        {
          console.log(searched[x]);
          if (searched[x].dist <= 20)
          {
            console.log(searched[x].dist);
            list.push(<Boxes key={searched[x]._id} text={searched[x]}/>);

          }
        }
        return(
          <div id="listItems">{list}</div>
        );
      }
    }

    class Boxes extends Component{
      constructor(props){
        super(props);
        this.state = {selected: true};
        this.onHover = this.onHover.bind(this);
        this.onHoverOut = this.onHoverOut.bind(this);
        this.onClick = this.onClick.bind(this);
      }
      onHover(){
        //this.setState({style: {background: 'blue'}});
      }
      onHoverOut(){
        //this.setState({style: {background: 'red'}});
      }
      onClick(){
        if(this.state.selected)
        {
          this.setState({selected: false});
        }
        else{
          this.setState({selected: true});
        }
      }
      render(){
        let text = this.props.text;
        if (this.dist > 20)
        {
          return null;
        }
        else {
          return(
            <div onMouseOver={this.onHover} onMouseOut={this.onHoverOut} onClick={this.onClick} style={this.state.style}>
              <section id="inItem">
                <article id="inItemH"><div style={{fontSize: '1.5rem'}}>{text.title}</div>&emsp;&emsp;<div style={{fontSize: '1rem', marginTop: '0.3rem'}}></div></article>
                {this.name}
                <div style={{overflow: 'hidden', width: '100%', height: '1.25rem'}}>{text.address}, {text.city}, {text.state} {text.zip}</div>
              </section>
              <i id="icon"><i className="fas fa-baseball-ball"></i>
              <div id="rTool">This is a baseball game.</div>
              </i>
            </div>);
        }

        }

      }

      export default withTracker(() => {
        const subscription = Meteor.subscribe('events');
        return {
          isReady : subscription.ready(),
          events: subscription.ready() && Events.find({}).fetch()
        };
      })(Search);
