import React from 'react';

import {getAvatarSvg} from "../template-helpers/shared-helpers.jsx";

const UserBanner = React.createClass({

  render () {
    const {router, users, user, showAddUsersBtn, addUsersPath} = this.props;

    const onlineUsers = _.map(users, function (user) {
      const userHasStatus = user.hasOwnProperty("status");
      const userOnline = userHasStatus ? user.status.online : false;
      const status = userOnline ? "user-status online" : "user-status offline";
      return (
        <div className="user">
          <img
            className="ui avatar image"
            src={`data:image/png;base64,${getAvatarSvg(user._id)}`}
            key={user._id}
          />
          <div className={status}></div>
        </div>
      );
    });

    const addUsersBtn = (
      <button
        className="circular ui icon button addUserBtn"
        onClick={ () => router.push(addUsersPath)}
      >
        <i className="plus icon"></i>
      </button>
    );
    if (user.profile.isChatterAdmin && showAddUsersBtn) {
      onlineUsers.push(addUsersBtn);
    }

    return (
      <div className="online-user-banner">
        {onlineUsers}
      </div>
    );
  }
});

export default UserBanner;
