import React from 'react';

import RoomListItem from "../components/RoomListItem.jsx";
import Loader from "../components/Loader.jsx";

const RoomList = React.createClass({
  getInitialState: function () {
    return {
      activeShowing: false,
      archivedShowing: false,
      archivedCount: 0,
      activeCount: 0,
      makingRequest: false
    };
  },

  goToRoom (roomId, roomName) {
    this.props.goToRoom(roomId, roomName);
  },

  goToNewRoom () {
    this.props.setView("newRoom");
  },

  componentDidMount () {
    $('.ui.accordion').accordion();
    Meteor.call("room.getUnreadMsgCount", (error, response) => {
      this.setState(response);
    });

    this.props.setUserProfile(Meteor.userId());
  },

  loadMoreRooms (type) {
    const options = {
      archived: {archivedShowing: true},
      active: {activeShowing: true}
    };

    this.setState(options[type]);
    this.props.loadMoreRooms(type);
  },

  createHelpRoom () {
    if (this.props.hasSupportRoom || this.state.makingRequest ) return;

    this.setState({makingRequest: true});
    Meteor.call("help.createRoom", (error, result) => {
      if (!error) {
        this.props.goToRoom(result, "Help");
      }
      this.setState({makingRequest: false});
    });
  },

  getMoreRoomsBtn (type) {
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

  render () {
    const user = Meteor.user();
    const { subsReady, archivedRooms, activeRooms, hasSupportRoom } = this.props;

    const helpButton = !_.isEmpty(user.profile.supportUser);

    const newRoomBtnHTML = (
      <div className="ui icon primary button" onClick={this.goToNewRoom} >
        <i className="plus icon"></i> New channel
      </div>
    );

    const helpChatBtnHTML = (
      <div className="ui icon primary button" onClick={this.createHelpRoom} >
        <i className="help icon"></i> Get Help
      </div>
    );

    const newRoomBtn = (user.profile.isChatterAdmin) ? newRoomBtnHTML : null;
    const helpChatBtn = helpButton && (user.username !== "admin") && (!hasSupportRoom ) ? helpChatBtnHTML : null;

    const activeRoomsHTML = activeRooms.map(room => {
      room.archived = false;
      return <RoomListItem
              key={room._id}
              goToRoom={this.goToRoom}
              goToNewRoom={this.goToNewRoom}
              room={room}
            />;
    });

    const archivedRoomsHTML = archivedRooms.map(room => {
      room.archived = true;
      return <RoomListItem
              key={room._id}
              goToRoom={this.goToRoom}
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
                  {subsReady ? activeRoomsHTML : <Loader/>}
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
                  {subsReady ? archivedRoomsHTML : <Loader/>}
                  {this.getMoreRoomsBtn("archived")}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="btn-wrapper">
          <div>
            {helpChatBtn}{newRoomBtn}
          </div>
        </div>
      </div>
    );
  }
});

export default RoomList;
