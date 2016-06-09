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
    Session.set("chatOpen", false);

    return {
      chatOpen: false,
      roomId: null,
      header: "Chatter",
      view: "roomList",
      activeRooms: [],
      archivedRooms: [],
      activeRoomLimit: Chatter.options.initialRoomLoad,
      archivedRoomLimit: Chatter.options.initialRoomLoad
    };
   },

  getMeteorData () {
    const userId = Meteor.userId();
    const roomsHandle = Meteor.subscribe("chatterRooms");
    const userRoomsHandle = Meteor.subscribe("chatterUserRooms");
    const subsReady = roomsHandle.ready() && userRoomsHandle.ready();

    let activeRooms = [];
    let archivedRooms = [];

    if (subsReady) {
      const {activeRoomLimit, archivedRoomLimit} = this.state;

      if (userId) {
        const userRooms = Chatter.UserRoom.find({userId}).fetch();
        const roomIds = _.pluck(userRooms, "roomId");
        const activeRoomQuery = latestRooms(activeRoomLimit, roomIds, false);
        const archivedRoomQuery = latestRooms(archivedRoomLimit, roomIds, true);

        activeRooms = Chatter.Room.find(activeRoomQuery.find, activeRoomQuery.options).fetch();
        archivedRooms = Chatter.Room.find(archivedRoomQuery.find, archivedRoomQuery.options).fetch();
      }
    }

    return {
      activeRooms,
      archivedRooms,
      subsReady
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
    // removing for the purpose of the widget implementation
    // console.log(chatterDispatcher);
    // const state = !this.state.chatOpen;
    // this.setState({
    //   chatOpen: state
    // });
  },

  render() {
    const chatHTML = getChatHTML(this);
    return (
      chatHTML
    )
  }
});

export default ChatterApp;

