import React from 'react';

const roomSubs = new SubsCache(-1, -1);

const RoomParent = React.createClass({
  mixins: [ReactMeteorData],

  getInitialState: function () {
    Session.setDefault('messageLimit', Chatter.options.messageLimit);
    return {
    };
  },

  getMeteorData () {
    let messagesHandle = null;
    let roomDataHandle = null;

    const roomId = this.props.params.roomId;
    messagesHandle = roomSubs.subscribe("chatterMessages", {
      messageLimit: Session.get("messageLimit"),
      roomId
    });
    roomDataHandle = roomSubs.subscribe("roomData", roomId
    );


    const subsReady = messagesHandle.ready() && roomDataHandle.ready();
    let users = [];
    let room = {};
    let messages = [];

    if (subsReady) {
      // When we retreive the messages we want to sort them by oldest first
      this.messages = Chatter.Message.find({"roomId": roomId}, {sort: {createdAt: -1}}).fetch().reverse();
      users = Meteor.users.find().fetch();
      room = Chatter.Room.find({_id: roomId}).fetch()[0];
    }

    return {
      subsReady,
      roomDataHandle,
      messagesHandle,
      users,
      room,
      messages
    };
  },

  componentWillUnmount () {
    this.data.roomDataHandle.stop();
    this.data.messagesHandle.stop();
  },

  componentWillMount () {
    Session.set({
      messageLimit: 50,
    });

    this.messages = [];

    if (_.isUndefined(this.messages)) {
      this.messages = [];
    }
  },

  render () {
    const children = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        room: this.data.room,
        users: this.data.users,
        subsReady: this.data.subsReady,
        buttonMessage: "Back to Settings",
        messages: this.messages,
        buttonGoTo: `/room/${this.props.params.roomId}/settings`,
        updateHeader: this.props.updateHeader,
        headerText: this.props.headerText
      });
    });

    return (
     <div>
       {children}
     </div>
    );
  }
});

export default RoomParent;
