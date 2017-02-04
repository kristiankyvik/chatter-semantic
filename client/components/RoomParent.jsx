import React from 'react';

const roomSubs = new SubsCache(-1, -1);

const RoomParent = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData () {
    let messagesHandle = null;
    let roomDataHandle = null;

    const roomId = this.props.params.roomId;
    Tracker.autorun(function () {
      messagesHandle = roomSubs.subscribe("chatterMessages", {
        messageLimit: Session.get("messageLimit"),
        roomId
      });
      roomDataHandle = roomSubs.subscribe("roomData", roomId
      );
    });

    const subsReady = messagesHandle.ready() && roomDataHandle.ready();
    let users = [];
    let room = {};

    if (subsReady) {
      this.messages = Chatter.Message.find({"roomId": roomId}, {sort: {createdAt: 1}}).fetch();
      users = Meteor.users.find().fetch();
      room = Chatter.Room.find({_id: roomId}).fetch()[0];
    }

    return {
      subsReady,
      roomDataHandle,
      messagesHandle,
      users,
      room
    };
  },

  componentWillUnmount () {
    Meteor.call("room.unreadMsgCount.reset", this.props.params.roomId);
    // this.data.roomDataHandle.stop();
    // this.data.messagesHandle.stop();
    console.log("unmountinggg");
  },

  componentWillMount () {
    if (_.isEmpty(this.messages)) {
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
        buttonGoTo: `/room/${this.props.params.roomId}/settings`
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
