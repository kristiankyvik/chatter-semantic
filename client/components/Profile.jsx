import React from 'react';
import ReactDOM from 'react-dom';
import Loader from "../components/Loader.jsx"

const Profile = React.createClass({
  mixins: [ReactMeteorData],

  getInitialState: function() {
    return {
      nicknameChanged: false
    };
   },

  getMeteorData () {
    const usersHandle = Meteor.subscribe("users");
    let user = {};

    if (usersHandle.ready()) {
      user = Meteor.users.findOne(this.props.userProfile);
    }
    return {
      usersHandle,
      user
    }
  },

  handleSubmit(e) {
    e.preventDefault();
    const nickname = ReactDOM.findDOMNode(this.refs.nickname).value.trim();
    if (nickname.length === 0) return;
    Meteor.call("user.changeNickname", nickname, (error, result) => {
      if (!error) {
        this.setState({nicknameChanged: true})
      }
    });
  },

  componentDidMount() {
    if (this.data.usersHandle.ready() && this.props.userProfile == Meteor.userId()) {
      ReactDOM.findDOMNode(this.refs.nickname).focus();
      $('.ui.form')
        .form({
          fields: {
            nickname: {
              identifier: 'nickname',
              rules: [
                {
                  type   : 'empty',
                  prompt : 'Please enter a valid nickname'
                }
              ]
            }
          }
        });
    }
  },

  render() {
    if (!this.data.usersHandle.ready()) {
      return <Loader/>;
    }

    const user = this.data.user.profile;
    const headerText = `${user.chatterNickname}'s Profile`;
    const form = (
      <div>
        <form className={this.state.nicknameChanged ? "hidden" : "ui form"} onSubmit={this.handleSubmit} ref="form">
          <div className="field">
            <label>
              Nickname
            </label>
            <input type="text" name="nickname" placeholder={user.chatterNickname}  ref="nickname"></input>
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
        <img className="ui small circular centered image" src={user.chatterAvatar}/>
        <div className="ui header centered">
          {headerText}
        </div>
        <div class="sub header">
          <span>{user.chatterNickname}</span> is {user.isChatterAdmin ? "" : "not"} an <span>admin</span>.
        </div>
        <p className={user.online ? "success-msg" : "failure-msg"}>
          <span>{user.chatterNickname}</span> is currently {user.online ? "online" : "offline"}.
        </p>
        {this.props.userProfile == Meteor.userId() ? form : null}
      </div>
    );
  }
});

export default Profile;
