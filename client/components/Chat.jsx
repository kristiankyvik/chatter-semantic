import React from 'react';
import Nav from "../components/Nav.jsx";


const Chat = React.createClass({

  render () {
    return (
      <div className={"ui right vertical wide visible sidebar chatter " + this.props.chatClass} id="chatter">
          <Nav headerText={this.props.headerText} parentProps={this.props.parentProps} toggleChatState={this.props.toggleChatState} user={this.props.user}/>
          <div className="wrapper">
            {this.props.children}
          </div>
      </div>
    );
  }
});

export default Chat;
