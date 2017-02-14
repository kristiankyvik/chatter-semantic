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
        messages: this.messages,
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
export default NewRoomParent;
