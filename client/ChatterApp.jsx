import React from 'react';
import ReactDOM from 'react-dom';

import RoomList from "./components/RoomList.jsx";
import Settings from "./components/Settings.jsx"
import Room from "./components/Room.jsx";
import Widget from "./components/Widget.jsx";
import NewRoom from "./components/NewRoom.jsx";
import Nav from "./components/Nav.jsx";

const actions = {
  home: {
    header: "Chatter",
    view: "roomList"
  },
  minimize: {
    chatState: "minimized"
  },
  settings: {
    view: "settings"
  },
  room: {
    view: "room"
  },
  newRoom: {
    header: "New room",
    view: "newRoom"
  }
};

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
          {data.getView()}
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
      subscribedRooms: [],
      otherRooms: []
    };
   },

  getMeteorData () {
    const chatterUsersHandle = Meteor.subscribe("chatterUsers");
    const roomsHandle = Meteor.subscribe("chatterRooms");
    const userRoomsHandle = Meteor.subscribe("chatterUserRooms");
    const subsReady = roomsHandle.ready() && userRoomsHandle.ready() && chatterUsersHandle.ready();

    let subscribedRooms = [];
    let otherRooms = [];
    let chatterUsers = [];
    let chatterUser = null;

    if (subsReady) {
      chatterUser = Chatter.User.findOne({userId: Meteor.userId()});
      chatterUsers = Chatter.User.find().fetch();
      const userRooms = Chatter.UserRoom.find({"userId": chatterUser._id}).fetch();
      const roomIds = _.pluck(userRooms, "roomId");
      subscribedRooms = Chatter.Room.find({"_id": {$in:roomIds}}, {sort: {lastActive: -1}}).fetch();
      //otherRooms = Chatter.Room.find({"_id": {$nin:roomIds}}).fetch();
      otherRooms = [];
    }

    return {
      subscribedRooms,
      otherRooms,
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
    this.setState(actions[view]);
  },

  toggleChatState() {
    this.setState({
      chatState: !this.state.chatOpen
    });
  },

  getView() {
    const views = {
      roomList: <RoomList
                  chatterUser={this.data.chatterUser}
                  subsReady={this.data.subsReady}
                  goToRoom={this.goToRoom}
                  subscribedRooms={this.data.subscribedRooms}
                  otherRooms={this.data.otherRooms}
                  setView={this.setView}
                />,
      room: <Room
              chatterUser={this.data.chatterUser}
              chatterUsers={this.data.chatterUsers}
              chatterUser={this.data.chatterUser}
              roomId={this.state.roomId}
            />,
      settings: <Settings
                  chatterUser={this.data.chatterUser}
                  roomId={this.state.roomId}
                />,
      newRoom: <NewRoom
                chatterUser={this.data.chatterUser}
                goToRoom={this.goToRoom}
              />,
      widget: <Widget />
    };
    return views[this.state.view]
  },

  render() {
    let chatHTML = getChatHTML(this);
    const isMinimized = this.state.chatState === "minimized";
    return isMinimized ? <Widget toggleChatState={this.toggleChatState} /> : chatHTML;
  }
});

export default ChatterApp;
