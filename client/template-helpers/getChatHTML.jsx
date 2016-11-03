import React from 'react';
import router from "./router.jsx";
import Nav from "../components/Nav.jsx";
import Widget from "../components/Widget.jsx";

const isChatterUser = function(chatterUsers) {
  const chatterUserIds = chatterUsers.map(function(user) {
    return user.userId;
  });
  return (chatterUserIds.indexOf(Meteor.userId()) > -1) ;
};


const getChatHTML = function(data) {
  let chatHTML = null;
  if (Meteor.userId()) {
    chatHTML = (
      <div className="ui right vertical wide visible sidebar chatter" id="chatter">
          <Nav
            view={data.state.view}
            setView={data.setView}
            chatState={data.state.chatState}
            roomId={data.state.roomId}
            header={data.state.header}
            toggleChatState={data.toggleChatState}
            setUserProfile={data.setUserProfile}
          />
          <div className="wrapper">
            {router(data, data.state.view).component()}
          </div>
      </div>
    );
    return Session.get("chatOpen") ? chatHTML : <Widget toggleChatState={data.toggleChatState} msgNotif={data.data.msgNotif} />;
  } else {
    return null;
  }
};

export default getChatHTML;
