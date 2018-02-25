import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor'
import {check} from 'meteor/check'

export const Events = new Mongo.Collection('events');

if(Events.find({poi:{ $exists: true}}).fetch().length === 0) {
   Events.insert({poi : '', lat : 0, lng : 0});
}
Meteor.methods({
  'events.insert'(event) {
    Events.insert(event);
  },
  'events.updateCenter'(id, inputPoi, inputLat, inputLgn) {
    Events.update(id, {$set : {poi : inputPoi, lat : inputLat, lng : inputLgn}});
  },
  'events.update'(id, newDist) {
    Events.update(id, {$set : {dist : newDist}});
  }
});

if(Meteor.isServer) {
  Meteor.publish('events', () =>
  {
      return Events.find({});
  });
}
