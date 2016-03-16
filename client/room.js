Template.room.onCreated(function () {
    // Inside autorun to respond to changes
    // in room
    this.autorun(() => {
        this.messagesSub = this.subscribe("chatterMessages", {
            roomName: Session.get("chatter-room"),
            messageLimit: 30
        });

        this.usersSub = this.subscribe("chatterUsers", {
            roomName: Session.get("chatter-room"),
        });
    });
});

Template.room.helpers({
    messages() {
        let haveMessages = Template.instance().messagesSub.ready();
        if (haveMessages) {
            return Chatter.Message.find({ roomName: Session.get("chatter-room") });
        }
    },

    messagesReady() {
        return Template.instance().messagesSub.ready();
    }
});
