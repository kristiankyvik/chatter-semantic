import React from 'react';

import {getAvatarSvg} from "../template-helpers/shared-helpers.jsx";

import {
  ROOM_LIST_CACHE_LIMIT,
  ROOM_LIST_EXPIRE_IN
} from "../global-variables.js";

const roomListItemSubs = new SubsManager({
  cacheLimit: ROOM_LIST_CACHE_LIMIT,
  expireIn: ROOM_LIST_EXPIRE_IN
});

const RoomListItem = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData () {
    const messagesHandle = roomListItemSubs.subscribe("chatterMessages", {
      roomId: this.props.room._id
    });

    const countHandle = roomListItemSubs.subscribe("chatterUserRooms", {
      roomId: this.props.room._id
    });

    const usersHandle = roomListItemSubs.subscribe("users");

    const subsReady = messagesHandle.ready() && countHandle.ready() && usersHandle.ready();
    const userId = Meteor.userId();

    let message = "no messages yet";
    let timeAgo = this.props.room.getTimeAgo();
    let unreadMsgCount = 0;
    let lastUser = null;

    if (subsReady) {
      const checkCount = Chatter.UserRoom.findOne({roomId: this.props.room._id, userId: userId});

      unreadMsgCount =  typeof checkCount === 'undefined' ? -1 : checkCount.unreadMsgCount;

      const lastMessage = Chatter.Message.findOne({roomId: this.props.room._id }, {sort: {createdAt: -1, limit: 1}});
      if (typeof lastMessage != 'undefined') {
        message = lastMessage.message;
        timeAgo = lastMessage.getTimeAgo();
        lastUser = Meteor.users.findOne(lastMessage.userId);
      }
    }

    return {
      message,
      timeAgo,
      unreadMsgCount,
      lastUser,
      avatar
    }
  },

  render() {
    const {
      goToRoom,
      room
    } = this.props;

    const lastUser = this.data.lastUser;
    let lastAvatar = "default";
    let statusClass = "user-status none"

    if (lastUser) {
      statusClass = lastUser.profile.online ? "user-status online" : "user-status offline";
      lastAvatar = lastUser.username;
    }

    return (
      <div
        className="item transition visible roomListItem"
        onClick={() => goToRoom(room._id, room.name)}
      >
        <div className={statusClass}></div>
        <img
          className="ui avatar image"
          src={`data:image/png;base64,${getAvatarSvg(lastAvatar)}`}
        />

        <div className="content">
          <div className="header">
            <div className="roomName">
              {room.name}
              <span className="unread">
                { this.data.unreadMsgCount > 0 ? <span> ({this.data.unreadMsgCount}) </span> : "" }
              </span>
            </div>
            <div className="meta">
              {this.data.timeAgo}
            </div>
          </div>
          <div className="description">
            <div className="preview">
              {this.data.message}
            </div>
            <div className="counter">
                { this.data.unreadMsgCount > 0 ? <span> {this.data.unreadMsgCount} </span> : "" }
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export default RoomListItem;
