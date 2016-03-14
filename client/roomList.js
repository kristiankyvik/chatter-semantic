
Template.roomList.helpers({
    rooms() {
        return [
            { name: "Help" },
            { name: "Programming"},
            { name: "Football" },
        ]
    }
});


Template.roomItem.events({
    "click .item"(e, t) {
        Session.set("chatter-room", t.data.name);
        Session.set("chatter-view", "room");

        var records = Chatter.UserRoom.find({"userId": Meteor.userId(), "roomName" : Session.get("chatter-room")}).fetch();

        if (records === undefined || records.length == 0) {
            new Chatter.UserRoom({
                roomName: Session.get("chatter-room"),
                userId: Meteor.userId()
            }).save();
        }
    },
});
