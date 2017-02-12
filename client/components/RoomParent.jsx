import React from 'react';

const roomSubs = new SubsCache(-1, -1);

const RoomParent = React.createClass({
  mixins: [ReactMeteorData],

  getInitialState: function () {
    Session.set({
      messageLimit: Chatter.options.messageLimit
    });
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
      this.users = Meteor.users.find().fetch();
      this.room = Chatter.Room.find({_id: roomId}).fetch()[0];
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
    this.messages = [];
    this.room = null;
    this.users = [];


    if (_.isUndefined(this.messages || this.room)) {
      this.messages = [];
      this.room = null;
      this.users = [];
    }
  },

  render () {
    const children = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        room: this.room,
        users: this.users,
        subsReady: this.data.subsReady,
        buttonMessage: "Back to room",
        messages: this.messages,
        buttonGoTo: `/room/${this.props.params.roomId}`,
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
