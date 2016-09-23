import React from 'react';

import AddUsers from "./AddUsers.jsx";
import MainSettings from "./MainSettings.jsx";

import settingsRouter from "../template-helpers/settingsRouter.jsx";

const Settings = React.createClass({

  getInitialState: function() {
    return {
      view: "main"
    };
   },

  componentDidMount() {
    $(".ui.accordion").accordion();
  },

  setSettingsView(view) {
    this.setState(settingsRouter(this, view));
  },

  setView(view) {
    this.props.setView(view);
  },

  render() {
    return settingsRouter(this, this.state.view).component();
  }
});

export default Settings;
