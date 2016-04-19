import React from 'react';
import ReactDOM from 'react-dom';

const MainNewRoom = React.createClass({

  handleSubmit(e) {
    e.preventDefault();
    const form = {};
    form.name = ReactDOM.findDOMNode(this.refs.channelName).value.trim();
    if (form.name.length === 0) return;
    Meteor.call("room.build", form, (error, result) => {
      Meteor.call("room.get", result, (error, result) => {
        this.props.setRoomInfo(result._id, result.name);
        this.props.setView('addUsers');
      });
    });
  },

  componentDidMount() {
    ReactDOM.findDOMNode(this.refs.channelName).focus();

    $('.ui.form')
      .form({
        fields: {
          name: {
            identifier: 'name',
            rules: [
              {
                type   : 'empty',
                prompt : 'Please enter a valid name'
              }
            ]
          }
        }
      });
  },

  render() {
    const users = this.props.chatterUsers.map(function(user) {
      return (
        <div className="item" data-value={user._id} key={user._id}>
           <img className="ui avatar image" src={user.avatar} />
          <span>{user.nickname}</span>
        </div>
      );
    });

    return (
      <div className="newRoom padded scrollable">
        <form className="ui form" onSubmit={this.handleSubmit} ref="form">
          <div className="field">
            <label>
              Channel name
            </label>
            <input type="text" name="name" placeholder="Enter channel name"  ref="channelName"></input>
          </div>
          <button className="ui button primary" type="submit" >
            Add users
          </button>
          <div className="ui error message"></div>
        </form>
      </div>
    );
  }
});

export default MainNewRoom;
