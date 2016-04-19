import React from 'react';

const MainSettings = React.createClass({

  getInitialState: function() {
    return {
      roomUsers: [],
      archived: this.props.room ? this.props.room.archived : null
    };
   },

  componentDidMount() {
    Meteor.call("room.users", this.props.room._id, (error, result) => {
      this.setState({roomUsers: result});
    });
  },

  componentWillUnmount() {
    Meteor.call("room.archive", this.props.room._id, this.state.archived);
  },

  toggleArchivedState() {
    Meteor.call("room.archive", this.props.room._id, !this.state.archived);
    this.setState({archived: !this.state.archived});
  },

  render() {
    const roomUsersHTML = this.state.roomUsers.map(function(user) {
      return (
        <div className="item" key={user._id}>
          <img
            className="ui avatar image"
            src="http://localhost:3000/packages/jorgeer_chatter-semantic/public/images/avatar.jpg"
          />
          <div className="content">
            <a className="header">
              {user.nickname}
            </a>
            <div className="description">
              Last logged in just now.
            </div>
          </div>
        </div>
      );
    });

    return (
      <div className="padded settings scrollable">
        <div className="ui header">
          Channel description
        </div>
        <p>
          {this.props.room.description}
        </p>
        <p className="gray-text">
          This channel was created by Roald Dahl the 12th January of 2015.
        </p>
        <div className="ui toggle checkbox" onClick={this.toggleArchivedState} >
          <label>
            <span className="ui header">Archive Chat</span>
          </label>
          <input
            type="checkbox"
            value={this.props.archived}
            name="public"
            tabIndex="0"
            className="hidden"
          />
        </div>
        <p>
          Archived chats will store the conversation and stop notifications from bothering you in the future.
        </p>
        <div className="ui accordion">
          <div className="title active">
            <i className="dropdown icon"></i>
            <span className="ui header">
              Channel members ({this.state.roomUsers.length})
            </span>
          </div>
          <div className="content active">
            <div className="ui list relaxed">
              <div className="item addUserItem" onClick={ () => this.props.setView("addUsers")}>
                <i className="add user icon"></i>
                <div className="content">
                  <a className="header">
                    Add or remove users...
                  </a>
                </div>
              </div>
              <div className="ui divider"></div>
              {roomUsersHTML}
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export default MainSettings;
