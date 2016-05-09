import React from 'react';
import ReactDOM from 'react-dom';

import getChatHTML from "./template-helpers/getChatHTML.jsx";
import router from "./template-helpers/router.jsx";
import Widget from "./components/Widget.jsx";


const ChatterApp = React.createClass({
  mixins: [ReactMeteorData],

  getInitialState: function() {
    return {
      chatOpen: true,
      roomId: null,
      header: "Chatter",
      view: "roomList",
      activeRooms: [],
      archivedRooms: []
    };
   },

  getMeteorData () {
    const chatterUsersHandle = Meteor.subscribe("chatterUsers");
    const roomsHandle = Meteor.subscribe("chatterRooms");
    const userRoomsHandle = Meteor.subscribe("chatterUserRooms");
    const subsReady = roomsHandle.ready() && userRoomsHandle.ready() && chatterUsersHandle.ready();

    let activeRooms = [];
    let archivedRooms = [];
    let chatterUsers = [];
    let chatterUser = null;

    if (subsReady) {
      const meteorUserId = Meteor.userId();
      if (meteorUserId != undefined) {
        chatterUser = Chatter.User.findOne({userId: meteorUserId});
        chatterUsers = Chatter.User.find({}, {sort: {nickname: 1}}).fetch();
        if (chatterUsers.length > 0) {
          const userRooms = Chatter.UserRoom.find({"userId": chatterUser._id}).fetch();
          const roomIds = _.pluck(userRooms, "roomId");
          activeRooms = Chatter.Room.find({"_id": {$in:roomIds}, "archived": false}, {sort: {lastActive: -1}}).fetch();
          archivedRooms = Chatter.Room.find({"_id": {$in:roomIds}, "archived": true}).fetch();
        }
      }
    }

    return {
      activeRooms,
      archivedRooms,
      subsReady,
      chatterUsers,
      chatterUser
    }
  },

  goToRoom(roomId, roomName) {
    this.setState({
      roomId: roomId,
      view: 'room',
      header: roomName
    });
  },

  setView(view) {
    this.setState(router(this, view));
  },

  toggleChatState() {
    this.setState({
      chatOpen: !this.state.chatOpen
    });
  },

  render() {
    let chatHTML = this.state.chatOpen ? getChatHTML(this) : <Widget toggleChatState={this.toggleChatState} />;
    return (
      chatHTML
    )
  }
});

export default ChatterApp;

