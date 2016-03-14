
Template.users.helpers({
    users() {
        var userRooms = Chatter.UserRoom.find({"roomName": Session.get("chatter-room")}).fetch();
        var usernames = userRooms.map(function(userRoom) { return { "nickname" : userRoom.nickname}});
        return usernames;
    }
});


Template.userItem.events({
    "click .item"(e, t) {
        Session.set("chatter-user", t.data.nickname);
        Session.set("chatter-view", "user");
    },
});
