import React from 'react';
import ReactDOM from 'react-dom';

import Loader from "../components/Loader.jsx";

import {getAvatarSvg, getRelativeTime} from "../template-helpers/shared-helpers.jsx";

const AddUsers = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData () {
    const { room } = this.props;
    const userRoomHandle = Meteor.subscribe("chatterUserRooms");
    const userHandle = Meteor.subscribe("users");

    const subsReady = userRoomHandle.ready() && userHandle.ready();

    let addedUsers = [];
    let searchedUsers = [];

    if (subsReady) {
      addedUsers = _.pluck(Chatter.UserRoom.find({"roomId": room._id}).fetch(), "userId");
      const regex = new RegExp(".*" + this.state.query + ".*", "i"); // 'i' for case insensitive search
      searchedUsers = this.state.query ? Meteor.users.find({username: {$regex: regex}}).fetch() : [];
      _.each(searchedUsers, (user) => {
        if (this.data.addedUsers.indexOf(user._id) < 0) {
          user.added = false;
        } else {
          user.added = true;
        }
      });
    }

    return {
      subsReady,
      addedUsers,
      searchedUsers
    };
  },

  getInitialState: function () {
    return {
      requestingUser: false,
      users: [],
      query: ""
    };
  },

  handleChange () {
    const query = ReactDOM.findDOMNode(this.refs.query).value.trim();
    this.setState({query: query});
  },

  toggleUser (action, userId) {
    if (this.state.requestingUser) return;
    this.setState({requestingUser: true});

    const roomId = this.props.room._id;
    const options = {
      add: {
        command: "room.join",
        params: {
          invitees: [userId],
          roomId: roomId
        }
      },
      remove: {
        command: "room.leave",
        params: {
          userId: userId,
          roomId: roomId
        }
      }
    };
    Meteor.call(options[action].command, options[action].params, (error, result) => {
      this.setState({requestingUser: false});
    });
  },

  render () {
    if (!this.data.subsReady) {
      return <Loader/>;
    }

    const allUsers = this.data.searchedUsers.map( user => {
      let btnSetup = {
        action: user.added ? "remove" : "add",
        text: user.added ? "Remove" : "Add"
      };

      const loading = (user._id === this.state.requestingUser);

      const userOnline = user.status.online;
      const status = userOnline ? "user-status online" : "user-status offline";
      const lastLogin = user.status.hasOwnProperty("lastLogin") ? getRelativeTime(user.status.lastLogin.date) : "User is offline";

      return (
        <div className="item" key={user._id}>
          <div className="right floated content">
            <div
              onClick={() => this.toggleUser(btnSetup.action, user._id)}
              className={"ui button adduser-btn " + (loading ? "loading" : "")}
            >
              {btnSetup.text}
            </div>
          </div>
          <div className={status}>
          </div>
          <img
            className="ui avatar image"
            src={`data:image/png;base64,${getAvatarSvg(user._id)}`}
          />
          <div className="content">
            <a className="header">
              {user.profile.chatterNickname}
            </a>
            <div className="description">
              {lastLogin}
            </div>
          </div>
        </div>
      );
    });

    return (
      <div>
        <div className="padded addUsers scrollable">
          <div className="ui list relaxed">
            <div className="item">
              <div className="ui icon input transparent fluid">
                <input
                  autoFocus
                  type="text"
                  placeholder="Enter query to start searching..."
                  ref="query"
                  onChange={this.handleChange}
                />
                <i className="search icon"></i>
              </div>
            </div>
            <div className="ui divider"></div>
            {allUsers}
          </div>
        </div>
        <div className="btn-wrapper">
          <div
            className="ui fluid button primary"
            onClick={this.props.buttonGoTo}
          >
            {this.props.buttonMessage}
          </div>
        </div>
      </div>
    );
  }
});

export default AddUsers;


