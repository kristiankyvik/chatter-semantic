import React from 'react';
import ReactDOM from 'react-dom';

const NewRoom = React.createClass({

  handleSubmit(e) {
    e.preventDefault();
    form = {};
    form.name = ReactDOM.findDOMNode(this.refs.channelName).value.trim();
    form.roomType = "public";

    var that = this;
    Meteor.call("room.build", form, function(error, result){
      var roomId = result;
      Meteor.call("userroom.build", form.name);
      that.props.goToRoom(result, form.name);
    });
  },

  render() {
    return (
      <div className="newRoom">
        <div className="padded">
          <form className="ui form" onSubmit={this.handleSubmit} ref="form">
            <div className="field">
              <label>
                Channel name
              </label>
              <input type="text" name="name" placeholder="Enter channel name"  ref="channelName"></input>
            </div>
            <button className="ui button primary" type="submit" >
              Create channel
            </button>
          </form>
        </div>
      </div>
    );
  }
});

export default NewRoom;
