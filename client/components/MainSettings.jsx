import React from 'react';
import Loader from "../components/Loader.jsx"

const MainSettings = React.createClass({
  mixins: [ReactMeteorData],

  getInitialState: function() {
    return {
      roomUsers: []
    };
   },

  getMeteorData () {
    const userId = Meteor.userId();
    const userRoomsHandle = Meteor.subscribe("chatterUserRooms");
    const subsReady = userRoomsHandle.ready();
    let room = this.props.room;
    let user = null;

   if (subsReady) {
      const ur = Chatter.UserRoom.findOne({roomId: this.props.room._id, userId});
      user = Meteor.user();
      room.archived = ur.archived;
   }

   return {
     subsReady,
     room
   }
  },

  componentDidMount() {
    Meteor.call("room.users", this.props.room._id, (error, result) => {
      this.setState({roomUsers: result});
    });
  },

  toggleArchivedState() {
    const params = {
      archived: !this.data.room.archived,
      roomId: this.props.room._id,
      userId: Meteor.userId()
    };

    Meteor.call("room.archive", params);
  },

  render() {
    if (this.data.subsReady) {
      $(".ui.toggle.checkbox").checkbox();
      if (this.data.room.archived) {
        $(".ui.toggle.checkbox").checkbox('check');
      }
    }
    const addUsersHTML = (
      <div className="item addUserItem" onClick={ () => this.props.setView("addUsers")}>
        <i className="add user icon"></i>
        <div className="content">
          <a className="header">
            Add or remove users...
          </a>
        </div>
      </div>
    );

    const roomUsers = this.state.roomUsers;
    const roomUsersHTML = roomUsers.map(function(user) {
      const statusClass = user.profile.online ? "user-status online" : "user-status offline";
      return (
          <div className="item room-user" key={user._id}>
            <div className={statusClass}></div>
            <img
              className="ui avatar image"
              src={user.profile.chatterAvatar}
            />
            <div className="content">
              <a className="header nickname">
                {user.profile.chatterNickname}
              </a>
              <div className="description last-active">
                Last logged in just now.
              </div>
            </div>
          </div>
        );
      });

    if (roomUsers.length > 0) {
      return (
        <div className="padded settings scrollable">
          <div className="ui header">
            Channel description
          </div>
          <p className="room-description">
            {this.props.room.description}
          </p>
          <p className="gray-text">
            This channel was created by {this.props.room.createdBy} on the {this.props.room.createdAt.toISOString()}.
          </p>
          <div className="ui toggle checkbox" onClick={this.toggleArchivedState} >
            <label>
              <span className="ui header">Archive Chat</span>
            </label>
            <input
              type="checkbox"
              value={this.data.room.archived}
              name="public"
              tabIndex="0"
              className="hidden"
            />
          </div>
          <p>
            Archived chats will store the conversation and stop notifications from bothering you in the future.
          </p>
          <div className="ui accordion room-users">
            <div className="title active">
              <i className="dropdown icon"></i>
              <span className="ui header">
                Channel members ({roomUsers.length})
              </span>
            </div>
            <div className="content active">
              <div className="ui list relaxed">
                {user.profile.isChatterAdmin ? addUsersHTML : null}
                <div className="ui divider"></div>
                {roomUsersHTML}
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return <Loader/>
    }
  }
});

export default MainSettings;
