RoomList = React.createClass({

  goToRoom(roomId, roomName) {
    this.props.goToRoom(roomId, roomName);
  },

  goToNewRoom() {
    this.props.setView("newRoom");
  },

  render() {
    const that = this;

    const loader =  (
      <div className="ui active inverted dimmer">
        <div className="ui text loader">
          Loading messages
        </div>
      </div>
    );

    const joinedRooms = this.props.joinedRooms.map(function(room){
      return <RoomListItem getUserCount={that.props.getUserCount} goToRoom={that.goToRoom} goToNewRoom={that.goToNewRoom} room={room} />;
    });

    const otherRooms = this.props.otherRooms.map(function(room){
      return <RoomListItem getUserCount={that.props.getUserCount} goToRoom={that.goToRoom} goToNewRoom={that.goToNewRoom} room={room} />;
    });

    return (
      <div className="roomList">
        <div className="padded">
          <div className="ui header">
            Your channels
          </div>
          <div className="ui selection list celled">
            { this.props.subsReady ? joinedRooms : loader}
          </div>
          <div className="ui header">
            Other channels
          </div>
          <div className="ui selection list celled">
            { this.props.subsReady ? otherRooms : loader}
          </div>
        </div>
        <div className="ui fluid button primary newroom-btn" onClick={() => this.goToNewRoom()}>
          <i className="write icon"></i> New channel
        </div>
      </div>
    );
  }
});
