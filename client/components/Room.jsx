import React from 'react';

import Writer from "../components/Writer.jsx"
import Loader from "../components/Loader.jsx"


const isFirstMessage = function(prevMsg, currentMsg) {
  return prevMsg.userId != currentMsg.userId;
};

const timeSinceLastMsgGreaterThan = function(minutes, prevMsg, currentMsg) {
  const difference = currentMsg.createdAt - prevMsg.createdAt;
  const resultInMinutes = Math.round(difference / 60000);
  return resultInMinutes > minutes;
};

const timestampShouldBeDisplayed = function(currentMsg, nextMsg) {
  const veryRecentMessage = currentMsg.getMinutesAgo() <= 60;
  const recentMessage = currentMsg.getMinutesAgo() <= 1440;
  return veryRecentMessage && timeSinceLastMsgGreaterThan(2, currentMsg, nextMsg) || recentMessage && timeSinceLastMsgGreaterThan(60, currentMsg, nextMsg);
}

const Room = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData () {
    const { roomId } = this.props;
    const messagesHandle = Meteor.subscribe("chatterMessages", {
      roomId: roomId
    });

    const usersHandle = Meteor.subscribe("users");

    const subsReady = messagesHandle.ready() && usersHandle.ready();

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

  setUserProfile(userId) {
    this.props.setUserProfile(userId);
    this.props.setView("profile");
  },


  render() {
    const loader =  (
      <Loader/>
    );

    const numberOfMessages = this.data.messages.length;

    const messages = (
      this.data.messages.map((message, index) => {

        let dateBanner = timeAgo = avatar = nickname = null;
        const prevMsg = this.data.messages[index - 1];
        const nextMsg = this.data.messages[index + 1];

        const user = Meteor.users.findOne(message.userId);

        const isFirstMessageOfChat = index === 0,
              isFirstMessageOfDay = index > 0 && prevMsg.getDate() != message.getDate(),
              isLastMessageChat = index === numberOfMessages - 1;

        // takes care of the display of dates and timestamps
        if (isFirstMessageOfChat || isFirstMessageOfDay) {
          dateBanner = (
            <div className="date-banner">
              <span> {message.getDate()} </span>
            </div>
          );
        } else if (isLastMessageChat) {
          if (message.getMinutesAgo() > 1) {
            timeAgo = (
              <div className="time-ago">
                <span> {message.getTimeAgo()} </span>
              </div>
            );
          }
        } else if (timestampShouldBeDisplayed(message, nextMsg)) {
          timeAgo = (
            <div className="time-ago">
              <span> {message.getTimeAgo()} </span>
            </div>
          );
        } else {

        }
        // takes care of the display of avatars and nicknames
        if (index === 0 ) {
          avatar = user.profile.chatterAvatar;
          nickname = user.profile.chatterNickname;
        } else {
          if (isFirstMessage(this.data.messages[index - 1], message)) {
            avatar = user.profile.chatterAvatar;
            nickname = user.profile.chatterNickname;
          }
        }

        const ownsMessage = Meteor.userId() === message.userId;
        const messageClass = ownsMessage ? "chatter-msg comment yours" : "chatter-msg comment";

        return (
          <div key={message._id} className={messageClass}>
            {dateBanner}
            <div className="nickname">
              {nickname}
            </div>
            <div>
              <a
                className="avatar"
                onClick={() => this.setUserProfile(message.userId)}
              >
                <img src={avatar} />
              </a>
              <div className="content">
                <div className="text">
                 {message.message}
                </div>
              </div>
            </div>
            {timeAgo}
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
