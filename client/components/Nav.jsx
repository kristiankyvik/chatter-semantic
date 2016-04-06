import React from 'react';

const rightIconSettings = {
  roomList: {
    icon: "",
    nextView: "home"
  },
  room: {
    icon: "chevron left icon",
    nextView: "home"
  },
  settings: {
    icon: "close icon",
    nextView: "room"
  },
  newRoom: {
    icon: "chevron left icon",
    nextView: "home"
  }
};

const Nav = React.createClass({

  setView(view) {
    this.props.setView(view);
  },

  render() {

    const rightIconHTML = (
      <a className="icon item" onClick={() => this.setView(rightIconSettings[this.props.view].nextView)}>
        <i className={rightIconSettings[this.props.view].icon}></i>
      </a>
    );

    const settingsIconHTML = (
      <a className="icon item" onClick={() => this.setView("settings")}>
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
          <a className="icon item" onClick={() => this.setView("minimize")}>
            <i className="minus icon"></i>
          </a>
          {this.props.view == "roomList" ? null : settingsIconHTML }
        </div>
      </div>
    );
  }
});

export default Nav;
