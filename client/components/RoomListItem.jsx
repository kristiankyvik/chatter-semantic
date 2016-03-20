RoomListItem = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData () {
    const messagesHandle = Meteor.subscribe("chatterMessages", {
      roomId: this.props.room._id,
      messageLimit: 30
    });

    const usersHandle = Meteor.subscribe("chatterUsers", {
      roomId: this.props.room._id
    });

    const subsReady = messagesHandle.ready() && usersHandle.ready();

    let message = "";
    let last_user = null;


    if (subsReady) {
      var messages = Chatter.Message.find({"roomId": this.props.room._id}).fetch();
      message = messages.length > 0 ? messages[0].message : "no messages yet";
      last_user = Meteor.users.find({"_id": message.userId }).fetch();
    }

    return {
      message: message,
      last_user: last_user
    }
  },

  render() {

    return (
      <div className="item" onClick={() => this.props.goToRoom(this.props.room._id, this.props.room.name)}>
        <img className="ui avatar image" src="http://localhost:3000/packages/jorgeer_chatter-semantic/public/images/avatar.jpg" />
        <div className="content">
          <div className="header">
            <span>{this.props.room.name}</span> (<span>{this.props.getUserCount(this.props.room._id)}</span>)
          </div>
          <div className="description">
            {this.data.message}
          </div>
        </div>
      </div>
    );
  }
});



