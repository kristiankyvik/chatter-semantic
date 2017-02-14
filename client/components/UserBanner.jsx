import React from 'react';

import {getAvatarSvg} from "../template-helpers/shared-helpers.jsx";

const UserBanner = React.createClass({
  componentDidMount () {
    if (this.props.showInfo) {
      $('.info.circle.icon').popup({
        popup: $('.room-info-popup'),
        on: 'click',
        boundary: '.room.scrollable.ui.comments'
      });
    }
  },

  toggleArchivedState () {
    const params = {
      archived: !this.props.room.archived,
      roomId: this.props.room._id,
      userId: this.props.user._id
    };

    Meteor.call("room.archive", params);
  },

  deleteRoom () {
    Meteor.call("room.delete", this.props.room._id, (error, result) => {
      if (!error) {
        this.props.router.push("/");
      }
    });
  },

  checkIfArchived () {
    $(".ui.toggle.checkbox").checkbox();
    if (this.props.room.archived) {
      $(".ui.toggle.checkbox").checkbox('check');
    }
  },

  render () {
    const {router, users, user, showAddUsersBtn, addUsersPath, room, showInfo, subsReady} = this.props;

    $(".ui.toggle.checkbox").checkbox();

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

    let roomInfo = null;

    if (!_.isEmpty(room)) {
      roomInfo = (
        <div className="popup-content">
          <div className="ui header">
            Channel description
          </div>
          <p className="room-description">
            {room.description ? room.description : null }
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
        </div>
      );
    }

    const onlineUsers = [];
    const numberOfUsers = users.length;


    let numUsersShown = 6;
    let numUsersNotShown = 0;
    let notSeenHtml = null;

    if (numberOfUsers <= 6) {
      numUsersShown = numberOfUsers;
    } else {
      numUsersNotShown = numberOfUsers - 6;
      notSeenHtml = (
        <div className="notSeen" key={"notSeen"}>
          <i className="plus icon"></i><div className="otherUsers">{numUsersNotShown}</div>
        </div>
      );
    }

    _(numUsersShown).times(function (n) {
      const userHasStatus = users[n].hasOwnProperty("status");
      const userOnline = userHasStatus ? users[n].status.online : false;
      const status = userOnline ? "user-status online" : "user-status offline";
      const userCircle = (
        <div className="user" key={users[n]._id} data-tooltip={users[n].profile.chatterNickname} data-position="bottom center">
          <img
            className="ui avatar image"
            src={`data:image/png;base64,${getAvatarSvg(users[n]._id)}`}
          />
          <div className={status}></div>
        </div>
      );
      onlineUsers.push(userCircle);
    });

    const addUsersBtn = (
      <button
        key={"add-user-button"}
        className="circular ui icon button addUserBtn"
        onClick={ () => router.push(addUsersPath)}
      >
        <i className="plus icon"></i>
      </button>
    );


    if (user.profile.isChatterAdmin && showAddUsersBtn) {
      onlineUsers.push(addUsersBtn);
    }

    if (numUsersNotShown > 0) {
      onlineUsers.push(notSeenHtml);
    }


    return (
      <div className="online-user-banner">
        <div className="left">
          <i className={showInfo ? "info circle icon" : "hidden"} onClick={this.checkIfArchived}></i>
            <div className="ui custom popup room-info-popup">
              {roomInfo}
            </div>
        </div>
        <div className="center">
          {onlineUsers}
        </div>
        <div className="right">
        </div>
      </div>
    );
  }
});

export default UserBanner;
