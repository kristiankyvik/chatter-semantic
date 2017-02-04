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
    console.log("skjflksdjfkldsjfklsdjflkdsjflksdjflks");
    const userId = Meteor.userId();
    const usersHandle = Meteor.subscribe("users", this.props.params.roomId);
    const userRoomsHandle = Meteor.subscribe("chatterUserRooms");
    const roomsHandle = Meteor.subscribe("chatterRooms");
    const subsReady = roomsHandle.ready() && usersHandle.ready() && userRoomsHandle.ready();
    let room = {};
    let users = [];

    if (subsReady) {
      room = Chatter.Room.findOne(this.props.params.roomId);
      const ur = Chatter.UserRoom.findOne({roomId: this.props.params.roomId, userId});
      room.archived = ur ? ur.archived : false;
      const userRooms = Chatter.UserRoom.find({roomId: this.props.params.roomId}).fetch();
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
    const children = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        room: this.data.room,
        users: this.data.users,
        subsReady: this.data.subsReady,
        buttonMessage: "Back to Settings",
        buttonGoTo: `/room/${this.props.params.roomId}/settings`
      });
    });
    return (
      <div className="wrapper">
        {children}
      </div>
    );
  }
});

export default Settings;
