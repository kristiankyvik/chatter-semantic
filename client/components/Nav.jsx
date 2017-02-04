import React from 'react';

const getLeftIconConfig = function (path) {
  const leftIconConfig = {
    "/": {
      icon: "",
      nextView: "/profile"
    },
    "/room": {
      icon: "chevron left icon",
      nextView: "/"
    },
    "/settings": {
      icon: "close icon",
      nextView: "/room"
    },
    "/newroom": {
      icon: "close icon",
      nextView: "/"
    },
    "/newroom/addusers": {
      icon: "close icon",
      nextView: "/"
    },
    "/profile": {
      icon: "close icon",
      nextView: "/"
    }
  };

  if (path.substring(0, 6) === "/room/") {
    return {
      icon: "chevron left icon",
      nextView: "/"
    };
  }

  return leftIconConfig[path];
};


const getRightIconConfig = function (path) {
  const rightIconConfig = {
    "/": {
      icon: "setting icon",
      nextView: "/profile"
    }
  };

  if (path.substring(0, 6) === "/room/") {
    return {
      icon: "setting icon",
      nextView: path + "/settings"
    };
  }

  return rightIconConfig[path];
};

const Nav = React.createClass({

  setView (nextView) {
    console.log(nextView);
    this.props.parentProps.router.push(nextView);
  },

  render () {
    const { parentProps } = this.props;

    const path = parentProps.location.pathname;
    console.log("current path: ", path);
    console.log("current left: ", getLeftIconConfig(path));
    console.log("current right: ", getRightIconConfig(path));


    const leftIconHTML = (
      <a className="icon item" onClick={() => this.setView(getLeftIconConfig(path).nextView)}>
        <i className={getLeftIconConfig(path).icon}></i>
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
            <span>
              {Chatter.options.chatName}
            </span>
          </div>
        </div>
        <div className="right menu">
          <a
            className="icon item"
            onClick={()=> this.setView(getRightIconConfig(path).nextView)}
          >
            {path.substring(0, 6) === "/room/" || path === "/" ? settingsIconHTML : null }
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
