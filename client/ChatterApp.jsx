import React from 'react';
import ReactDOM from 'react-dom';

import RoomList from "./components/RoomList.jsx";
import Settings from "./components/Settings.jsx"
import Room from "./components/Room.jsx";
import Widget from "./components/Widget.jsx";
import NewRoom from "./components/NewRoom.jsx";
import Nav from "./components/Nav.jsx";

const ChatterApp = React.createClass({
  mixins: [ReactMeteorData],

  getInitialState: function() {
    return {
      chatOpen: true,
      roomId: null,
      header: "Chatter",
      view: "roomList",
      joinedRooms: [],
      otherRooms: []
    };
   },

  getMeteorData () {
    const roomsHandle = Meteor.subscribe("chatterRooms");
    const userRoomsHandle = Meteor.subscribe("chatterUserRooms");
    const subsReady = roomsHandle.ready() && userRoomsHandle.ready();

    let joinedRooms = [];
    let otherRooms = [];

    if (subsReady) {
      const userRooms = Chatter.UserRoom.find({"userId": Meteor.userId()});
      const roomIds = userRooms.map(function(userRoom) { return userRoom.roomId });
      joinedRooms = Chatter.Room.find({"_id": {$in:roomIds}}, {sort: {lastActive: -1}}).fetch();
      otherRooms = Chatter.Room.find({"_id": {$nin:roomIds}}).fetch();
    }

    return {
      joinedRooms,
      otherRooms,
      subsReady
    }
  },

  goToRoom(roomId, roomName) {
    this.setState({
      roomId: roomId,
      view: 'room',
      header: roomName
    });
    Meteor.call("userroom.build", roomName);
    Meteor.call("userroomcount.build", Meteor.userId(), roomId);
  },

  setView(view) {
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
    this.setState(actions[view]);
  },

  toggleChatState() {
    this.setState({
      chatState: !this.state.chatOpen
    });
  },

  getView() {
    const views = {
      roomList: <RoomList subsReady={this.data.subsReady} goToRoom={this.goToRoom} joinedRooms={this.data.joinedRooms} otherRooms={this.data.otherRooms}  setView={this.setView} />,
      room: <Room roomId={this.state.roomId} />,
      settings: <Settings roomId={this.state.roomId} />,
      newRoom: <NewRoom goToRoom={this.goToRoom} />,
      widget: <Widget />
    };
    return views[this.state.view]
  },

  render() {
    let chatHTML = (
      <div className="ui right vertical wide visible sidebar chatter" id="chatter">
          <Nav view={this.state.view}  setView={this.setView} chatState={this.state.chatState} roomId={this.state.roomId} header={this.state.header}/>
          {this.getView()}
      </div>
    );
    return this.state.chatState === "minimized" ? <Widget toggleChatState={this.toggleChatState} /> : chatHTML;
    return (<div>hello!</div>);
  }
});

export default ChatterApp;
