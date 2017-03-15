import React from 'react';

import Writer from "../components/Writer.jsx";
import Loader from "../components/Loader.jsx";
import Message from "../components/Message.jsx";
import UserBanner from "../components/UserBanner.jsx";

import {
  VERY_RECENT_MSG,
  RECENT_MSG,
  VERY_RECENT_MSG_INTERVAL,
  RECENT_MSG_INTERVAL
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

  getInitialState: function () {
    return {
      roomCount: 0,
      fetchingOlderMsgs: false
    };
  },

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
    this.pushMessage = _.debounce(this.pushMessage, 260);
    this.listenScrollEvent = _.debounce(this.listenScrollEvent, 100);
  },

  componentDidMount () {
    this.scrollDown();
  },

  componentWillUnmount () {
    if (!_.isNull(this.props.params.roomId)) {
      Meteor.call("room.unreadMsgCount.reset", this.props.params.roomId);
    }
  },

  shouldComponentUpdate (nextProps, nextState) {
    if (_.isNull(nextProps.room)) {
      return false;
    }
    return true;
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

  componentWillReceiveProps (nextProps) {
    // Track the loading old messges event
    if (this.state.fetchingOlderMsgs && (this.props.messages.length < nextProps.messages.length)) {
      this.setState({"fetchingOlderMsgs": false});
      const scroller = this.refs.scroller;
      scroller.scrollTop = 0;
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
          this.setState({"fetchingOlderMsgs": true});
          Session.set("messageLimit", Session.get("messageLimit") + 50);
        }
      });
    }
  },

  render () {
    const {messages, users, router, subsReady, room} = this.props;
    console.log(messages, users, room);
    const user = Meteor.user();
    const numberOfMessages = messages.length;

    const roomWrapperClass = this.state.fetchingOlderMsgs ? "messagesLoading" : "";
    let messagesHtml = (
      messages.map((message, index) => {
        let dateBanner = timeAgo = avatar = nickname = null;
        const prevMsg = messages[index - 1];
        const nextMsg = messages[index + 1];
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
          avatar = message.userId;
          nickname = !_.isEmpty(user) && user.hasOwnProperty("profile") ? user.profile.chatterNickname : message.userId;
        } else {
          if (isFirstMessage(messages[index - 1], message)) {
            avatar = message.userId;
            nickname = !_.isEmpty(user) && user.hasOwnProperty("profile") ? user.profile.chatterNickname : message.userId;
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
        <UserBanner
          room={this.props.room}
          users={users}
          router={router}
          user={user}
          addUsersPath={`/room/${this.props.params.roomId}/addusers`}
          showAddUsersBtn={true}
          subsReady={subsReady}
          showInfo={true}
        />
        <div className="room scrollable ui comments basic padded" onScroll={this.listenScrollEvent} ref="scroller">
          {this.state.fetchingOlderMsgs ? <Loader small={true} /> : null}
          {messages.length === 0 && !subsReady ? <Loader/> : messagesHtml}
        </div>
        <Writer numberOfMessages={numberOfMessages} pushMessage={this.pushMessage}/>
       </div>
    );
  }
});

export default Room;
