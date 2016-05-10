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
    let count = 0;

    if (subsReady) {
      const checkCount = Chatter.UserRoom.findOne({roomId: this.props.room._id, userId: this.props.chatterUser._id});

      count =  typeof checkCount === 'undefined' ? -1 : checkCount.count;

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
      count
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
            <span>
              {room.name}
            </span>
            <span>
              { this.data.count >= 0 ? <span> ({this.data.count}) </span> : "" }
            </span>
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
