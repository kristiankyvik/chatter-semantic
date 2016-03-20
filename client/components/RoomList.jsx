RoomList = React.createClass({

  goToRoom(roomId, roomName) {
    this.props.goToRoom(roomId, roomName);
  },

  goToNewRoom() {
    this.props.setView("newRoom");
  },

  render() {
    var that = this;
    //var userIcon = <i className="user icon"></i>;
    var userIcon = "users";

    return (
      <div className="roomList">
        <div className="padded">
          <div className="ui header">
            Your channels
          </div>
          <div className="ui selection list divided">
            {this.props.joinedRooms.map(function(room){
              return (
                <div className="item" onClick={() => that.goToRoom(room._id, room.name)}>
                  {`(${that.props.getUserCount(room._id)} ${userIcon}) ${room.name}`}
                </div>
              );
            })}
          </div>
          <div className="ui header">
            Other channels
          </div>
          <div className="ui selection list">
            {this.props.otherRooms.map(function(room){
              return (
                <div className="item" onClick={() => that.goToRoom(room._id, room.name)}>
                  {`(${that.props.getUserCount(room._id)} ${userIcon}) ${room.name}`}
                </div>
              );
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
