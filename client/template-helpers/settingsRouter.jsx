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
                    setSettingsView={scope.setSettingsView}
                    setView={scope.setView}
                  />
    },
    addUsers: {
      view: "addUsers",
      component: () => <AddUsers
                  room={scope.props.room}
                  setSettingsView={scope.setSettingsView}
                  buttonMessage={"Back to settings"}
                  buttonGoTo={() => scope.setSettingsView("main")}
                />
    }
  };
  return states[view];
};

export default settingsRouter;
