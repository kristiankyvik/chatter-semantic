import React from 'react';
import ReactDOM from 'react-dom';

const MainNewRoom = React.createClass({

  handleSubmit (e) {
    e.preventDefault();
    const params = {};
    params.name = ReactDOM.findDOMNode(this.refs.channelName).value.trim();
    params.description = ReactDOM.findDOMNode(this.refs.channelDescription).value.trim();
    if (params.name.length === 0) return;
    Meteor.call("room.create", params, (error, result) => {
      if (error) {
        console.log("[CHATTER] error: ", error.error);
      } else {
        Meteor.call("room.get", result, (error, result) => {
          if (error) {
            console.log("[CHATTER] error: ", error.error);
          } else {
            this.props.setRoom(result);
            this.props.router.push(`/room/${result._id}/addusers`);
          }
        });
      }
    });
  },

  componentDidUpdate () {
    if (this.props.headerText !== "New room") {
      this.props.updateHeader("New room");
    }
  },

  componentDidMount () {
    ReactDOM.findDOMNode(this.refs.channelName).focus();

    $('.ui.form')
      .form({
        fields: {
          name: {
            identifier: 'name',
            rules: [
              {
                type: 'empty',
                prompt: 'Please enter a valid name'
              }
            ]
          }
        }
      });
  },

  render () {
    return (
      <div className="newRoom padded scrollable">
        <form className="ui form" onSubmit={this.handleSubmit} ref="form">
          <div className="field">
            <label>
              Channel name
            </label>
            <input type="text" name="name" placeholder="Enter channel name" ref="channelName"></input>
          </div>
          <div className="field">
            <label>
              Channel description
            </label>
            <input type="text" name="description" placeholder="Enter channel description" ref="channelDescription"></input>
          </div>
          <button className="ui button primary addusers-btn" type="submit" >
            Add users
          </button>
          <div className="ui error message"></div>
        </form>
      </div>
    );
  }
});

export default MainNewRoom;
