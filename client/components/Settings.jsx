import React from 'react';
import AddUsers from "./AddUsers.jsx";

const Settings = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData () {
    const userRoomsHandle = Meteor.subscribe("chatterUserRooms");
    const subsReady = userRoomsHandle.ready();

    let roomUsers = [];
    let otherUsers = [];
    let allUsers = [];

    if (subsReady) {
      const roomUsersIds = _.pluck(Chatter.UserRoom.find({"roomId": this.props.room._id}).fetch(), "userId");
      _.each(this.props.chatterUsers, function(user) {
        if (roomUsersIds.indexOf(user._id) < 0) {
          user.added = false;
          otherUsers.push(user);
        } else {
          user.added = true;
          roomUsers.push(user);
        }
      });
      allUsers = otherUsers.concat(roomUsers);
    }

    return {
      roomUsers,
      otherUsers,
      allUsers
    }
  },

  getInitialState: function() {
    return {
      archived: this.props.room ? this.props.room.archived : null,
      addUsers: false
    };
   },

  componentDidMount() {
    $(".ui.accordion")
      .accordion()
    ;
    $(".ui.toggle.checkbox").checkbox();
    if (this.state.archived) {
      $(".ui.toggle.checkbox").checkbox('check');
    }
  },

  componentWillUnmount() {
    Meteor.call("room.archive", this.props.room._id, this.state.archived);
  },

  toggleArchivedState() {
    this.setState({archived: !this.state.archived});
  },

  render() {
    const roomUsersHTML = [];
    this.data.roomUsers.forEach(function(user) {
      roomUsersHTML.push(
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

    const settingsHTML = (
      <div className="padded settings">
        <div className="ui header">
          Channel description
        </div>
        <p>
          This channel was set up with the objective of connecting students with professors.
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
            value={this.state.archived}
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
              Channel members ({this.data.roomUsers.length})
            </span>
          </div>
          <div className="content active">
            <div className="ui list relaxed">
              <div className="item addUserItem" onClick={() => this.setState({addUsers: !this.state.addUsers})}>
                <i className="add user icon"></i>
                <div className="content">
                  <a className="header">
                    Add participant...
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
    return (
      <div>
        {this.state.addUsers ? <AddUsers allUsers={this.data.allUsers} room={this.props.room} /> : settingsHTML}
      </div>
    );
  }
});

export default Settings;
