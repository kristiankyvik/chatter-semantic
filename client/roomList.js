Template.roomList.helpers({
    joinedRooms() {
        var userRooms = Chatter.UserRoom.find({"userId": Meteor.userId()});
        var roomIds = userRooms.map(function(userRoom) { return userRoom.roomId });
        var joinedRooms = Chatter.Room.find({"_id": {$in:roomIds}}).fetch();
        joinedRooms = joinedRooms.map(function(room){
            room["users"] = Chatter.UserRoom.find({"roomId": room._id}).fetch().length;
            return room;
        });
        return joinedRooms;
    },

    otherRooms() {
        var userRooms = Chatter.UserRoom.find({"userId": Meteor.userId()});
        var roomIds = userRooms.map(function(userRoom) { return userRoom.roomId });
        var otherRooms = Chatter.Room.find({"_id": {$nin:roomIds}}).fetch();
        otherRooms = otherRooms.map(function(room){
            room["users"] = Chatter.UserRoom.find({"roomId": room._id}).fetch().length;
            return room;
        });
        return otherRooms;
    },

    roomUsers(roomName) {
      var roomId = Chatter.Room.findOne({"name": roomName})._id;
      return Chatter.UserRoom.find({"roomId": roomId}).fetch().length;
    },

    empty() {
        return (Chatter.Room.find().fetch().length < 1);
    }
});


Template.roomList.events({
    "click .newroom-btn"(e) {
        Session.set("chatter-room", "Creating new channel");
        Session.set("chatter-view", "newRoom");
    }
});

Template.roomItem.events({
    "click .item"(e, t) {
        Session.set("chatter-room", t.data.name);
        Session.set("chatter-view", "room");
        //replace room name with roomId
        Meteor.call("userroom.build", t.data.name);
    }
});


