import React from 'react';
import Nav from './components/Nav.jsx';
import Widget from "./components/Widget.jsx";

const App = React.createClass({

  getInitialState: function () {
    Session.set({
      chatOpen: false,
      msgNotif: 0
    });
    return {
      headerText: Chatter.options.chatName
    };
  },

  toggleChatState () {
    return;
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

    if (!Session.get("chatOpen")) {
      return <Widget toggleChatState={this.toggleChatState} />;
    }

    const children = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        router: this.props.router,
        pathname: this.props.location.pathname,
        updateHeader: this.updateHeader,
        headerText: this.state.headerText
      });
    });

    return (
      <div className="ui right vertical wide visible sidebar chatter" id="chatter">
          <Nav headerText={this.state.headerText} parentProps={this.props} toggleChatState={this.toggleChatState}/>
          <div className="wrapper">
            {children}
          </div>
      </div>
    );
  }
});

export default App;
