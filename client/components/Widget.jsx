import React from 'react';

const Widget = React.createClass({

  render () {
    const msgNotif = this.props.msgNotif;
    const msgNotifHTML = (
      <div className="widget-msg-notif">
       </div>
    );
    return (
      <div className="ui button primary chatter-open" id="chatter-open" onClick={this.props.toggleChatState}>
        <i className="comment icon"></i>
        {msgNotif ? msgNotifHTML : null}
      </div>
    );
  }
});

export default Widget;
