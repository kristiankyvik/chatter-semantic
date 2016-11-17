import React from 'react';

import RoomList from "../components/RoomList.jsx";
import Settings from "../components/Settings.jsx"
import Room from "../components/Room.jsx";
import NewRoom from "../components/NewRoom.jsx";
import Profile from "../components/Profile.jsx";

const getRoomName = function(roomId) {
  let roomName = "";
  if (roomId && Chatter.Room.findOne(roomId)) {
    roomName = Chatter.Room.findOne(roomId).name;
  }
  return roomName;
};


const router = function(scope, view) {
  const states = {
    roomList: {
      header: Chatter.options.chatName,
      view: "roomList",
      roomId: null,
      component: () => <RoomList
                  subsReady={scope.data.subsReady}
                  goToRoom={scope.goToRoom}
                  activeRooms={scope.data.activeRooms}
                  archivedRooms={scope.data.archivedRooms}
                  setView={scope.setView}
                  loadMoreRooms={scope.loadMoreRooms}
                  setUserProfile={scope.setUserProfile}
                  hasSupportRoom={scope.data.hasSupportRoom}
                />
    },
    settings: {
      header: "Channel settings",
      view: "settings",
      component: () => <Settings
                  roomId={scope.state.roomId}
                  setView={scope.setView}
                />
    },
    room: {
      view: "room",
      header: getRoomName(scope.state.roomId),
      component: () => <Room
                  roomId={scope.state.roomId}
                  setUserProfile={scope.setUserProfile}
                  setView={scope.setView}
                />
    },
    newRoom: {
      header: "New channel",
      view: "newRoom",
      component: () => <NewRoom
                  goToRoom={scope.goToRoom}
                  setView={scope.setView}
                />
    },
    profile: {
      header: "Profile",
      view: "profile",
      component: () => <Profile
                  userProfile={scope.state.userProfile}
                  goToRoom={scope.goToRoom}
                  setView={scope.setView}
                />
    }
  };
  return states[view];
};

export default router;
