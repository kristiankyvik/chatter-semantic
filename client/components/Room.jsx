Room = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData () {
    const messagesHandle = Meteor.subscribe("chatterMessages", {
      roomId: this.props.room,
      messageLimit: 30
    });

    const usersHandle = Meteor.subscribe("chatterUsers", {
      roomId: this.props.room
    });

    const subsReady = messagesHandle.ready() && usersHandle.ready();

    let messages = [];
    let users = [];


    if (subsReady) {
      messages = Chatter.Message.find({"roomId": this.props.room}).fetch();
      users = Meteor.users.find({"roomId": this.props.room }).fetch();
    }

    return {
      messages: messages,
      users: users,
      subsReady: subsReady
    }
  },


  pushMessage(text) {
    var user = Meteor.user();
    var params = {
        message: text,
        roomId: this.props.room,
        userId: user._id,
        userNick: user.emails[0].address
    };
    Meteor.call("message.build", params);
  },

  render() {

    var messages =  (
      <div className="ui active inverted dimmer">
        <div className="ui text loader">
          Loading messages
        </div>
      </div>
    );

    if (this.data.subsReady) {
      messages = (
        this.data.messages.map(function(message){
          return (
            <div className="comment">
              <div className="content">
                <a className="author">{message.userNick}</a>
                <a className="metadata">
                  <span className="date"> message.timeAgo() </span>
                </a>
                <div className="text">
                 {message.message}
                </div>
              </div>
            </div>
          );
        })
      );
    }

    return (
      <div className="wrapper">
        <div className="room ui comments basic segment">
          {messages}
        </div>
        <Writer pushMessage={this.pushMessage}/>
      </div>
    );
  }
});

