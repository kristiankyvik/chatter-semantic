import React from 'react';

const Widget = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData () {
    const widgetDataHandle = Meteor.subscribe("widgetData");

    const subsReady = widgetDataHandle.ready();

    let count = 0;

    if (subsReady) {
      count = Counts.get("widgetCounter");
    }
    return {
      count,
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
    if (Session.get("chatOpen") || !this.props.initialLoad) {
      return null;
    }
    return (
      <div className="ui button primary chatter-open" id="chatter-open" onClick={this.props.toggleChatState}>
        <i className="comment icon"></i>
        {this.data.count > 0 ? msgNotifHTML : null}
      </div>
    );
  }
});

export default Widget;
