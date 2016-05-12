import React from 'react';

const RoomListItem = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData () {
    const messagesHandle = Meteor.subscribe("chatterMessages", {
      roomId: this.props.room._id
    });

    const countHandle = Meteor.subscribe("chatterUserRooms", {
      roomId: this.props.room._id
    });

    const subsReady = messagesHandle.ready() && countHandle.ready();

    let message = "no messages yet";
    let avatar = "http://localhost:3000/packages/jorgeer_chatter-semantic/public/images/default.jpg";
    let timeAgo = "";
    let unreadMsgCount = 0;

    if (subsReady) {
      const checkCount = Chatter.UserRoom.findOne({roomId: this.props.room._id, userId: this.props.chatterUser._id});

      unreadMsgCount =  typeof checkCount === 'undefined' ? -1 : checkCount.unreadMsgCount;

      const lastMessage = Chatter.Message.findOne({roomId: this.props.room._id }, {sort: {createdAt: -1, limit: 1}});
      if (typeof lastMessage != 'undefined') {
        message = lastMessage.message;
        timeAgo = lastMessage.timeAgo();
        avatar = "http://localhost:3000/packages/jorgeer_chatter-semantic/public/images/avatar.jpg";
      }
    }

    return {
      message,
      avatar,
      timeAgo,
      unreadMsgCount
    }
  },

  render() {
    const {
      goToRoom,
      room
    } = this.props;

    return (
      <div
        className="item transition visible roomListItem"
        onClick={() => goToRoom(room._id, room.name)}
      >
        <img className="ui avatar image" src={this.data.avatar} />
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
            {this.data.message}
          </div>
        </div>
      </div>
    );
  }
});

export default RoomListItem;
