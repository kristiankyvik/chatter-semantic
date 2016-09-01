import React from 'react';


const Message = React.createClass({

  render() {
    const {
      message,
      dateBanner,
      nickname,
      setUserProfile,
      avatar,
      timeAgo,
      messageClass
    } = this.props;

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
            <img src={avatar} />
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







