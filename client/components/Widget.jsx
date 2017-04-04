import React from 'react';
import { Counts } from "meteor/tmeasday:publish-counts";

const Widget = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData () {
    const widgetDataHandle = Meteor.subscribe("widgetData");

    const subsReady = widgetDataHandle.ready();

    let unreadMsgCount = 0;
    let unseenRoomsCount = 0;

    if (subsReady) {
      unreadMsgCount = Counts.get("unreadMsgCounter");
      unseenRoomsCount = Counts.get("unseenRoomsCounter");
    }
    return {
      unreadMsgCount,
      unseenRoomsCount,
      widgetDataHandle
    };
  },

  componentWillUnmount () {
    this.data.widgetDataHandle.stop();
  },

  render () {
    const msgNotifHTML = (
      <div className="widget-msg-notif">
       </div>
    );

    if (Session.get("chatOpen")) {
      return null;
    }
    return (
      <div className="ui button primary chatter-btn" id="chatter-btn" onClick={this.props.toggleChatState}>
        <i className="comment icon"></i>
        {(this.data.unreadMsgCount + this.data.unseenRoomsCount) > 0 ? msgNotifHTML : null}
      </div>
    );
  }
});

export default Widget;
