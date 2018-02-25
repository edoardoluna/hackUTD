import React, {Component} from 'react';
import {InfoWindow, Marker} from 'google-maps-react';
import Map from 'google-maps-react'
import { withTracker } from 'meteor/react-meteor-data';
import { Events } from '../api/events.js';

class MapContainer extends Component {
  constructor(props)
  {
    super(props);
    this.state = {lat: 30.22, lng: -81.99, render : false};
    this.getLocation = this.getLocation.bind(this);
  }
  getLocation()
  {
    foo = {};
    const geolocation = navigator.geolocation;
    const location = new Promise((resolve, reject) => {
    if (!geolocation) {
      reject(new Error('Not Supported'));
    }
    geolocation.getCurrentPosition((position) => {
    resolve(position);
    }, () => {
      reject (new Error('Permission denied'));
      });
    })
    location.then((coords) => {this.setState({lat : coords.coords.latitude, lng : coords.coords.longitude, render: true})});
    //Events.update({poi : {$exists : true}}, {$set : {poi : {text}, lat: coords.coords.latitude, lng:coords.coords.longitude}});
  }

  renderMarkers() {
    //Events.insert({ lat : 15, lng : 15 });
    console.log(this.props.events);
    return this.props.events.map((event) => (
      <Marker key = {event.lat * event.lng} position = {{lat : event.lat, lng : event.lng}}/>
    ));
  }

  componentWillMount()
  {
    if(Events.find({poi:{ $exists: true, $eq : ''}}).fetch().length === 1)
    {
      this.getLocation();
    }
  }

  componentDidMount()
  {
    console.log(this.state);
  }

  componentWillReceiveProps(nextProps)
  {
    if(Events.find({poi:{ $exists: true, $ne : ''}}).fetch().length === 1) {
      var data = Events.find({poi:{ $exists: true, $ne : ''}}).fetch()[0];
      this.setState({lat : data.lat, lng: data.lng});
      console.log(this.state);
    }
  }

  render() {
    var focus = Events.find({poi:{ $exists: true}}).fetch()[0];
    console.log(focus);
    if(this.state.render)
    {
      return (
        <div className = "wrapper" id="map">
          <Map classname = "map" google = {this.props.google} initialCenter = {this.state} zoom = {13}>
          <Marker style = {{color : 'green'}} position = {{lat : focus.lat, lng: focus.lng}}/>
            {this.props.isReady ? this.renderMarkers() : null}
          </Map>
      </div>

      );
    }
    else {
      return null;
    }
  }


}

export default withTracker(() => {
  const subscription = Meteor.subscribe('events');
  return {
    isReady : subscription.ready(),
    events: subscription.ready() && Events.find({poi:{ $exists: false}}).fetch()
  };
})(MapContainer);
