import React from 'react';
import ReactDOM from 'react-dom';

import Loader from "../components/Loader.jsx";
import RoomListItem from "../components/RoomListItem.jsx";

const chatterSubs = new SubsCache(-1, -1);

const RoomList = React.createClass({
  mixins: [ReactMeteorData],

  getInitialState: function () {
    return {
      chatOpen: false,
      roomId: null,
      userProfile: Meteor.userId(),
      header: Chatter.options.chatName,
      view: "roomList",
      msgNotif: 0,
      roomCount: 0,
      makingRequest: false,
      roomLimit: 3
    };
  },

  getMeteorData () {
    const userId = Meteor.userId();
    let roomListDataHandle = null;

    if (this.state.view === "roomList") {
      roomListDataHandle = chatterSubs.subscribe("roomListData", {userId, roomLimit: this.state.roomLimit});
    }

    let subsReady = _.isNull(roomListDataHandle) ? false : roomListDataHandle.ready();
    let hasSupportRoom = false;
    let allRoomIds = [];
    let allRooms = [];

    if (subsReady) {
      if (userId) {
        var tRooms = Chatter.Room.find({}, {sort: {lastActive: -1}}).fetch();
        allRooms = tRooms.map(function (room) {
          const roomId = room._id;
          const userRoom = Chatter.UserRoom.findOne({roomId});
          room.archived = userRoom.archived;
          room.unreadMsgCount = userRoom.unreadMsgCount;
          const lastMsg = Chatter.Message.findOne({roomId}, {sort: {createdAt: -1}});
          const hasLastMessage = !_.isUndefined(lastMsg);
          room.lastMsgTxt = hasLastMessage ? lastMsg.message : "no messages yet";
          room.lastMsgTimeAgo = hasLastMessage ? lastMsg.getTimeAgo() : null;
          room.lastMsgUser = hasLastMessage ? Meteor.users.findOne(lastMsg.userId) : null;
          return room;
        });


        const allUserRooms = Chatter.UserRoom.find({userId}).fetch();
        allRoomIds = _.pluck(allUserRooms, "roomId");

        hasSupportRoom = Chatter.Room.find({
          "_id": {$in: allRoomIds},
          "roomType": "support"
        }).count();
      }
    }

    return {
      subsReady,
      hasSupportRoom,
      allRoomIds,
      allRooms,
      roomListDataHandle
    };
  },

  loadMoreRooms () {
    const roomLimitState = {
      roomLimit: this.state.roomLimit + 5
    };
    this.setState(roomLimitState);
  },

  checkIfCurrentRoomExists () {
    if (!_.isNull(this.state.roomId)) {
      if (this.data.allRoomIds.indexOf(this.state.roomId) < 0) {
        this.setState({
          roomId: null
        });
      }
    }
  },

  componentWillMount () {
    if (this.props.headerText !== Chatter.options.chatName) {
      this.props.updateHeader(Chatter.options.chatName);
    }
  },

  componentDidMount () {
    $('.ui.accordion').accordion();
    Meteor.call("room.getCount", (error, response) => {
      this.setState(response);
    });
  },

  componentWillUnmount () {
    this.data.roomListDataHandle.stop();
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

  render () {
    const user = Meteor.user();

    if (_.isUndefined(user)) {
      return <Loader/>;
    }

    const { subsReady, hasSupportRoom, allRooms } = this.data;

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
        onClick={() => this.loadMoreRooms()}
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
      const roomListItemComp = <RoomListItem
                                key={room._id}
                                goToRoom={this.goToRoom}
                                goToNewRoom={this.goToNewRoom}
                                room={room}
                                router={this.props.router}
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

