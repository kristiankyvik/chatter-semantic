import React from 'react';

import Writer from "../components/Writer.jsx"

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

  getMinutesBetween(prevMsg, msg) {
    const difference = msg.createdAt - prevMsg.createdAt;
    const resultInMinutes = Math.round(difference / 60000);
    return resultInMinutes;
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
   const loader =  (
      <div className="ui active inverted dimmer">
        <div className="ui text loader">
          Loading messages
        </div>
      </div>
    );


    let isNew = true;
    const messages = (
      this.data.messages.map((message, index) => {
        let dateBanner = null;
        let timeAgo = null;
        let avatar = null;
        let nickname = null;

        if (index === 0) {
          dateBanner = (
            <div className="date-banner">
              <span> {message.timestamp()} </span>
            </div>
          );
          avatar = message.avatar;
        } else if (message.hoursAgo() > 24 && this.getMinutesBetween(this.data.messages[index - 1], message) > 1440) {
          dateBanner = (
            <div className="date-banner">
              <span> {message.timestamp()} </span>
            </div>
          );
        } else if ( index === this.data.messages.length - 1) {
          timeAgo = (
            <div className="time-ago">
              <span> {message.timeAgo()} </span>
            </div>
          );
        } else if (message.hoursAgo() <= 24 && this.getMinutesBetween(message, this.data.messages[index + 1]) > 5) {
          timeAgo = (
            <div className="time-ago">
              <span> {message.timeAgo()} </span>
            </div>
          );
        } else {

        }

       if (index === 0) {
         avatar = message.avatar;
         isNew = false;
         nickname = message.nickname;
       } else if (index === this.data.messages.length - 1 ) {
          if (isNew){
            avatar = message.avatar;
            nickname = message.nickname;

          }
       } else if (message.userId == this.data.messages[index + 1].userId) {
          if (isNew){
            avatar = message.avatar;
            nickname = message.nickname;
            isNew = false;
          }
        } else {
          isNew = true;
        }
        const messageClass = this.props.chatterUser._id === message.userId ? "chatter-msg comment yours" : "chatter-msg comment";

        return (
          <div key={message._id} >
            {dateBanner}
            <div className={messageClass}>
              <div className="nickname">
                {nickname}
              </div>
              <div>
                <a className="avatar">
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
