import React from 'react';
import ReactDOM from 'react-dom';

import getChatHTML from "./template-helpers/getChatHTML.jsx";
import router from "./template-helpers/router.jsx";
import Widget from "./components/Widget.jsx";

const latestRooms = function (limit, withIds, archived) {
  return {
    find: {"_id": {$in: withIds}, "archived": archived},
    options: {sort: {lastActive: -1}, limit: limit}
  };
};



const ChatterApp = React.createClass({
  mixins: [ReactMeteorData],

  getInitialState: function() {
    return {
      chatOpen: false,
      roomId: null,
      header: "Chatter",
      view: "roomList",
      activeRooms: [],
      archivedRooms: [],
      activeRoomLimit: Chatter.options.initialRoomLoad, //eventually handle in session?
      archivedRoomLimit: Chatter.options.initialRoomLoad //eventually handle in session?
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
      const {activeRoomLimit, archivedRoomLimit} = this.state;
      if (meteorUserId != undefined) {

        chatterUser = Chatter.User.findOne({userId: meteorUserId});
        chatterUsers = Chatter.User.find({}, {sort: {nickname: 1}}).fetch();
        if (chatterUsers.length > 0) {
          const userRooms = Chatter.UserRoom.find({"userId": chatterUser._id}).fetch();
          const roomIds = _.pluck(userRooms, "roomId");
          const activeRoomQuery = latestRooms(activeRoomLimit, roomIds, false);
          const archivedRoomQuery = latestRooms(archivedRoomLimit, roomIds, true);

          activeRooms = Chatter.Room.find(activeRoomQuery.find, activeRoomQuery.options).fetch();
          archivedRooms = Chatter.Room.find(archivedRoomQuery.find, archivedRoomQuery.options).fetch();
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

  loadMoreRooms(type) {
    const loadOptions = {
      active: {activeRoomLimit: 100},
      archived: {archivedRoomLimit: 100}
    };
    this.setState(loadOptions[type]);
  },

  setView(view) {
    this.setState(router(this, view));
  },

  toggleChatState() {
    const state = !this.state.chatOpen;
    this.setState({
      chatOpen: state
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

