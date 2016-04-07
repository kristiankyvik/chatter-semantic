import React from 'react';

const Settings = React.createClass({

  getInitialState: function() {
    return {
      users: [],
      archived: this.props.room.archived
    };
   },

  componentDidMount() {
    const that = this;
    Meteor.call("room.users", this.props.room._id , function(error, result) {
      that.setState({users: result});
    });
    $(".ui.accordion")
      .accordion()
    ;
    $(".ui.toggle.checkbox").checkbox();
    if (this.state.archived) {
      $(".ui.toggle.checkbox").checkbox('check');
    }
  },

  componentWillUnmount() {
    Meteor.call("room.archive", this.props.room._id, this.state.archived);
  },

  toggleArchivedState() {
    this.setState({archived: !this.state.archived});
  },

  render() {
    const users = [];
    this.state.users.forEach(function(user) {
      users.push(
        <div className="item" key={user._id}>
          <img className="ui avatar image" src="http://localhost:3000/packages/jorgeer_chatter-semantic/public/images/avatar.jpg"/>
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
      <div className="padded">
        <div className="ui header">
          Settings
        </div>
        <div className="ui item">
          <div className="ui toggle checkbox" onClick={this.toggleArchivedState} >
            <input type="checkbox" value={this.state.archived} name="public" tabIndex="0" className="hidden"/>
            <label>Archive Chat</label>
          </div>
        </div>
        <div className="ui accordion">
          <div className="title">
            <i className="dropdown icon"></i>
            Users
          </div>
          <div className="content">
            <div className="ui list relaxed">
              {users}
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export default Settings;


