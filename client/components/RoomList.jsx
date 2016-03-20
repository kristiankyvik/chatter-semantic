RoomList = React.createClass({

  goToRoom(roomId, roomName) {
    this.props.goToRoom(roomId, roomName);
  },

  goToNewRoom() {
    this.props.setView("newRoom");
  },

  render() {
    var that = this;

    return (
      <div className="roomList">
        <div className="padded">
          <div className="ui header">
            Your channels
          </div>
          <div className="ui selection list celled">
            {this.props.joinedRooms.map(function(room){
              return <RoomListItem getUserCount={that.props.getUserCount} goToRoom={that.goToRoom} goToNewRoom={that.goToNewRoom} room={room} />;
            })}
          </div>
          <div className="ui header">
            Other channels
          </div>
          <div className="ui selection list celled">
            {this.props.otherRooms.map(function(room){
              return <RoomListItem getUserCount={that.props.getUserCount} goToRoom={that.goToRoom} goToNewRoom={that.goToNewRoom} room={room} />;
            })}
          </div>
        </div>
        <div className="ui fluid button primary newroom-btn" onClick={() => this.goToNewRoom()}>
          <i className="write icon"></i> New channel
        </div>
      </div>
    );
  }
});
