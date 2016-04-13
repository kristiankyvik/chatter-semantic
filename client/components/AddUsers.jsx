import React from 'react';
import ReactDOM from 'react-dom';

const AddUsers = React.createClass({
  getInitialState: function() {
    return {
      query: ""
    };
   },

  handleSubmit(e) {
   e.preventDefault();

   const form = {};
   form.name = this.props.room.name;
   form.roomId = this.props.room._id;

   const inviteesString = $("#multi-select").dropdown("get value");
   form.invitees  = (inviteesString.length === 0) ? [] : inviteesString.split(",");

   Meteor.call("userroom.build", form);
  },

  handleChange() {
    const query = ReactDOM.findDOMNode(this.refs.query).value.trim();
    this.setState({query: query});
  },

  toggleUser(action, userId) {
    const roomId = this.props.room._id;
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
    const users = this.props.allUsers.map( user => {
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
      <div className="ui list relaxed">
        <div className="item">
          <div className="ui icon input transparent fluid">
            <input type="text" placeholder="Search..." ref="query" onChange={this.handleChange}/>
            <i className="search icon"></i>
          </div>
        </div>
        <div className="ui divider"></div>
        {users}
      </div>
    );
  }
});

export default AddUsers;


