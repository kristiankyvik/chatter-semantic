import React from 'react';
import ReactDOM from 'react-dom';

import RoomList from "../components/RoomList.jsx";

const chatterSubs = new SubsCache(5, 60);

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

    if (subsReady) {
      if (userId) {
        var tRooms = Chatter.Room.find({}, {sort: {lastActive: -1}, limit: this.state.roomLimit}).fetch();
        allRooms = _.map(tRooms, function (room) {
          const roomId = room._id;
          const userRoom = Chatter.UserRoom.find({userId, roomId}, {limit: 1}).fetch()[0];
          if (_.isEmpty(userRoom)) {
            return;
          }
          room.archived = userRoom.archived;
          room.unreadMsgCount = userRoom.unreadMsgCount;
          room.lastMsgUser = !_.isEmpty(room.lastMessageOwner) ? Meteor.users.findOne(room.lastMessageOwner) : null;
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
      roomListDataHandle
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
        router={this.props.router}
        loadMoreRooms={this.loadMoreRooms}
        user={this.props.user}
      />
    );
  }
});

export default RoomListParent;

