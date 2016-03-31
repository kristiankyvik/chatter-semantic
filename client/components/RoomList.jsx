import React from 'react';

import RoomListItem from "../components/RoomListItem.jsx";

const RoomList = React.createClass({

  goToRoom(roomId, roomName) {
    this.props.goToRoom(roomId, roomName);
  },

  goToNewRoom() {
    this.props.setView("newRoom");
  },

  componentDidMount() {
    $('.ui.accordion').accordion();
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
      return <RoomListItem key={room._id} goToRoom={this.goToRoom} goToNewRoom={this.goToNewRoom} room={room} />;
    });

    const otherRoomsHTML = otherRooms.map(room => {
      return <RoomListItem key={room._id} goToRoom={this.goToRoom} goToNewRoom={this.goToNewRoom} room={room} />;
    });

    return (
      <div className="wrapper">
        <div className="roomList">
          <div className="padded">
            <div className="ui accordion">
              <div className="title active">
                <div className="ui header">
                  <i className="dropdown icon"></i>
                  Your channels <span>({joinedRooms.length})</span>
                </div>
              </div>
              <div className="content active">
                <div className="ui selection middle aligned list celled">
                  { subsReady ? joinedRoomsHTML : loaderHTML}
                </div>
              </div>
            </div>
            <div className="ui accordion">
              <div className="title">
                <div className="ui header">
                  <i className="dropdown icon"></i>
                  Other channels <span>({otherRooms.length})</span>
                </div>
              </div>
              <div className="content">
                <div className="ui selection middle aligned list celled">
                  { subsReady ? otherRoomsHTML : loaderHTML}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="ui fluid button primary newroom-btn" onClick={this.goToNewRoom}>
          <i className="write icon"></i> New channel
        </div>
      </div>
    );
  }
});

export default RoomList;

