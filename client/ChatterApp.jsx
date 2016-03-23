ChatterApp = React.createClass({
  mixins: [ReactMeteorData],

  getInitialState: function() {
     return {
        chatState: "open",
        roomId: null,
        header: "Channels",
        view: "roomList",
        joinedRooms: [],
        otherRooms: []
      };
   },

  getMeteorData () {
    const roomsHandle = Meteor.subscribe("chatterRooms");
    const userRoomsHandle = Meteor.subscribe("chatterUserRooms");
    const subsReady = roomsHandle.ready() && userRoomsHandle.ready();

    let joinedRooms = [];
    let otherRooms = [];

    if (subsReady) {
      var userRooms = Chatter.UserRoom.find({"userId": Meteor.userId()});
      var roomIds = userRooms.map(function(userRoom) { return userRoom.roomId });
      joinedRooms = Chatter.Room.find({"_id": {$in:roomIds}}).fetch();
      otherRooms = Chatter.Room.find({"_id": {$nin:roomIds}}).fetch();
    }

    return {
      joinedRooms,
      otherRooms,
      subsReady
    }
  },

  goToRoom(roomId, roomName) {
    this.setState({
      roomId: roomId,
      view: 'room',
      header: roomName
    });
    Meteor.call("userroom.build", roomName);
  },

  setView(view) {
    this.setState({
      view: view
    });
  },

  getView() {
    var view =  this.state.view;
    if (view == "roomList") {
      return <RoomList subsReady={this.data.subsReady} goToRoom={this.goToRoom} joinedRooms={this.data.joinedRooms} otherRooms={this.data.otherRooms} getUserCount={this.getUserCount} setView={this.setView}/>;
    } else if ( view == "room") {
      return <Room roomId={this.state.roomId}/>
    } else if ( view == "settings") {
      return <Settings roomId={this.state.roomId}/>
    } else if ( view == "newRoom") {
      return <NewRoom goToRoom={this.goToRoom} />
    }  else {
      return (<div>Nothing much!</div>)
    }
  },

  doNavAction(action) {
    switch (action) {
      case "home":
        this.setState({
          header: "Channels",
          view: "roomList"
        });
        break;
      case "minimize":
        this.setState({
          chatState: "minimized",
          header: "Channels",
          view: "roomList"
        });
        break;
      case "settings":
        this.setState({
          view: "settings"
        });
        break;
      default:
        break;
    }
  },

  getUserCount(roomId) {
    return parseInt(Chatter.UserRoom.find({"roomId": roomId}).fetch().length);
  },

  render() {
    return (
      <div className="ui right vertical wide visible sidebar chatter" id="chatter">
          <Nav chatState={this.state.chatState} roomId={this.state.roomId} header={this.state.header} doNavAction={this.doNavAction} />
          {this.getView()}
      </div>

    );
  }
});
