import React from 'react';

import {getAvatarSvg} from "../template-helpers/shared-helpers.jsx";

const Message = React.createClass({

  render () {
    const {
      message,
      dateBanner,
      nickname,
      avatar,
      timeAgo,
      messageClass,
      isAdmin
    } = this.props;

    const avatarImgHTML = (
      <img
        className="ui avatar image"
        src={`data:image/png;base64,${getAvatarSvg(avatar)}`}
      />
    );

    const avatarImg = avatar ? avatarImgHTML : null;
    const admin_badge_class = isAdmin  && avatar ? "" : "hidden";
    return (
      <div key={message._id} className={messageClass}>
        {dateBanner}
        <div className="nickname">
          {nickname}
        </div>
        <div>
          <a
            className="avatar"
          >
            {avatarImg}
            <i className={"star icon admin-badge " + admin_badge_class}>
            </i>
          </a>
          <div className="content">
            <div className="text">
             {message.message}
            </div>
          </div>
        </div>
        {timeAgo}
      </div>
    );
  }
});

export default Message;
