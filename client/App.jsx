import React from 'react';

import Widget from './components/Widget.jsx';
import Chat from "./components/Chat.jsx";

import { Chatter } from "meteor/hubroedu:chatter-core";

const App = React.createClass({

  getInitialState: function () {
    return {
      headerText: Chatter.options.chatName
    };
  },

  toggleChatState () {
    if (!Chatter.options.customToggleHandlers) {
      Session.set("chatOpen", !Session.get("chatOpen"));
      this.forceUpdate();
    }
  },

  componentDidMount () {
    Session.set({
      chatOpen: false
    });
    this.forceUpdate();

    Tracker.autorun(function () {
      if(Session.get("chatOpen")) {
        Meteor.call("rooms.unseen.reset", (error, result)=> {
          if (error) {
            console.log("[CHATTER] error: ", error.error);
          }
        });
      }
    });
  },

  componentWillMount () {
    // After a refresh, check whether we find ouselves in the root, if not redirect
    if (this.props.location.pathname !== "/" ) {
      this.props.router.push("/");
    }
  },

  updateHeader (headerText) {
    this.setState({headerText: headerText});
  },

  render ( ) {
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
        user: user
      });
    });

    return (
      <div>
        <Widget toggleChatState={this.toggleChatState} />
        <Chat
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
