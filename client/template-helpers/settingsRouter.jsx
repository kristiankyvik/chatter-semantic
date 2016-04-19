import React from 'react';

import AddUsers from "../components/AddUsers.jsx";
import MainSettings from "../components/MainSettings.jsx";

const settingsRouter = function(scope, view) {

  const states = {
    main: {
      view: "main",
      component: <MainSettings
                    archived={scope.state.archived}
                    roomId={scope.props.room._id}
                    chatterUsers={scope.props.chatterUsers}
                    toggleArchivedState={scope.toggleArchivedState}
                    setView={scope.setView}
                  />
    },
    addUsers: {
      view: "addUsers",
      component: <AddUsers
                  chatterUsers={scope.props.chatterUsers}
                  roomId={scope.props.room._id}
                  setView={scope.setView}
                  buttonMessage={"Back to settings"}
                  buttonGoTo={() => scope.setView("main")}
                />
    }
  };
  return states[view];
};

export default settingsRouter;
