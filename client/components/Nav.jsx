import React from 'react';


const Nav = React.createClass({

  getLeftIconConfig (path) {
    const leftIconConfig = {
      "/": {
        icon: "",
        nextView: "/profile"
      },
      "/room": {
        icon: "chevron left icon",
        nextView: "/"
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

    if (path.substring(0, 6) === "/room/" && path.length === 23) {
      return {
        icon: "chevron left icon",
        nextView: "/"
      };
    } else if (path.endsWith("/settings")) {
      return {
        icon: "close icon",
        nextView: path.substring( 0, 23)
      };
    } else if (path.endsWith("/addusers")) {

      return {
        icon: "close icon",
        nextView: path.slice(0, -9)
      };
    }

    return leftIconConfig[path];
  },


  getRightIconConfig (path) {
    const rightIconConfig = {
      "/": {
        icon: "setting icon",
        nextView: "/profile"
      }
    };
    return rightIconConfig[path];
  },


  setView (nextView) {
    this.props.parentProps.router.push(nextView);
  },

  render () {
    const { parentProps } = this.props;

    const path = parentProps.location.pathname;
    const leftIconHTML = (
      <a className="icon item" onClick={() => this.setView(this.getLeftIconConfig(path).nextView)}>
        <i className={this.getLeftIconConfig(path).icon}></i>
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
              {this.props.headerText}
            </span>
          </div>
        </div>
        <div className="right menu">
          <a
            className="icon item"
            onClick={()=> this.setView(this.getRightIconConfig(path).nextView)}
          >
            {path === "/" ? settingsIconHTML : null }
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
