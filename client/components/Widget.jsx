import React from 'react';

const Widget = React.createClass({

  render() {

    return (
      <div className="ui button primary chatter-open" id="chatter-open" onClick={this.props.toggleChatState}>
        <i className="comment icon"></i>
        <div className="widget-msg-notif">
         </div>
      </div>
    );
  }
});

export default Widget;
