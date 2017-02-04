import React from 'react';

const NewRoomParent = React.createClass({
  getInitialState: function () {
    return {
      room: null
    };
  },

  setRoom (room) {
    this.setState({
      room
    });
  },


  render () {
    const children = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        setRoom: this.setRoom,
        room: this.state.room,
        buttonMessage: "Go to room",
        messages: this.messages,
        buttonGoTo: _.isNull(this.state.room) ? null : `/room/${this.state.room._id}`
      });
    });
    return (
      <div>
        {children}
      </div>
    );
  }
});
export default NewRoomParent;
