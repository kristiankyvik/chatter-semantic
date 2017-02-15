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
    // After a refresh, check whether we find ouselves in the root, if not redirect
    if (!this.state.initialLoad && this.props.location.pathname !== "/" ) {
      this.props.router.push("/");
    }
    const user = Meteor.user();

    // If user not logged in display empty div
    if (_.isEmpty(user)) {
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
        initialLoad: this.state.initialLoad,
        user: user
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
          user={user}
        />
      </div>
    );
  }
});

export default App;
