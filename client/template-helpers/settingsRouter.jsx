import React from 'react';

import AddUsers from "../components/AddUsers.jsx";
import MainSettings from "../components/MainSettings.jsx";

const settingsRouter = function(scope, view) {

  const states = {
    main: {
      view: "main",
      component: () => <MainSettings
                    archived={scope.state.archived}
                    room={scope.props.room}
                    chatterUsers={scope.props.chatterUsers}
                    chatterUser={scope.props.chatterUser}
                    setView={scope.setView}
                  />
    },
    addUsers: {
      view: "addUsers",
      component: () => <AddUsers
                  chatterUsers={scope.props.chatterUsers}
                  room={scope.props.room}
                  setView={scope.setView}
                  buttonMessage={"Back to settings"}
                  buttonGoTo={() => scope.setView("main")}
                />
    }
  };
  return states[view];
};

export default settingsRouter;
