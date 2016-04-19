import React from 'react';
import ReactDOM from 'react-dom';

import MainNewRoom from "./MainNewRoom.jsx";
import AddUsers from "./AddUsers.jsx";

const newRoomRouter = function(scope, view) {
  const states = {
    main: {
      view: "main",
      component: <MainNewRoom
                  chatterUsers={scope.props.chatterUsers}
                  setView={scope.setView}
                  setRoomId={scope.setRoomId}
                />
    },
    addUsers: {
      view: "addUsers",
      component: <AddUsers
                  chatterUsers={scope.props.chatterUsers}
                  roomId={scope.state.roomId}
                  buttonMessage={"Go to room"}
                  buttonGoTo={ () => scope.props.goToRoom(scope.state.roomId, 'roomName')}
                />
    }
  };
  return states[view];
};



const NewRoom = React.createClass({
  getInitialState: function() {
    return {
      view: "main",
      roomId: null
    };
  },

  setRoomId(roomId) {
    this.setState({roomId: roomId});
  },

  setView(view) {
    this.setState(newRoomRouter(this, view));
  },

  render() {
    return  newRoomRouter(this, this.state.view).component;
  }
});

export default NewRoom;

