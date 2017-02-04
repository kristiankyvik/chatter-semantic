import React from 'react';
import ReactDOM from 'react-dom';

import Loader from "../components/Loader.jsx";
import RoomListItem from "../components/RoomListItem.jsx";

import getChatHTML from "../template-helpers/getChatHTML.jsx";
import router from "../template-helpers/router.jsx";

const latestRooms = function (limit, withIds) {
  return {
    find: {"_id": {$in: withIds}},
    options: {sort: {lastActive: -1}, limit: limit}};
};

const chatterSubs = new SubsCache(-1, -1);


const RoomList2 = React.createClass({
  mixins: [ReactMeteorData],

  getInitialState: function () {
    Session.setDefault('messageLimit', Chatter.options.messageLimit);

    return {
      chatOpen: false,
      roomId: null,
      userProfile: Meteor.userId(),
      header: Chatter.options.chatName,
      view: "roomList",
      msgNotif: 0,
      activeRooms: [],
      archivedRooms: [],
      activeRoomLimit: Chatter.options.initialRoomLoad,
      archivedRoomLimit: Chatter.options.initialRoomLoad,
      activeShowing: false,
      archivedShowing: false,
      archivedCount: 0,
      activeCount: 0,
      makingRequest: false
    };
  },

  getMeteorData () {
    const userId = Meteor.userId();
    let roomListDataHandle = null;

    if (this.state.view === "roomList") {
      roomListDataHandle = chatterSubs.subscribe("roomListData", userId);
    }

    let subsReady = _.isNull(roomListDataHandle) ? false : roomListDataHandle.ready();
    let hasSupportRoom = false;
    let msgNotif = false;
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

        msgNotif = Chatter.UserRoom.find({userId: userId, unreadMsgCount: { $gt: 0 }}).fetch().length;

        hasSupportRoom = Chatter.Room.find({
          "_id": {$in: allRoomIds},
          "roomType": "support"
        }).count();
      }
    }

    return {
      subsReady,
      hasSupportRoom,
      msgNotif,
      allRoomIds,
      allRooms,
      roomListDataHandle
    };
  },

  goToRoom (roomId, roomName) {
    if (!_.isNull(this.data.roomListDataHandle)) {
      this.data.roomListDataHandle.stop();
    }
    this.setState({
      roomId: roomId,
      view: 'room',
      header: roomName
    });
  },

  setUserProfile (userId) {
    this.setState({
      userProfile: userId
    });
  },

  loadMoreRooms (type) {
    const loadOptions = {
      active: {activeRoomLimit: 100},
      archived: {archivedRoomLimit: 100}
    };
    this.setState(loadOptions[type]);
  },

  setView (view) {
    if ((view !== "roomList") && !_.isNull(this.data.roomListDataHandle)) {
      this.data.roomListDataHandle.stop();
    }
    this.setState(router(this, view));
  },

  toggleChatState () {
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

  goToNewRoom () {
    this.props.setView("newRoom");
  },

  componentDidMount () {
    $('.ui.accordion').accordion();
    // Meteor.call("room.getUnreadMsgCount", (error, response) => {
    //   this.setState(response);
    // });
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
    if (_.isUndefined(user)) {
      return <Loader/>;
    }
    console.log("props RL", Chatter.Message.find().fetch());

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

    const newRoomBtn = (user.profile.isChatterAdmin) ? newRoomBtnHTML : null;
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
                  {this.getMoreRoomsBtn("active")}
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

export default RoomList2;

