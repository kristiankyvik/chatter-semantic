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

  render() {
    return settingsRouter(this, this.state.view).component;
  }
});

export default Settings;
