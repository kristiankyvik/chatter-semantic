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

  getInitialState: function () {
    return {
      nicknameChanged: false
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
    const user = Meteor.user();
    if (_.isUndefined(user)) {
      return <Loader/>;
    }
    console.log(user);

    const headerText = `${user.chatterNickname}'s Profile`;
    const canEditNickname = Chatter.options.editableNickname;
    const {isOnline, lastLogin} = getUserStatus(user);

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
          src={`data:image/png;base64,${getAvatarSvg(user._id)}`}
        />
        <div className="ui header centered">
          {headerText}
        </div>
        <div className="sub header">
          <span>{user.profile.chatterNickname}</span> is {user.profile.isChatterAdmin ? "" : "not"} an <span>admin</span>.
        </div>
        <p className={isOnline ? "success-msg" : "failure-msg"}>
          <span>{lastLogin}</span>
        </p>
        {canEditNickname ? form : null}
      </div>
    );
  }
});

export default Profile;
