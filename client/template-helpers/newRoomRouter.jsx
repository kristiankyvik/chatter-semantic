import React from 'react';

import AddUsers from "../components/AddUsers.jsx";
import MainNewRoom from "../components/MainNewRoom.jsx";

const newRoomRouter = function(scope, view) {
  const states = {
    main: {
      view: "main",
      component: <MainNewRoom
                  chatterUsers={scope.props.chatterUsers}
                  setView={scope.setView}
                  setRoomInfo={scope.setRoomInfo}
                />
    },
    addUsers: {
      view: "addUsers",
      component: <AddUsers
                  chatterUsers={scope.props.chatterUsers}
                  roomId={scope.state.roomId}
                  buttonMessage={"Go to room"}
                  buttonGoTo={ () => scope.props.goToRoom(scope.state.roomId, scope.state.roomName)}
                />
    }
  };
  return states[view];
};

export default newRoomRouter;
