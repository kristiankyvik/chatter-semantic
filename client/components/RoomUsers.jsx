import React from 'react';

import {getAvatarSvg, getUserStatus} from "../template-helpers/shared-helpers.jsx";

const RoomUsers = React.createClass({

  componentDidMount () {
    if (this.props.headerText !== "Room Users") {
      this.props.updateHeader("Room Users");
    }
  },

  render () {
    const allUsers = this.props.users.map( user => {
      const {isOnline} = getUserStatus(user);
      const statusCircleClass = isOnline ? "user-status online" : "user-status offline";

      return (
        <div className="item" key={user._id}>
          <div className={statusCircleClass}>
          </div>
          <img
            className="ui avatar image"
            src={`data:image/png;base64,${getAvatarSvg(user._id)}`}
          />
          <div className="content">
            <a className="header">
              {user.profile.chatterNickname}
            </a>
            <p className={isOnline ? "description success-msg" : "description failure-msg"}>
              <span>User is {isOnline ? "online" : "offline"}</span>
            </p>
          </div>
          <div className="ui divider"></div>
        </div>
      );
    });

    return (
      <div>
        <div className="padded scrollable">
          <div className="ui list relaxed">
            {allUsers}
          </div>
        </div>
        <div className="btn-wrapper">
          <div
            className="ui fluid button primary"
            onClick={() => this.props.router.push(this.props.buttonGoTo)}
          >
            {this.props.buttonMessage}
          </div>
        </div>
      </div>
    );
  }
});

export default RoomUsers;


