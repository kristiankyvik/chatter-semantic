import React from 'react';
import ReactDOM from 'react-dom';
import addons from 'react/addons'


import RoomList from "./components/RoomList.jsx";
import Settings from "./components/Settings.jsx"
import Room from "./components/Room.jsx";
import Widget from "./components/Widget.jsx";
import NewRoom from "./components/NewRoom.jsx";
import Nav from "./components/Nav.jsx";


const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

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
            setTransitionType={data.setTransitionType}
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
      activeRooms: [],
      archivedRooms: [],
      transitionType: "pageSlider"
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
      chatterUsers = Chatter.User.find().fetch();
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
      header: roomName,
      transitionType: "pageSlider"
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

  setTransitionType(type) {
    this.setState({
      transitionType: type
    });
  },

  getView() {
    const views = {
      roomList: <RoomList
                  className="rl-trans"
                  key={1}
                  chatterUser={this.data.chatterUser}
                  subsReady={this.data.subsReady}
                  goToRoom={this.goToRoom}
                  activeRooms={this.data.activeRooms}
                  archivedRooms={this.data.archivedRooms}
                  setView={this.setView}
                  setTransitionType={this.setTransitionType}
                />,
      room:     <Room
                  className="r-trans"
                  key={2}
                  chatterUser={this.data.chatterUser}
                  chatterUsers={this.data.chatterUsers}
                  chatterUser={this.data.chatterUser}
                  roomId={this.state.roomId}
                />,
      settings: <Settings
                  key={3}
                  chatterUser={this.data.chatterUser}
                  room={Chatter.Room.findOne({_id: this.state.roomId})}
                />,
      newRoom:  <NewRoom
                  key={4}
                  chatterUser={this.data.chatterUser}
                  chatterUsers={this.data.chatterUsers}
                  goToRoom={this.goToRoom}
                />,
      widget:   <Widget />
    };

    return views[this.state.view]
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

