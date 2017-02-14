import React from 'react';

import {getAvatarSvg, getUserStatus} from "../template-helpers/shared-helpers.jsx";

const RoomListItem = React.createClass({

  render () {
    const {room, goToRoom} = this.props;
    let lastAvatar = "09090909090909";
    let statusClass = "user-status none";

    if (!_.isNull(room.lastMsgUser)) {
      const {isOnline} = getUserStatus(room.lastMsgUser);
      statusClass = isOnline ? "user-status online" : "user-status offline";
      lastAvatar = room.lastMsgUser._id;
    }

    const unread = room.unreadMsgCount > 0 ? "unread" : null;

    return (
      <div
        className={"item transition visible roomListItem " + unread}
        onClick={() => goToRoom(room._id)}
      >
        <div className={statusClass}></div>
        <img
          className="ui avatar image"
          src={`data:image/png;base64,${getAvatarSvg(lastAvatar)}`}
        />

        <div className="content">
          <div className="header">
            <div className="roomName">
              {room.name}
            </div>
            <div className="meta">
              {room.getTimeAgo()}
            </div>
          </div>
          <div className="description">
            <div className="preview">
              {_.isEmpty(room.lastMessage) ? "no messages yet" : room.lastMessage}
            </div>
            <div className="counter">
                { room.unreadMsgCount > 0 ? <span> {room.unreadMsgCount} </span> : "" }
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export default RoomListItem;
