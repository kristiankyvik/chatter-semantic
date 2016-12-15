import React from 'react';

import AddUsers from "./AddUsers.jsx";
import MainSettings from "./MainSettings.jsx";

import settingsRouter from "../template-helpers/settingsRouter.jsx";

const Settings = React.createClass({
  mixins: [ReactMeteorData],


  getInitialState: function () {
    return {
      view: "main"
    };
  },

  getMeteorData () {
    const userId = Meteor.userId();
    const usersHandle = Meteor.subscribe("users", this.props.roomId);
    const userRoomsHandle = Meteor.subscribe("chatterUserRooms");
    const roomsHandle = Meteor.subscribe("chatterRooms");
    const subsReady = roomsHandle.ready() && usersHandle.ready() && userRoomsHandle.ready();
    let room = {};
    let users = [];

    if (subsReady) {
      room = Chatter.Room.findOne(this.props.roomId);
      const ur = Chatter.UserRoom.findOne({roomId: this.props.roomId, userId});
      room.archived = ur ? ur.archived : false;
      const userRooms = Chatter.UserRoom.find({roomId: this.props.roomId}).fetch();
      const userIds = _.pluck(userRooms, "userId");
      users = Meteor.users.find({"_id": {$in: userIds}}).fetch();
    }

    return {
      subsReady,
      room,
      users
    };
  },

  componentDidMount () {
    $(".ui.accordion").accordion();
  },

  setSettingsView (view) {
    this.setState(settingsRouter(this, view));
  },

  setView (view) {
    this.props.setView(view);
  },

  render () {
    return settingsRouter(this, this.state.view).component();
  }
});

export default Settings;
