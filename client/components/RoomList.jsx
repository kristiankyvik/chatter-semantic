import React from 'react';

import RoomListItem from "../components/RoomListItem.jsx";

const RoomList = React.createClass({
  getInitialState: function() {
    return {
      activeShowing: false,
      archivedShowing: false,
      archivedCount: 0,
      activeCount: 0
    };
   },

  goToRoom(roomId, roomName) {
    this.props.goToRoom(roomId, roomName);
  },

  goToNewRoom() {
    this.props.setView("newRoom");
  },

  componentDidMount() {
    $('.ui.accordion').accordion();
    Meteor.call("get.room.counts", (error, response) => {
      this.setState(response);
    })
  },

  loadMoreRooms(type) {
    const options = {
      archived: {archivedShowing: true},
      active: {activeShowing: true}
    };

    this.setState(options[type]);
    this.props.loadMoreRooms(type);
  },

  getMoreRoomsBtn(type) {
    const roomOpts = {
      archived: {
        showing: this.state.archivedShowing,
        count: this.state.archivedCount
      },
      active: {
        showing: this.state.activeShowing,
        count: this.state.activeCount
      }
    };

    const opts = roomOpts[type];

    if ( (opts.count > Chatter.options.initialRoomLoad) && (!opts.showing)) {
      return (
        <div
          className="roomListBtn"
          onClick={() => this.loadMoreRooms(type)}
        >
          <i className="chevron down icon"></i>
          <span>Show more</span>
        </div>
      );
    }
   return null;
  },

  render() {
    const { subsReady, archivedRooms, activeRooms, chatterUser } = this.props;
    const loaderHTML =  (
      <div className="ui active inverted dimmer">
        <div className="ui text loader">
          Loading messages
        </div>
      </div>
    );

    const newRoomBtnHTML = (
      <div className="ui fluid button primary newroom-btn" onClick={this.goToNewRoom} >
        <i className="write icon"></i> New channel
      </div>
    );

    const newRoomBtn = (chatterUser.userType === "admin") ? newRoomBtnHTML : null;

    const activeRoomsHTML = activeRooms.map(room => {
      return <RoomListItem
              key={room._id}
              goToRoom={this.goToRoom}
              chatterUser={chatterUser}
              goToNewRoom={this.goToNewRoom}
              room={room}
            />;
    });

    const archivedRoomsHTML = archivedRooms.map(room => {
      return <RoomListItem
              key={room._id}
              goToRoom={this.goToRoom}
              chatterUser={chatterUser}
              goToNewRoom={this.goToNewRoom}
              room={room}
            />;
    });

    return (
      <div>
        <div className="roomList scrollable">
          <div className="padded">
            <div className="ui accordion active-rooms">
              <div className="title active">
                <div className="ui header">
                  <i className="dropdown icon"></i>
                  Active channels <span className="count">({activeRooms.length})</span>
                </div>
              </div>
              <div className="content active">
                <div className="ui selection middle aligned list celled">
                  {subsReady ? activeRoomsHTML : loaderHTML}
                  {this.getMoreRoomsBtn("active")}
                </div>
              </div>
            </div>
            <div className="ui accordion archived-rooms">
              <div className="title">
                <div className="ui header">
                  <i className="dropdown icon"></i>
                  Archived channels <span className="count">({archivedRooms.length})</span>
                </div>
              </div>
              <div className="content">
                <div className="ui selection middle aligned list celled">
                  {subsReady ? archivedRoomsHTML : loaderHTML}
                  {this.getMoreRoomsBtn("archived")}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="btn-wrapper">
          {newRoomBtn}
        </div>
      </div>
    );
  }
});

export default RoomList;
