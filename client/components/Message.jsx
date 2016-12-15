import React from 'react';

import {getAvatarSvg} from "../template-helpers/shared-helpers.jsx";

const Message = React.createClass({

  render () {
    const {
      message,
      dateBanner,
      nickname,
      setUserProfile,
      avatar,
      timeAgo,
      messageClass
    } = this.props;

    const avatarImgHTML = (
      <img
        className="ui avatar image"
        src={`data:image/png;base64,${getAvatarSvg(avatar)}`}
      />
    );

    const avatarImg = avatar ? avatarImgHTML : null;

    return (
      <div key={message._id} className={messageClass}>
        {dateBanner}
        <div className="nickname">
          {nickname}
        </div>
        <div>
          <a
            className="avatar"
            onClick={() => setUserProfile(message.userId)}
          >
            {avatarImg}
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
