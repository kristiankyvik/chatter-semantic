import React from 'react';
import AddUsers from "./AddUsers.jsx";
import MainSettings from "./MainSettings.jsx";

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

const Settings = React.createClass({

  getInitialState: function() {
    return {
      archived: this.props.room ? this.props.room.archived : null,
      view: "main"
    };
   },

  componentDidMount() {
    $(".ui.accordion")
      .accordion()
    ;
    $(".ui.toggle.checkbox").checkbox();
    if (this.state.archived) {
      $(".ui.toggle.checkbox").checkbox('check');
    }
  },

  setView(view) {
    this.setState(settingsRouter(this, view));
  },

  toggleArchivedState() {
    Meteor.call("room.archive", this.props.room._id, !this.state.archived);
    this.setState({archived: !this.state.archived});
  },

  render() {
    return settingsRouter(this, this.state.view).component;
  }
});

export default Settings;
