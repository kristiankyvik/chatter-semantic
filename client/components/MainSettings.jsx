import React from 'react';
import Loader from "../components/Loader.jsx"

import {getAvatarSvg} from "../template-helpers/shared-helpers.jsx";

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
    let room = this.props.room ? this.props.room : {};
    let user = null;

    if (subsReady) {
      user = Meteor.user();
      const ur = Chatter.UserRoom.findOne({roomId: room._id, userId});
      room.archived = ur ? ur.archived : false;
    }

    return {
      subsReady,
      room,
      user
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

  deleteRoom() {
    Meteor.call("room.delete", this.props.room._id, (error, result) => {
      if (!error) {
        this.props.setView("roomList");
      }
    });
  },

  render() {
    if (this.data.subsReady) {
      const user = this.data.user;
      $(".ui.toggle.checkbox").checkbox();
      if (this.data.room.archived) {
        $(".ui.toggle.checkbox").checkbox('check');
      }
      const addUsersHTML = (
        <div className="item addUserItem" onClick={ () => this.props.setSettingsView("addUsers")}>
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
                src={`data:image/png;base64,${getAvatarSvg(user.username)}`}
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

      const deleteRoomHTML = (
        <div>
          <div className="ui header">
            Delete Room
          </div>
          <p>
            Keep in mind that once a room is deleted it cannot be recovered.
          </p>
          <div className="deleteBtnWrapper">
            <button className="negative ui button" onClick={this.deleteRoom}>
              Delete
            </button>
          </div>
        </div>
      );

      return (
        <div className="padded settings scrollable">
          <div className="ui header">
            Channel description
          </div>
          <p className="room-description">
            {this.props.room.description ? this.props.room.description : null }
          </p>
          <p className="gray-text">
            This channel was created by {this.props.room.createdBy} on the {this.props.room.createdAt.toISOString()}.
          </p>

          {user.profile.isChatterAdmin ? deleteRoomHTML : null}

          <div className="ui toggle checkbox" onClick={this.toggleArchivedState} >
            <label>
              <span className="ui header">Archive Room</span>
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
