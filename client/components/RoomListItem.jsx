import React from 'react';

const RoomListItem = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData () {
    const messagesHandle = Meteor.subscribe("chatterMessages", {
      roomId: this.props.room._id,
      messageLimit: 30
    });

    const usersHandle = Meteor.subscribe("chatterUsers", {
      roomId: this.props.room._id
    });

    const countHandle = Meteor.subscribe("chatterUserRooms", {
      roomId: this.props.room._id
    });

    const subsReady = messagesHandle.ready() && usersHandle.ready() && countHandle.ready();

    let message = "no messages yet",
        avatar = "http://localhost:3000/packages/jorgeer_chatter-semantic/public/images/default.jpg",
        timeAgo = "",
        count = 0;

    if (subsReady) {
      const checkCount = Chatter.UserRoom.findOne({roomId: this.props.room._id, userId: Meteor.userId() });
      count =  typeof checkCount === 'undefined' ? "0" : checkCount.count;

      const lastMessage = Chatter.Message.findOne({roomId: this.props.room._id }, {sort: {createdAt: -1, limit: 1}});
      if (typeof lastMessage != 'undefined') {
        message = lastMessage.message;
        timeAgo = lastMessage.timeAgo();
        avatar = lastMessage.userAvatar;
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
    return (
      <div className="item transition visible" onClick={() => this.props.goToRoom(this.props.room._id, this.props.room.name)}>
        <img className="ui avatar image" src={this.data.avatar} />
        <div className="content">
          <div className="header">
            <span>{this.props.room.name}</span> (<span>{this.data.count}</span>)
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
