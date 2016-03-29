Settings = React.createClass({

  getInitialState: function() {
    return {
      users: []
    };
   },

  componentDidMount() {
    const that = this;
    Meteor.call("room.users", this.props.roomId , function(error, result){
      that.setState({users: result});
    });
    $('.ui.accordion')
      .accordion()
    ;
  },


  render() {
    const users = [];
    this.state.users.forEach(function(user) {
      users.push(
        <div className="item">
          <img className="ui avatar image" src="http://localhost:3000/packages/jorgeer_chatter-semantic/public/images/avatar.jpg"/>
          <div className="content">
            <a className="header">
              {user.userNick}
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




