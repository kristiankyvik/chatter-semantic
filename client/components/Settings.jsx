import React from 'react';
import AddUsers from "./AddUsers.jsx";
import MainSettings from "./MainSettings.jsx";

const settingsRouter = function(scope, view) {
  const states = {
    main: {
      view: "main",
      component: <MainSettings
                    archived={scope.state.archived}
                    roomUsers={scope.data.roomUsers}
                    toggleArchivedState={scope.toggleArchivedState}
                    setView={scope.setView}
                  />
    },
    addUsers: {
      view: "addUsers",
      component: <AddUsers
                  allUsers={scope.data.allUsers}
                  room={scope.props.room}
                  setView={scope.setView}
                />
    }
  };
  return states[view];
};

const Settings = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData () {
    const userRoomsHandle = Meteor.subscribe("chatterUserRooms");
    const subsReady = userRoomsHandle.ready();

    let roomUsers = [];
    let otherUsers = [];
    let allUsers = [];

    if (subsReady) {
      const roomUsersIds = _.pluck(Chatter.UserRoom.find({"roomId": this.props.room._id}).fetch(), "userId");
      _.each(this.props.chatterUsers, function(user) {
        if (roomUsersIds.indexOf(user._id) < 0) {
          user.added = false;
          otherUsers.push(user);
        } else {
          user.added = true;
          roomUsers.push(user);
        }
      });
      allUsers = otherUsers.concat(roomUsers);
    }

    return {
      roomUsers,
      otherUsers,
      allUsers
    }
  },

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
