import React from 'react';

const rightIconSettings = {
  roomList: {
    icon: "",
    nextView: "home",
    "transitionType": "pageSlider"
  },
  room: {
    icon: "chevron left icon",
    nextView: "home",
    "transitionType": "reversePageSlider"
  },
  settings: {
    icon: "close icon",
    nextView: "room",
    "transitionType": "pageVerticalSlider"
  },
  newRoom: {
    icon: "chevron left icon",
    nextView: "home",
    "transitionType": "reversePageVerticalSlider"
  }
};

const Nav = React.createClass({

  setView() {
    const settings = rightIconSettings[this.props.view];
    this.props.setView(settings.nextView);
    this.props.setTransitionType(settings.transitionType);
  },

  render() {

    const rightIconHTML = (
      <a className="icon item" onClick={() => this.setView()}>
        <i className={rightIconSettings[this.props.view].icon}></i>
      </a>
    );

    const settingsIconHTML = (
      <a className="icon item" onClick={()=>{ this.props.setView("settings"); this.props.setTransitionType("reversePageVerticalSlider") }}>
        <i className="setting icon"></i>
      </a>
    );

    return (
      <div className="ui secondary pointing menu">
        {rightIconHTML}
        <div className="header item">
          <div className="status">
            {this.props.header}
          </div>
        </div>
        <div className="right menu">
          <a className="icon item" onClick={() => this.props.setView("minimize")}>
            <i className="minus icon"></i>
          </a>
          {this.props.view == "roomList" ? null : settingsIconHTML }
        </div>
      </div>
    );
  }
});

export default Nav;
