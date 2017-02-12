import React from 'react';
import ReactDOM from 'react-dom';

import RoomList from "../components/RoomList.jsx";

const chatterSubs = new SubsCache(-1, -1);

const RoomListParent = React.createClass({
  mixins: [ReactMeteorData],

  getInitialState: function () {
    return {
      view: "roomList",
      makingRequest: false,
      roomLimit: 3
    };
  },

  getMeteorData () {
    const userId = Meteor.userId();
    let roomListDataHandle = null;

    roomListDataHandle = chatterSubs.subscribe("roomListData", {userId, roomLimit: this.state.roomLimit});

    let subsReady = _.isNull(roomListDataHandle) ? false : roomListDataHandle.ready();
    let hasSupportRoom = false;
    let allRoomIds = [];
    let allRooms = [];
    let roomCount = 3;

    if (subsReady) {
      if (userId) {
        var tRooms = Chatter.Room.find({}, {sort: {lastActive: -1}, limit: this.state.roomLimit}).fetch();
        allRooms = _.map(tRooms, function (room) {
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

        hasSupportRoom = Chatter.Room.find({
          "_id": {$in: allRoomIds},
          "roomType": "support"
        }).count();
      }
    }
    return {
      subsReady,
      hasSupportRoom,
      allRoomIds,
      allRooms,
      roomListDataHandle,
      roomCount
    };
  },

  loadMoreRooms () {
    const roomLimitState = {
      roomLimit: this.state.roomLimit + 5
    };
    this.setState(roomLimitState);
  },

  componentWillMount () {
    if (this.props.headerText !== Chatter.options.chatName) {
      this.props.updateHeader(Chatter.options.chatName);
    }
  },

  componentWillUnmount () {
    this.data.roomListDataHandle.stop();
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
    return (
      <RoomList
        subsReady={this.data.subsReady}
        hasSupportRoom={this.data.hasSupportRoom}
        allRoomIds={this.data.allRoomIds}
        allRooms={this.data.allRooms}
        roomListDataHandle={this.data.roomListDataHandle}
        roomCount={this.data.roomCount}
        router={this.props.router}
        loadMoreRooms={this.loadMoreRooms}
        setInitialLoad={this.props.setInitialLoad}
        initialLoad={this.props.initialLoad}
        user={this.props.user}
      />
    );
  }
});

export default RoomListParent;

