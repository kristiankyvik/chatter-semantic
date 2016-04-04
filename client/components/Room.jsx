import React from 'react';

import Writer from "../components/Writer.jsx"

const Room = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData () {
    const messagesHandle = Meteor.subscribe("chatterMessages", {
      roomId: this.props.roomId,
      messageLimit: 30
    });

    const usersHandle = Meteor.subscribe("users", {
      roomId: this.props.roomId
    });

    const subsReady = messagesHandle.ready() && usersHandle.ready();

    let messages = [];
    let users = [];


    if (subsReady) {
      messages = Chatter.Message.find({"roomId": this.props.roomId}).fetch();
      users = Meteor.users.find({"roomId": this.props.roomId }).fetch();
    }

    return {
      messages,
      users,
      subsReady
    }
  },

  componentDidMount() {
    this.scrollDown()
    Meteor.call("userroom.count.reset", this.props.chatterUser._id, this.props.roomId);
  },

  componentWillUnmount() {
    Meteor.call("userroom.count.reset", this.props.chatterUser._id, this.props.roomId);
  },

  componentWillUpdate() {
    const scroller = this.refs.scroller;
    this.shouldScroll = scroller.scrollTop + scroller.offsetHeight === scroller.scrollHeight;
  },

  componentDidUpdate() {
    if (this.shouldScroll) {
      this.scrollDown();
    }
  },

  scrollDown() {
    const scroller = this.refs.scroller;
    scroller.scrollTop = scroller.scrollHeight;
  },

  pushMessage(text) {
    const user = Meteor.user();
    const roomId = this.props.roomId;
    const params = {
        message: text,
        roomId: roomId,
        userId: this.props.chatterUser._id
    };

    Meteor.call("message.build", params, function(error, result) {
      Meteor.call("room.update", roomId);
      Meteor.call("userroom.count.increase", params.userId, params.roomId);
    });

    this.scrollDown();
  },

  render() {
    const loader =  (
      <div className="ui active inverted dimmer">
        <div className="ui text loader">
          Loading messages
        </div>
      </div>
    );

    const messages = (
      this.data.messages.map((message) => {
        return (
          <div key={message._id} className={ this.props.chatterUser._id === message.userId ? "comment yours" : "comment"}>
            <a className="avatar">
              <img src={ message.userAvatar } />
            </a>
            <div className="content">
              <a className="author">{message.userNick}</a>
              <a className="metadata">
                <span className="date"> {message.timeAgo()} </span>
              </a>
              <div className="text">
               {message.message}
              </div>
            </div>
          </div>
        );
      })
    );

    return (
      <div className="wrapper">
        <div className="room ui comments basic padded" ref="scroller">
          {this.data.subsReady ? messages : loader}
        </div>
        <Writer pushMessage={this.pushMessage}/>
      </div>
    );
  }
});

export default Room;



