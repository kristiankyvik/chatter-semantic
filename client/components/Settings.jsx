import React from 'react';

import AddUsers from "./AddUsers.jsx";
import MainSettings from "./MainSettings.jsx";

import settingsRouter from "../template-helpers/settingsRouter.jsx";

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
