import React from 'react';

import {getAvatarSvg, getUserStatus} from "../template-helpers/shared-helpers.jsx";

const Nav = React.createClass({

  getInitialState: function () {
    return {
      nicknameChanged: false
    };
  },

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

  initializeInput (input) {
    if (input) {
      this.nicknameInput = input;
      input.focus();
      $('.ui.form').form(
        {
          fields: {
            nickname: {
              identifier: 'nickname',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter a valid nickname'
                }
              ]
            }
          }
        }
      );
    }
  },

  setView (nextView) {
    this.props.parentProps.router.push(nextView);
  },

  componentDidMount () {
    $('.user-info-toggle').popup({
      popup: $('.user-info-popup'),
      on: 'click',
      position: 'bottom center'
    });
  },

  handleSubmit (e) {
    e.preventDefault();
    const nickname = this.nicknameInput.value.trim();
    if (nickname.length === 0) return;
    Meteor.call("user.changeNickname", nickname, (error, result) => {
      if (!error) {
        this.setState({nicknameChanged: true});
      }
    });
  },

  render () {
    const { parentProps, user } = this.props;

    const path = parentProps.location.pathname;
    const leftIconHTML = (
      <a className="icon item" onClick={() => this.setView(this.getLeftIconConfig(path).nextView)}>
        <i className={this.getLeftIconConfig(path).icon}></i>
      </a>
    );


    const headerText = `${user.profile.chatterNickname}'s info`;
    const canEditNickname = Chatter.options.editableNickname;
    const {isOnline} = getUserStatus(user);

    const form = (
      <div>
        <form className="ui form" onSubmit={this.handleSubmit} ref="form">
          <div className="field">
            <label>
              Nickname
            </label>
            <input
              type="text"
              name="nickname"
              placeholder={user.profile.chatterNickname}
              ref={this.initializeInput}
            />
          </div>
          <button className="ui button primary centered" type="submit" >
            Change nickname
          </button>
          <div className="ui error message"></div>
        </form>
        <p className={this.state.nicknameChanged ? "success-msg" : "hidden"}>
          Nickname changed!
        </p>
      </div>
    );

    const tooltipHTML = (
      <div>
        <div className="item">
          <div className="image">
           <img
             className="ui circular image"
             src={`data:image/png;base64,${getAvatarSvg(user._id)}`}
           />
          </div>
          <div className="content">
            <a className="header">{headerText}</a>
            <div className="description">
             <span> you're </span> {user.profile.isChatterAdmin ? "" : "not"} an <span>admin</span>
            </div>
            <div className="extra">
              <p className={isOnline ? "success-msg" : "failure-msg"}>
                <span>you're {isOnline ? "online" : "offline"}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="item">
          {canEditNickname ? form : null}
        </div>
      </div>
    );

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
          <a className="icon item user-info-toggle">
            <i className="user icon"></i>
          </a>
          <div className="ui custom popup user-info-popup">
            {tooltipHTML}
          </div>
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
