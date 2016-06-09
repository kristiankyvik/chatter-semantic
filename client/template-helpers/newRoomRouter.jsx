import React from 'react';

import AddUsers from "../components/AddUsers.jsx";
import MainNewRoom from "../components/MainNewRoom.jsx";

const newRoomRouter = function(scope, view) {
  const states = {
    main: {
      view: "main",
      component: () => <MainNewRoom
                  setView={scope.setView}
                  setRoom={scope.setRoom}
                />
    },
    addUsers: {
      view: "addUsers",
      component: () => <AddUsers
                  room={scope.state.room}
                  buttonMessage={"Go to room"}
                  buttonGoTo={ () => scope.props.goToRoom(scope.state.room._id, scope.state.room.name)}
                />
    }
  };
  return states[view];
};

export default newRoomRouter;
