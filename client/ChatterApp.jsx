import React from 'react';
import ReactDOM from 'react-dom';

import getChatHTML from "./template-helpers/getChatHTML.jsx";
import router from "./template-helpers/router.jsx";
import Widget from "./components/Widget.jsx";

import {
  CHATTER_CACHE_LIMIT,
  CHATTER_EXPIRE_IN
} from "./global-variables.js";

const latestRooms = function (limit, withIds) {
  return {
    find: {"_id": {$in: withIds}},
    options: {sort: {lastActive: -1}, limit: limit}
  };
};


const chatterSubs = new SubsManager({
  cacheLimit: CHATTER_CACHE_LIMIT,
  expireIn: CHATTER_EXPIRE_IN
});

const ChatterApp = React.createClass({
  mixins: [ReactMeteorData],

  getInitialState: function() {
    Session.set("chatOpen", false);

    return {
      chatOpen: false,
      roomId: null,
      userProfile: Meteor.userId(),
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
    const roomsHandle = chatterSubs.subscribe("chatterRooms");
    const userRoomsHandle = chatterSubs.subscribe("chatterUserRooms");
    const subsReady = roomsHandle.ready() && userRoomsHandle.ready();

    let activeRooms = [];
    let archivedRooms = [];
    let hasSupportRoom = false;

    if (subsReady) {
      const {activeRoomLimit, archivedRoomLimit} = this.state;

      if (userId) {
        const allRooms = Chatter.UserRoom.find({userId}).fetch();
        const archivedUserRooms = Chatter.UserRoom.find({userId, archived: true}).fetch();
        const activeUserRooms = Chatter.UserRoom.find({userId, archived: false}).fetch();

        const allRoomIds = _.pluck(allRooms, "roomId");

        const archivedRoomIds = _.pluck(archivedUserRooms, "roomId");

        const activeRoomIds = _.pluck(activeUserRooms, "roomId");

        const activeRoomQuery = latestRooms(activeRoomLimit, activeRoomIds);
        const archivedRoomQuery = latestRooms(archivedRoomLimit, archivedRoomIds);

        activeRooms = Chatter.Room.find(activeRoomQuery.find, activeRoomQuery.options).fetch();
        archivedRooms = Chatter.Room.find(archivedRoomQuery.find, archivedRoomQuery.options).fetch();
        hasSupportRoom = Chatter.Room.find({
            "_id": {$in: allRoomIds},
            "roomType": "support"
        }).count();
      }
    }

    return {
      activeRooms,
      archivedRooms,
      subsReady,
      hasSupportRoom
    }
  },

  goToRoom(roomId, roomName) {
    this.setState({
      roomId: roomId,
      view: 'room',
      header: roomName
    });
  },

  setUserProfile(userId) {
    this.setState({
      userProfile: userId
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
    // ATTENTION: removing for the purpose of the widget implementation which uses the global Session object instead
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

