import React from 'react';

import { Chatter } from "meteor/hubroedu:chatter-core";

const roomSubs = new SubsCache(5, 60);

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

    if (subsReady) {
      const userId = Meteor.userId();
      // When we retreive the messages we want to sort them by oldest first
      this.messages = Chatter.Message.find({"roomId": roomId}, {sort: {createdAt: -1}}).fetch().reverse();
      this.room = Chatter.Room.find({_id: roomId}).fetch()[0];

      const userRoom = Chatter.UserRoom.find({roomId, userId}, {limit: 1}).fetch()[0];
      if (_.isEmpty(userRoom)) {
        this.props.router.push("/");
      } else {
        const isArchived = userRoom.archived;
        if (!_.isEmpty(this.room)) {
          this.room.archived = isArchived;
        }
        const userRoomsInRoom = _.pluck(Chatter.UserRoom.find({roomId}).fetch(), "userId");
        this.users = Meteor.users.find({_id: {$in: userRoomsInRoom}}, {sort: {"status.online": -1}}).fetch();
      }
    }

    return {
      subsReady,
      roomDataHandle,
      messagesHandle
    };
  },

  componentWillUnmount () {
    this.data.roomDataHandle.stop();
    this.data.messagesHandle.stop();
  },

  componentWillMount () {
    if (_.isUndefined(this.messages || this.room || this.users)) {
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
        buttonMessage: "Go to room",
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
