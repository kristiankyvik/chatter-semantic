import React from 'react';
import Nav from './components/Nav.jsx';
import Widget from "./components/Widget.jsx";

const App = React.createClass({

  getInitialState: function () {
    Session.set({
      chatOpen: true,
      roomId: null,
      msgNotif: 0,
      messageLimit: 100
    });
    return {
    };
  },

  toggleChatState () {

  },

  render ( ) {
    console.log("chat open", Session.get("chatOpen"));
    if (!Session.get("chatOpen")) {
      return <Widget toggleChatState={this.toggleChatState} msgNotif={false} />;
    }

    const children = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        router: this.props.router,
        pathname: this.props.location.pathname
      });
    });

    return (
      <div className="ui right vertical wide visible sidebar chatter" id="chatter">
          <Nav parentProps={this.props}/>
          <div className="wrapper">
            {children}
          </div>
      </div>
    );
  }
});

export default App;
