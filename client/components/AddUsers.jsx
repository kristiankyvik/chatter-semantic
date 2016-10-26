import React from 'react';
import ReactDOM from 'react-dom';

import {getAvatarSvg} from "../template-helpers/shared-helpers.jsx";

const AddUsers = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    const { room } = this.props;
    const userRoomHandle = Meteor.subscribe("chatterUserRooms");
    const userHandle = Meteor.subscribe("users");

    const subsReady = userRoomHandle.ready();

    let messages = [];
    let users = [];


    if (subsReady && userHandle) {
     const roomUsersIds = _.pluck(Chatter.UserRoom.find({"roomId": room._id}).fetch(), "userId");
     users = Meteor.users.find().fetch();

     _.each(users, function(user) {
       if (roomUsersIds.indexOf(user._id) < 0) {
         user.added = false;
       } else {
         user.added = true;
       }
     });
    }

    return {
      users
    }
  },

  getInitialState: function() {
    return {
      query: "",
      requestingUser: false
    };
   },

  handleChange() {
    const query = ReactDOM.findDOMNode(this.refs.query).value.trim();
    this.setState({query: query});
  },

  toggleUser(action, userId) {
    if (this.state.requestingUser) return;

    this.setState({requestingUser: userId});

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

  render() {
    const allUsers = this.data.users.map( user => {
      if (user.profile.chatterNickname.indexOf(this.state.query) < 0) {return;};
      let btnSetup = {
        action: user.added ? "remove" : "add",
        text: user.added ? "Remove" : "Add"
      };

      const loading = (user._id == this.state.requestingUser);

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
          <div className={user.profile.online ? "user-status online" : "user-status offline"}>
          </div>
          <img
            className="ui avatar image"
            src={`data:image/png;base64,${getAvatarSvg(user.username)}`}
          />
          <div className="content">
            <a className="header">
              {user.profile.chatterNickname}
            </a>
            <div className="description">
              Last logged in just now.
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
                  type="text"
                  placeholder="Search..."
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


