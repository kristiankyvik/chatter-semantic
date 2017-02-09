import React from 'react';
import Widget from './components/Widget.jsx';
import Chat from "./components/Chat.jsx";

const App = React.createClass({

  getInitialState: function () {
    Session.set({
      chatOpen: false,
      msgNotif: 0
    });
    return {
      headerText: Chatter.options.chatName,
      initialLoad: false
    };
  },

  toggleChatState () {
    return;
  },

  setInitialLoad (status) {
    this.setState({initialLoad: status});
  },

  shouldComponentUpdate (nextProps, nextState) {
    return true;
  },

  updateHeader (headerText) {
    this.setState({headerText: headerText});
  },

  render ( ) {
    console.log("render app");
    // If user not logged in display empty div
    if (_.isNull(Meteor.userId())) {
      return (
        <div>
        </div>
      );
    }

    const children = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        router: this.props.router,
        pathname: this.props.location.pathname,
        updateHeader: this.updateHeader,
        headerText: this.state.headerText,
        setInitialLoad: this.setInitialLoad,
        initialLoad: this.state.initialLoad
      });
    });

    const chatClass = Session.get("chatOpen") ? "" : "hidden";
    return (
      <div>
        <Widget toggleChatState={this.toggleChatState} initialLoad={this.state.initialLoad} />
        <Chat
          chatClass={chatClass}
          headerText={this.state.headerText}
          parentProps={this.props}
          toggleChatState={this.toggleChatState}
          children={children}
        />
      </div>
    );
  }
});

export default App;
