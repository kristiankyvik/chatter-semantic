import React from 'react';
import ReactDOM from 'react-dom';
import addons from 'react/addons'

import Nav from "./components/Nav.jsx";

import router from "./template-helpers/router.jsx";


const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

const isChatterUser = function(chatterUsers) {
  const chatterUserIds = chatterUsers.map(function(user) {
    return user.userId;
  });
  return (chatterUserIds.indexOf(Meteor.userId()) > -1) ;
};

const getChatHTML = function(data) {
  let chatHTML = <div>Hei Man not useing chatter</div>;
  if (isChatterUser(data.data.chatterUsers, Meteor.userId())) {
    chatHTML = (
      <div className="ui right vertical wide visible sidebar chatter" id="chatter">
          <Nav
            view={data.state.view}
            setView={data.setView}
            chatState={data.state.chatState}
            roomId={data.state.roomId}
            header={data.state.header}
          />
          <div className="wrapper">
            {router(data, data.state.view).component}
          </div>
      </div>
    );
  };
  return chatHTML;
};

const ChatterApp = React.createClass({
  mixins: [ReactMeteorData],

  getInitialState: function() {
    return {
      chatOpen: true,
      roomId: null,
      header: "Chatter",
      view: "roomList",
      activeRooms: [],
      archivedRooms: []
    };
   },

  getMeteorData () {
    const chatterUsersHandle = Meteor.subscribe("chatterUsers");
    const roomsHandle = Meteor.subscribe("chatterRooms");
    const userRoomsHandle = Meteor.subscribe("chatterUserRooms");
    const subsReady = roomsHandle.ready() && userRoomsHandle.ready() && chatterUsersHandle.ready();

    let activeRooms = [];
    let archivedRooms = [];
    let chatterUsers = [];
    let chatterUser = null;

    if (subsReady) {
      chatterUser = Chatter.User.findOne({userId: Meteor.userId()});
      chatterUsers = Chatter.User.find({}, {sort: {nickname: 1}}).fetch();
      if (chatterUsers.length > 0) {
        const userRooms = Chatter.UserRoom.find({"userId": chatterUser._id}).fetch();
        const roomIds = _.pluck(userRooms, "roomId");
        activeRooms = Chatter.Room.find({"_id": {$in:roomIds}, "archived": false}, {sort: {lastActive: -1}}).fetch();
        archivedRooms = Chatter.Room.find({"_id": {$in:roomIds}, "archived": true}).fetch();
      }
    }

    return {
      activeRooms,
      archivedRooms,
      subsReady,
      chatterUsers,
      chatterUser
    }
  },

  goToRoom(roomId, roomName) {
    this.setState({
      roomId: roomId,
      view: 'room',
      header: roomName
    });
  },

  setView(view) {
    this.setState(router(this, view));
  },

  toggleChatState() {
    this.setState({
      chatState: !this.state.chatOpen
    });
  },

  render() {
    let chatHTML = getChatHTML(this);
    const isMinimized = this.state.chatState === "minimized";
    return (
      isMinimized ? <Widget toggleChatState={this.toggleChatState} /> : chatHTML
    )
  }
});

export default ChatterApp;

