import React from 'react';

const leftIconConfig = {
  roomList: {
    icon: "",
    nextView: "roomList"
  },
  room: {
    icon: "chevron left icon",
    nextView: "roomList"
  },
  settings: {
    icon: "close icon",
    nextView: "room"
  },
  newRoom: {
    icon: "close icon",
    nextView: "roomList"
  },
  addUsers: {
    icon: "chevron left icon",
    nextView: "settings"
  },
  profile: {
    icon: "close icon",
    nextView: "roomList"
  }
};

const Nav = React.createClass({

  setView () {
    const settings = leftIconConfig[this.props.view];
    this.props.setView(settings.nextView);
  },

  render () {
    const isRoomView = this.props.view === "room";
    const isRoomListView = this.props.view === "roomList";

    const nextView = isRoomView ? "settings" : "profile";


    const leftIconHTML = (
      <a className="icon item" onClick={() => this.setView()}>
        <i className={leftIconConfig[this.props.view].icon}></i>
      </a>
    );

    const settingsIconHTML = <i className="setting icon"></i>;

    return (
      <div className="ui secondary pointing menu">
        <div className="left menu">
          {leftIconHTML}
        </div>
        <div className="header item">
          <div className="status">
            <span key={this.props.header}>
              {this.props.header}
            </span>
          </div>
        </div>
        <div className="right menu">
          <a
            className="icon item"
            onClick={()=> this.props.setView(nextView)}
          >
            {isRoomView || isRoomListView ? settingsIconHTML : null }
          </a>
          <a
            id="chatter-close"
            className="icon item"
            onClick={() => this.props.toggleChatState()}
          >
            <i className="minus icon"></i>
          </a>
        </div>
      </div>
    );
  }
});

export default Nav;
