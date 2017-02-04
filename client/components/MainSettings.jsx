import React from 'react';
import Loader from "../components/Loader.jsx";

import {getAvatarSvg, getRelativeTime} from "../template-helpers/shared-helpers.jsx";

const MainSettings = React.createClass({

  toggleArchivedState () {
    const params = {
      archived: !this.props.room.archived,
      roomId: this.props.room._id,
      userId: Meteor.userId()
    };

    Meteor.call("room.archive", params);
  },

  deleteRoom () {
    console.log("deletin this room", this.props.room);
    Meteor.call("room.delete", this.props.room._id, (error, result) => {
      if (!error) {
        console.log("deleted");
        this.props.router.push("/");
      }
    });
  },

  componentDidUpdate () {
    if (this.props.room.archived) {
      $(".ui.toggle.checkbox").checkbox('check');
    }
  },

  render () {
    if (!this.props.subsReady) {
      return <Loader/>;
    }

    const user = Meteor.user();
    const { users, router, location, room } = this.props;

    $(".ui.toggle.checkbox").checkbox();

    const addUsersHTML = (
      <div className="item addUserItem" onClick={ () => router.push(`/room/${room._id}/addusers`) }>
        <i className="add user icon"></i>
        <div className="content">
          <a className="header">
            Add or remove users...
          </a>
        </div>
      </div>
    );

    const roomUsersHTML = users.map(function (user) {
      const userHasStatus = user.hasOwnProperty("status");
      const userOnline = userHasStatus ? user.status.online : false;
      const status = userOnline ? "user-status online" : "user-status offline";
      const userHasLastLoginDate = userHasStatus && user.status.hasOwnProperty("lastLogin");
      const lastLogin = userHasLastLoginDate ? getRelativeTime(user.status.lastLogin.date) : "User is offline";

      return (
        <div className="item room-user" key={user._id}>
          <div className={status}></div>
          <img
            className="ui avatar image"
            src={`data:image/png;base64,${getAvatarSvg(user._id)}`}
          />
          <div className="content">
            <a className="header nickname">
              {user.profile.chatterNickname}
            </a>
            <div className="description last-active">
              {lastLogin}
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
          {this.props.room.description ? room.description : null }
        </p>

        {user.profile.isChatterAdmin || room.roomType === "support" ? deleteRoomHTML : null}

        <div className="ui toggle checkbox" onClick={this.toggleArchivedState} >
          <label>
            <span className="ui header">Archive Room</span>
          </label>
          <input
            type="checkbox"
            value={room.archived}
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
              Channel members ({users.length})
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
  }
});

export default MainSettings;
