import React from 'react';
import newRoomRouter from "../template-helpers/newRoomRouter.jsx";

const NewRoom = React.createClass({
  getInitialState: function () {
    return {
      view: "main",
      room: null
    };
  },

  setRoom (room) {
    this.setState({
      room
    });
  },

  setView (view) {
    this.setState(newRoomRouter(this, view));
  },

  render () {
    return newRoomRouter(this, this.state.view).component();
  }
});

export default NewRoom;
