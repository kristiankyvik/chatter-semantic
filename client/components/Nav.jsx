import React from 'react';

const leftIconConfig = {
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
  },
  addUsers: {
    icon: "chevron left icon",
    nextView: "settings"
  }
};

const Nav = React.createClass({

  setView() {
    const settings = leftIconConfig[this.props.view];
    this.props.setView(settings.nextView);
  },

  render() {

    const leftIconHTML = (
      <a className="icon item" onClick={() => this.setView()}>
        <i className={leftIconConfig[this.props.view].icon}></i>
      </a>
    );

    const settingsIconHTML =  <i className="setting icon"></i>;

    return (
      <div className="ui secondary pointing menu">
        <div className="left menu">
          {leftIconHTML}
        </div>
        <div className="header item">
          <div className="status">
            <span key={this.props.header}>{this.props.header}</span>
          </div>
        </div>
        <div className="right menu">
          <a
            className="icon item"
            onClick={()=> this.props.setView("settings")}
          >
            {this.props.view == "room" ? settingsIconHTML : null }
          </a>
          <a
            className="icon item"
            onClick={() => this.props.setView("minimize")}
          >
            <i className="minus icon"></i>
          </a>
        </div>
      </div>
    );
  }
});

export default Nav;
