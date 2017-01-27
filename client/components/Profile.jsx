import React from 'react';
import ReactDOM from 'react-dom';
import Loader from "../components/Loader.jsx";

import {getAvatarSvg, getUserStatus} from "../template-helpers/shared-helpers.jsx";

import {
  PROFILE_CACHE_LIMIT,
  PROFILE_EXPIRE_IN
} from "../global-variables.js";

const profileSubs = new SubsManager({
  cacheLimit: PROFILE_CACHE_LIMIT,
  expireIn: PROFILE_EXPIRE_IN
});

const Profile = React.createClass({
  mixins: [ReactMeteorData],

  getInitialState: function () {
    return {
      nicknameChanged: false
    };
  },

  getMeteorData () {
    const usersHandle = profileSubs.subscribe("users");
    const subsReady = usersHandle.ready();
    let user = null;

    if (subsReady) {
      user = Meteor.users.findOne(this.props.userProfile);
    }
    return {
      user,
      subsReady
    };
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
    if (!this.data.subsReady) {
      return <Loader/>;
    }

    const userId = this.data.user._id;
    const user = this.data.user.profile;
    const headerText = `${user.chatterNickname}'s Profile`;
    const canEditNickname = Chatter.options.editableNickname;
    const {isOnline, lastLogin} = getUserStatus(this.data.user);

    const form = (
      <div>
        <form className={this.state.nicknameChanged ? "hidden" : "ui form"} onSubmit={this.handleSubmit} ref="form">
          <div className="field">
            <label>
              Nickname
            </label>
            <input
              type="text"
              name="nickname"
              placeholder={user.chatterNickname}
              ref={this.initializeInput}
            />
          </div>
          <button className="ui button primary centered" type="submit" >
            Change nickname
          </button>
          <div className="ui error message"></div>
        </form>
        <p className={this.state.nicknameChanged ? "success-msg" : "hidden"}>
          The nickname has succesfully been updated!
        </p>
      </div>
    );

    return (
      <div className="padded profile scrollable">
        <img
          className="ui small circular centered image"
          src={`data:image/png;base64,${getAvatarSvg(this.data.user._id)}`}
        />
        <div className="ui header centered">
          {headerText}
        </div>
        <div className="sub header">
          <span>{user.chatterNickname}</span> is {user.isChatterAdmin ? "" : "not"} an <span>admin</span>.
        </div>
        <p className={isOnline ? "success-msg" : "failure-msg"}>
          <span>{lastLogin}</span>
        </p>
        {this.props.userProfile === userId && canEditNickname ? form : null}
      </div>
    );
  }
});

export default Profile;
