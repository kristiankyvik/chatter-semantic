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

const chatterSubs = new SubsCache(-1, -1);


const ChatterApp = React.createClass({
  mixins: [ReactMeteorData],

  getInitialState: function () {
    Session.set("chatOpen", false);
    Session.set("refreshPub", 1);
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
    let roomListDataHandle = null;

    if (this.state.view === "roomList") {
      roomListDataHandle = chatterSubs.subscribe("roomListData", userId, "dfkdslk");
    }

    let subsReady = _.isNull(roomListDataHandle) ? false : roomListDataHandle.ready();
    let hasSupportRoom = false;
    let msgNotif = false;
    let allRoomIds = [];
    let allRooms = [];

    if (subsReady) {

      if (userId) {
        var tRooms = Chatter.Room.find({}, {sort: {lastActive: -1}}).fetch();
        allRooms = tRooms.map(function (room) {
          const roomId = room._id;
          const userRoom = Chatter.UserRoom.findOne({roomId});
          room.archived = userRoom.archived;
          room.unreadMsgCount = userRoom.unreadMsgCount;
          const lastMsg = Chatter.Message.findOne({roomId}, {sort: {createdAt: -1}});
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
      allRooms,
      roomListDataHandle
    };
  },

  goToRoom (roomId, roomName) {
    if (!_.isNull(this.data.roomListDataHandle)) {
      this.data.roomListDataHandle.stop();
    }
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
    if (view !== "roomList") {
      this.data.roomListDataHandle.stop();
    }
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

  render () {
    const chatHTML = getChatHTML(this);
    return (
      chatHTML
    );
  }
});

export default ChatterApp;

