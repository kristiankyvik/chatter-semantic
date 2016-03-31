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

    const subsReady = messagesHandle.ready() && usersHandle.ready();

    let message = "";
    let avatar = null;
    let timeAgo = "";

    if (subsReady) {
      const lastMessage = Chatter.Message.findOne({roomId: this.props.room._id }, {sort: {createdAt: -1, limit: 1}});
      const roomEmpty = typeof lastMessage === 'undefined';
      message = roomEmpty ?  "no messages yet" : lastMessage.message;
      timeAgo = roomEmpty ? "" : lastMessage.timeAgo();
      avatar = roomEmpty ?  "http://localhost:3000/packages/jorgeer_chatter-semantic/public/images/default.jpg" : lastMessage.userAvatar;
    }

    return {
      message,
      avatar,
      timeAgo
    }
  },

  render() {
    return (
      <div className="item transition visible" onClick={() => this.props.goToRoom(this.props.room._id, this.props.room.name)}>
        <img className="ui avatar image" src={this.data.avatar} />
        <div className="content">
          <div className="header">
            <span>{this.props.room.name}</span> (<span>{this.props.getUserCount(this.props.room._id)}</span>)
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
