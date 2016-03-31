import React from 'react';

const Nav = React.createClass({

  setView(view) {
    this.props.setView(view);
  },

  render() {
    const iconSettings = {
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

    const iconHTML = (
      <a className="icon item" onClick={() => this.setView(iconSettings[this.props.view].nextView)}>
        <i className={iconSettings[this.props.view].icon}></i>
      </a>
    );

    return (
      <div className="ui secondary pointing menu">
        {iconHTML}
        <div className="header item">
          {this.props.header}
        </div>
        <div className="right menu">
          <a className="icon item" onClick={() => this.setView("minimize")}>
            <i className="minus icon"></i>
          </a>
          <a className="icon item" onClick={() => this.setView("settings")}>
            <i className="setting icon"></i>
          </a>
        </div>
      </div>
    );
  }
});

export default Nav;
