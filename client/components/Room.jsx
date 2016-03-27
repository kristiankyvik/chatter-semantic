Room = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData () {
    const messagesHandle = Meteor.subscribe("chatterMessages", {
      roomId: this.props.roomId,
      messageLimit: 30
    });

    const usersHandle = Meteor.subscribe("chatterUsers", {
      roomId: this.props.roomId
    });

    const subsReady = messagesHandle.ready() && usersHandle.ready();

    let messages = [];
    let users = [];


    if (subsReady) {
      messages = Chatter.Message.find({"roomId": this.props.roomId}).fetch();
      users = Meteor.users.find({"roomId": this.props.roomId }).fetch();
    }

    return {
      messages,
      users,
      subsReady
    }
  },


  pushMessage(text) {
    const user = Meteor.user();
    const params = {
        message: text,
        roomId: this.props.roomId,
        userId: user._id,
        userNick: user.emails[0].address
    };
    Meteor.call("message.build", params);
  },

  render() {

    const loader =  (
      <div className="ui active inverted dimmer">
        <div className="ui text loader">
          Loading messages
        </div>
      </div>
    );

    const messages = (
      this.data.messages.map(function(message){
        return (
          <div className={ Meteor.userId() === message.userId ? "comment yours" : "comment"}>
            <a className="avatar">
              <img src="http://localhost:3000/packages/jorgeer_chatter-semantic/public/images/avatar.jpg" />
            </a>
            <div className="content">
              <a className="author">{message.userNick}</a>
              <a className="metadata">
                <span className="date"> {message.timeAgo()} </span>
              </a>
              <div className="text">
               {message.message}
              </div>
            </div>
          </div>
        );
      })
    );

    return (
      <div className="wrapper">
        <div className="room ui comments basic padded">
          {this.data.subsReady ? messages : loader}
        </div>
        <Writer pushMessage={this.pushMessage}/>
      </div>
    );
  }
});



