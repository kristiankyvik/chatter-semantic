
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

        Meteor.call("userroom.build", Session.get("chatter-room"), Meteor.userId());
    },
});
