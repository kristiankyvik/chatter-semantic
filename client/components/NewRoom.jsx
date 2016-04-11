import React from 'react';
import ReactDOM from 'react-dom';

const NewRoom = React.createClass({

  handleSubmit(e) {
    e.preventDefault();
    form = {};
    form.name = ReactDOM.findDOMNode(this.refs.channelName).value.trim();

    const inviteesString = $("#multi-select").dropdown("get value");
    form.invitees  = (inviteesString.length === 0) ? [] : inviteesString.split(",");
    form.invitees.push(this.props.chatterUser._id);

    const that = this;
    Meteor.call("room.build", form, function(error, result){
      Meteor.call("userroom.build", form);
      that.props.goToRoom(result, form.name);
    });
  },

  componentDidMount() {
    $("#multi-select").dropdown();
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
      <div className="newRoom">
        <div className="padded">
          <form className="ui form" onSubmit={this.handleSubmit} ref="form">
            <div className="field">
              <label>
                Channel name
              </label>
              <input type="text" name="name" placeholder="Enter channel name"  ref="channelName"></input>
            </div>
            <field>
              <div id="multi-select" className="ui fluid multiple search selection dropdown">
                <input type="hidden" name="country"/>
                <i className="dropdown icon"></i>
                <input className="search" autoComplete="off" tabIndex="0"/>
                <div className="default text">Select users</div>
                <div className="menu" tabIndex="-1">
                  {users}
                </div>
              </div>
            </field>
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
