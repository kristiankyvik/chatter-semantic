import React from 'react';

import Writer from "../components/Writer.jsx"

const userIdToProfile = function(chatterUsers) {
  const idToProfile = {};
  chatterUsers.forEach( (user) => {
    idToProfile[user._id] = {
      nickname: user.nickname,
      avatar: user.avatar
    };
  });
  return idToProfile;
};

const Room = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData () {
    const { roomId } = this.props;
    const messagesHandle = Meteor.subscribe("chatterMessages", {
      roomId: roomId
    });

    const subsReady = messagesHandle.ready();

    let messages = [];

    if (subsReady) {
      messages = Chatter.Message.find({"roomId": roomId}).fetch();
    }

    return {
      messages,
      subsReady
    }
  },

  componentDidMount() {
    this.scrollDown()
    Meteor.call("room.counter.reset", this.props.roomId);
  },

  componentWillUnmount() {
    Meteor.call("room.counter.reset", this.props.roomId);
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
    const roomId = this.props.roomId;
    const params = {
        message: text,
        roomId
    };

    Meteor.call("message.send", params);

    this.scrollDown();
  },

  render() {
    const getUserProfile = userIdToProfile(this.props.chatterUsers);
    const loader =  (
      <div className="ui active inverted dimmer">
        <div className="ui text loader">
          Loading messages
        </div>
      </div>
    );

    const messages = (
      this.data.messages.map((message) => {
        const userProfile = getUserProfile[message.userId];
        const messageClass = this.props.chatterUser._id === message.userId ? "chatter-msg comment yours" : "chatter-msg comment";

        return (
          <div key={message._id} className={messageClass}>
            <div className="nickname">
              {userProfile.nickname}
            </div>
            <div>
              <a className="avatar">
                <img src={userProfile.avatar} />
              </a>
              <div className="content">
                <div className="text">
                 {message.message}
                </div>
              </div>
            </div>
          </div>
        );
      })
    );

    return (
      <div>
        <div className="room scrollable ui comments basic padded" ref="scroller">
          {this.data.subsReady ? messages : loader}
        </div>
        <Writer pushMessage={this.pushMessage}/>
      </div>
    );
  }
});

export default Room;
