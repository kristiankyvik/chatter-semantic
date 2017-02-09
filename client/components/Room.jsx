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

const isFirstMessage = function (prevMsg, currentMsg) {
  return prevMsg.userId !== currentMsg.userId;
};

const timeSinceLastMsgGreaterThan = function (minutes, prevMsg, currentMsg) {
  if (_.isEmpty(currentMsg)) return;
  const difference = currentMsg.createdAt - prevMsg.createdAt;
  const resultInMinutes = Math.round(difference / 60000);
  return resultInMinutes > minutes;
};

const timestampShouldBeDisplayed = function (currentMsg, nextMsg) {
  const veryRecentMessage = currentMsg.getMinutesAgo() <= VERY_RECENT_MSG;
  const recentMessage = currentMsg.getMinutesAgo() <= RECENT_MSG;
  return veryRecentMessage && timeSinceLastMsgGreaterThan(VERY_RECENT_MSG_INTERVAL, currentMsg, nextMsg) || recentMessage && timeSinceLastMsgGreaterThan(RECENT_MSG_INTERVAL, currentMsg, nextMsg);
};

const Room = React.createClass({

  pushMessage (text) {
    const roomId = this.props.params.roomId;
    const params = {
      message: text,
      roomId
    };

    if (!text || text.length > 1000) return;
    Meteor.call("message.send", params);
    this.scrollDown();
  },

  componentWillMount () {

    // creates a throttled version for both listeners
    this.pushMessage = _.debounce(this.pushMessage, 100);
    this.listenScrollEvent = _.debounce(this.listenScrollEvent, 100);
  },

  componentDidMount () {
    this.scrollDown();
  },

  componentWillUnmount () {
    Meteor.call("room.unreadMsgCount.reset", this.props.params.roomId);
  },

  componentWillUpdate () {
    const scroller = this.refs.scroller;
    this.shouldScroll = scroller.scrollTop + scroller.offsetHeight === scroller.scrollHeight;
  },

  componentDidUpdate () {
    if (this.shouldScroll) {
      this.scrollDown();
    }
    if (this.props.headerText !== this.props.room.name) {
      this.props.updateHeader(this.props.room.name);
    }
  },

  scrollDown () {
    const scroller = this.refs.scroller;
    scroller.scrollTop = scroller.scrollHeight;
  },

  setUserProfile (userId) {
    this.props.setUserProfile(userId);
  },

  listenScrollEvent () {
    // TODO: throttleeeeee
    const scroller = this.refs.scroller;
    if (scroller.scrollTop === 0) {
      Meteor.call("message.count", this.props.params.roomId, (error, result) => {
        const messageCount = result;
        if (messageCount > this.props.messages.length) {
          Session.set("messageLimit", Session.get("messageLimit") + 50);
        }
      });
    }
  },

  render () {
    const roomWrapperClass = this.props.messages.length > 0 ? "" : "messagesLoading";

    const numberOfMessages = this.props.messages.length;
    const messages = (
      this.props.messages.map((message, index) => {
        let dateBanner = timeAgo = avatar = nickname = null;
        const prevMsg = this.props.messages[index - 1];
        const nextMsg = this.props.messages[index + 1];
        const user = Meteor.users.findOne(message.userId);

        const isFirstMessageOfChat = index === 0;
        const isFirstMessageOfDay = index > 0 && prevMsg.getDate() !== message.getDate();
        const isLastMessageChat = index === numberOfMessages - 1;

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
        }

        // takes care of the display of avatars and nicknames
        if (index === 0 ) {
          avatar = user._id;
          nickname = user.profile.chatterNickname;
        } else {
          if (isFirstMessage(this.props.messages[index - 1], message)) {
            avatar = user._id;
            nickname = user.profile.chatterNickname;
          } else if (isFirstMessageOfDay) {
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
      <div className={"roomWrapper " + roomWrapperClass}>
        <div className="room scrollable ui comments basic padded" onScroll={this.listenScrollEvent} ref="scroller">
          {this.props.subsReady ? messages : <Loader />}
        </div>
        <Writer numberOfMessages={numberOfMessages} pushMessage={this.pushMessage}/>
      </div>
    );
  }
});

export default Room;
