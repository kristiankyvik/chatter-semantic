import React from 'react';
import ReactDOM from 'react-dom';

const AddUsers = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData () {
    const { roomId } = this.props;
    const userRoomHandle = Meteor.subscribe("chatterUserRooms");

    const subsReady = userRoomHandle.ready();

    let messages = [];

    if (subsReady) {
     const roomUsersIds = _.pluck(Chatter.UserRoom.find({"roomId": this.props.roomId}).fetch(), "userId");
     _.each(this.props.chatterUsers, function(user) {
       if (roomUsersIds.indexOf(user._id) < 0) {
         user.added = false;
       } else {
         user.added = true;
       }
     });
    }

    return {
    }
  },

  getInitialState: function() {
    return {
      query: ""
    };
   },

  handleChange() {
    const query = ReactDOM.findDOMNode(this.refs.query).value.trim();
    this.setState({query: query});
  },

  toggleUser(action, userId) {
    const roomId = this.props.roomId;
    const options = {
      add: {
        command: "userroom.build",
        params: {
          invitees: [userId],
          roomId: roomId,
          name: "name"
        }
      },
      remove: {
        command: "userroom.remove",
        params: {
          userId: userId,
          roomId: roomId
        }
      }
    };
    Meteor.call(options[action].command, options[action].params);
  },

  render() {
    const users = this.props.chatterUsers.map( user => {
      if (user.nickname.indexOf(this.state.query) < 0) {return;};
      return (
        <div className="item" key={user._id}>
          <div className="right floated content">
            {user.added ?  <div onClick={() => this.toggleUser("remove", user._id)} className="ui button">Remove</div> : <div className="ui button" onClick={() => this.toggleUser("add", user._id)}>Add</div>}
          </div>
          <img
            className="ui avatar image"
            src="http://localhost:3000/packages/jorgeer_chatter-semantic/public/images/avatar.jpg"
          />
          <div className="content">
            <a className="header">
              {user.nickname}
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
            {users}
          </div>
        </div>
        <div className="btn-wrapper">
          <div
            className="ui fluid button primary newroom-btn"
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


