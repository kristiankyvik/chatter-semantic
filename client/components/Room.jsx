import React from 'react';

import Writer from "../components/Writer.jsx";
import Loader from "../components/Loader.jsx";
import Message from "../components/Message.jsx";

import {
  VERY_RECENT_MSG,
  RECENT_MSG,
  VERY_RECENT_MSG_INTERVAL,
  RECENT_MSG_INTERVAL,
  ROOM_CACHE_LIMIT,
  ROOM_EXPIRE_IN
} from "../global-variables.js";

const isFirstMessage = function(prevMsg, currentMsg) {
  return prevMsg.userId !== currentMsg.userId;
};

const timeSinceLastMsgGreaterThan = function(minutes, prevMsg, currentMsg) {
  if (_.isUndefined(currentMsg)) return;
  const difference = currentMsg.createdAt - prevMsg.createdAt;
  const resultInMinutes = Math.round(difference / 60000);
  return resultInMinutes > minutes;
};

const timestampShouldBeDisplayed = function(currentMsg, nextMsg) {
  const veryRecentMessage = currentMsg.getMinutesAgo() <= VERY_RECENT_MSG;
  const recentMessage = currentMsg.getMinutesAgo() <= RECENT_MSG;
  return veryRecentMessage && timeSinceLastMsgGreaterThan(VERY_RECENT_MSG_INTERVAL, currentMsg, nextMsg) || recentMessage && timeSinceLastMsgGreaterThan(RECENT_MSG_INTERVAL, currentMsg, nextMsg);
};

const roomSubs = new SubsManager({
  cacheLimit: ROOM_CACHE_LIMIT,
  expireIn: ROOM_EXPIRE_IN
});

const Room = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    const { roomId } = this.props;
    const messagesHandle = roomSubs.subscribe("chatterMessages", {
      roomId,
      messageLimit: Session.get("messageLimit")
    });

    const usersHandle = roomSubs.subscribe("users");
    const subsReady = messagesHandle.ready() && usersHandle.ready();

    if (subsReady) {
      this.messages = Chatter.Message.find({"roomId": roomId}, {sort: {createdAt: 1}}).fetch();
    }

    return {
      subsReady
    };
  },

  pushMessage(text) {
    const roomId = this.props.roomId;
    const params = {
        message: text,
        roomId
    };

    if (!text || text.length > 1000) return;
    Meteor.call("message.send", params);
    // Session.set("messageLimit", Session.get("messageLimit") + 1);
    this.scrollDown();
  },

  componentWillMount() {
    // creates a throttled version of the pushMessage function per component
    this.pushMessage = _.debounce(this.pushMessage, 100);
    this.messages = [];
  },

  componentDidMount() {
    this.scrollDown();
    Meteor.call("room.unreadMsgCount.reset", this.props.roomId);
  },

  componentWillUnmount() {
    if (!this.checkRoom()) return;
    Meteor.call("room.unreadMsgCount.reset", this.props.roomId);
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

  setUserProfile(userId) {
    this.props.setUserProfile(userId);
    this.props.setView("profile");
  },

  checkRoom() {
    Meteor.call("room.check", this.props.roomId, (error, result) => {
      if (!result) {
        this.props.setView("roomList");
      }
    });
  },

  listenScrollEvent() {
    // TODO: throttleeeeee
    const scroller = this.refs.scroller;
    if (scroller.scrollTop === 0) {
      console.log("scrolled to the top!");
      Session.set("messageLimit", Session.get("messageLimit") + 50);
    }
  },

  render() {
    this.checkRoom();
    console.log(this.data.subsReady);

    const loader = (
      <Loader/>
    );

    const numberOfMessages = this.messages.length;
    const messages = (
      this.messages.map((message, index) => {
        let dateBanner = timeAgo = avatar = nickname = null;
        const prevMsg = this.messages[index - 1];
        const nextMsg = this.messages[index + 1];
        const user = Meteor.users.findOne(message.userId);

        const isFirstMessageOfChat = index === 0,
              isFirstMessageOfDay = index > 0 && prevMsg.getDate() !== message.getDate(),
              isLastMessageChat = index === numberOfMessages - 1;

        // takes care of the display of dates and timestamps
        if (isFirstMessageOfChat || isFirstMessageOfDay) {
          dateBanner = (
            <div className="date-banner">
              <span> {message.getDate()} </span>
            </div>
          );
        }

        if (isLastMessageChat) {
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
          avatar = user._id;
          nickname = user.profile.chatterNickname;
        } else {
          if (isFirstMessage(this.messages[index - 1], message)) {
            avatar = user._id;
            nickname = user.profile.chatterNickname;
          }
        }

        const ownsMessage = Meteor.userId() === message.userId;
        const messageClass = ownsMessage ? "chatter-msg comment yours" : "chatter-msg comment";

        return (
          <Message
            key={message._id}
            message={message}
            messageClass={messageClass}
            dateBanner={dateBanner}
            nickname={nickname}
            avatar={avatar}
            setUserProfile={this.setUserProfile}
            timeAgo={timeAgo}
          />
        );
      })
    );

    return (
      <div className="roomWrapper">
        {this.data.subsReady ? null : loader}
        <div className="room scrollable ui comments basic padded" onScroll={this.listenScrollEvent} ref="scroller">
          {messages}
        </div>
        <Writer pushMessage={this.pushMessage}/>
      </div>
    );
  }
});

export default Room;
