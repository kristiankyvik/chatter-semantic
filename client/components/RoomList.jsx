import React from 'react';
import ReactDOM from 'react-dom';

import Loader from "../components/Loader.jsx";
import RoomListItem from "../components/RoomListItem.jsx";

const RoomList = React.createClass({

  getInitialState: function () {
    return {
      roomCount: 0,
      makingRequest: false
    };
  },

  componentWillReceiveProps (nextProps) {
    if (nextProps.subsReady) {
      Meteor.call("room.getCount", (error, response) => {
        if (this.mounted) {
          this.setState(response);
        }
      });
    }
  },

  componentWillUnmount () {
    this.mounted = false;
  },

  componentDidMount () {
    this.mounted = true;
    $('.ui.accordion').accordion();
  },

  goToRoom (id) {
    this.props.router.push("/room/" + id);
  },

  createHelpRoom () {
    if (this.props.hasSupportRoom || this.state.makingRequest ) return;

    this.setState({makingRequest: true});
    Meteor.call("help.createRoom", (error, result) => {
      if (error) {
        console.log("[CHATTER] error: ", error.error);
      } else {
        this.setState({makingRequest: false });
        this.props.router.push("/room/" + result);
      }
    });
  },

  render () {
    const user = this.props.user;

    if (_.isEmpty(user)) {
      return <Loader/>;
    }


    const { subsReady, hasSupportRoom, allRooms, loadMoreRooms } = this.props;

    const helpButton = !_.isEmpty(user.profile.supportUser);

    const newRoomBtnHTML = (
      <div className="ui icon primary button" onClick={() => this.props.router.push("/newroom") } >
        <i className="plus icon"></i> New channel
      </div>
    );

    const helpChatBtnHTML = (
      <div className="ui icon primary button" onClick={this.createHelpRoom} >
        <i className="help icon"></i> Get Help
      </div>
    );

    const loadMoreRoomsBtn = (
      <div
        className="roomListBtn"
        onClick={loadMoreRooms}
      >
        <i className="chevron down icon"></i>
        <span>Load more rooms</span>
      </div>
    );

    const newRoomBtn = (user.profile.isChatterAdmin) ? newRoomBtnHTML : null;
    const shouldShowButton = allRooms.length < this.state.roomCount ? true : false;

    const helpChatBtn = helpButton && (user.username !== "admin") && (!hasSupportRoom ) ? helpChatBtnHTML : null;

    let activeHTML = [];
    let archivedHTML = [];
    _.forEach(allRooms, (room)=> {
      if (_.isEmpty(room)) {
        return;
      }
      const roomListItemComp = <RoomListItem
                                key={room._id}
                                goToRoom={this.goToRoom}
                                goToNewRoom={this.goToNewRoom}
                                room={room}
                                goToRoom={this.goToRoom}
                              />;
      room.archived ? archivedHTML.push(roomListItemComp) : activeHTML.push(roomListItemComp);
    });

    return (
      <div>
        <div className="roomList scrollable">
          <div className="padded">
            <div className="ui accordion active-rooms">
              <div className="title active">
                <div className="ui header">
                  <i className="dropdown icon"></i>
                  Active channels <span className="count">({activeHTML.length})</span>
                </div>
              </div>
              <div className="content active">
                <div className="ui selection middle aligned list celled">
                  {subsReady ? activeHTML : <Loader/>}
                  {shouldShowButton ? loadMoreRoomsBtn : null}
                </div>
              </div>
            </div>
            <div className="ui accordion archived-rooms">
              <div className="title">
                <div className="ui header">
                  <i className="dropdown icon"></i>
                  Archived channels <span className="count">({archivedHTML.length})</span>
                </div>
              </div>
              <div className="content">
                <div className="ui selection middle aligned list celled">
                  {subsReady ? archivedHTML : <Loader/>}
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

