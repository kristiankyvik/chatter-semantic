import React from 'react';
import ReactDOM from 'react-dom';

import getChatHTML from "./template-helpers/getChatHTML.jsx";
import router from "./template-helpers/router.jsx";

import {
  CHATTER_CACHE_LIMIT,
  CHATTER_EXPIRE_IN
} from "./global-variables.js";

const latestRooms = function (limit, withIds) {
  return {
    find: {"_id": {$in: withIds}},
    options: {sort: {lastActive: -1}, limit: limit}};
};

const chatterSubs = new SubsManager({
  cacheLimit: CHATTER_CACHE_LIMIT,
  expireIn: CHATTER_EXPIRE_IN
});

const ChatterApp = React.createClass({
  mixins: [ReactMeteorData],

  getInitialState: function () {
    Session.set("chatOpen", false);
    Session.setDefault('messageLimit', Chatter.options.messageLimit);

    return {
      chatOpen: false,
      roomId: null,
      userProfile: Meteor.userId(),
      header: Chatter.options.chatName,
      view: "roomList",
      msgNotif: 0,
      activeRooms: [],
      archivedRooms: [],
      activeRoomLimit: Chatter.options.initialRoomLoad,
      archivedRoomLimit: Chatter.options.initialRoomLoad
    };
  },

  getMeteorData () {
    const userId = Meteor.userId();
    let roomsHandle = null;

    const roomDataHandle = chatterSubs.subscribe("roomData", userId);
    const subsReady = roomDataHandle.ready();

    let hasSupportRoom = false;
    let msgNotif = false;
    let allRoomIds = [];
    let allRooms = [];

    if (subsReady) {

      if (userId) {
        var tRooms = Chatter.Room.find().fetch();
        allRooms = tRooms.map(function (room) {
          const roomId = room._id;
          const userRoom = Chatter.UserRoom.findOne({roomId});
          room.archived = userRoom.archived;
          room.unreadMsgCount = userRoom.unreadMsgCount;
          const lastMsg = Chatter.Message.findOne({roomId});
          const hasLastMessage = !_.isUndefined(lastMsg);
          room.lastMsgTxt = hasLastMessage ? lastMsg.message : "no messages yet";
          room.lastMsgTimeAgo = hasLastMessage ? lastMsg.getTimeAgo() : null;
          room.lastMsgUser = hasLastMessage ? Meteor.users.findOne(lastMsg.userId) : null;
          return room;
        });

        const allUserRooms = Chatter.UserRoom.find({userId}).fetch();
        allRoomIds = _.pluck(allUserRooms, "roomId");

        msgNotif = Chatter.UserRoom.find({userId: userId, unreadMsgCount: { $gt: 0 }}).fetch().length;

        hasSupportRoom = Chatter.Room.find({
          "_id": {$in: allRoomIds},
          "roomType": "support"
        }).count();
      }
    }

    return {
      subsReady,
      hasSupportRoom,
      msgNotif,
      allRoomIds,
      allRooms
    };
  },

  goToRoom (roomId, roomName) {
    this.setState({
      roomId: roomId,
      view: 'room',
      header: roomName
    });
  },

  setUserProfile (userId) {
    this.setState({
      userProfile: userId
    });
  },

  loadMoreRooms (type) {
    const loadOptions = {
      active: {activeRoomLimit: 100},
      archived: {archivedRoomLimit: 100}
    };
    this.setState(loadOptions[type]);
  },

  setView (view) {
    this.setState(router(this, view));
  },

  checkIfCurrentRoomExists () {
    if (!_.isNull(this.state.roomId)) {
      if (this.data.allRoomIds.indexOf(this.state.roomId) < 0) {
        this.setState({
          roomId: null
        });
      }
    }
  },

  toggleChatState () {
    // ATTENTION: removing for the purpose of the widget implementation which uses the global Session object instead
    // const state = !this.state.chatOpen;
    // this.setState({
    //   chatOpen: state
    // });
  },

  render () {
    const chatHTML = getChatHTML(this);
    this.checkIfCurrentRoomExists();

    return (
      chatHTML
    );
  }
});

export default ChatterApp;

