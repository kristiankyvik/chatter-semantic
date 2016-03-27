RoomList = React.createClass({

  goToRoom(roomId, roomName) {
    this.props.goToRoom(roomId, roomName);
  },

  goToNewRoom() {
    this.props.setView("newRoom");
  },

  render() {
    const { subsReady, otherRooms, joinedRooms } = this.props;
    const loaderHTML =  (
      <div className="ui active inverted dimmer">
        <div className="ui text loader">
          Loading messages
        </div>
      </div>
    );

    const joinedRoomsHTML = joinedRooms.map(room => {
      return <RoomListItem getUserCount={this.props.getUserCount} goToRoom={this.goToRoom} goToNewRoom={this.goToNewRoom} room={room} />;
    });

    const otherRoomsHTML = otherRooms.map(room => {
      return <RoomListItem getUserCount={this.props.getUserCount} goToRoom={this.goToRoom} goToNewRoom={this.goToNewRoom} room={room} />;
    });

    return (
      <div className="roomList">
        <div className="padded">
          <div className="ui header">
            Your channels
          </div>
          <div className="ui selection list celled">
            { subsReady ? joinedRoomsHTML : loaderHTML}
          </div>
          <div className="ui header">
            Other channels
          </div>
          <div className="ui selection list celled">
            { subsReady ? otherRoomsHTML : loaderHTML}
          </div>
        </div>
        <div className="ui fluid button primary newroom-btn" onClick={() => this.goToNewRoom()}>
          <i className="write icon"></i> New channel
        </div>
      </div>
    );
  }
});
