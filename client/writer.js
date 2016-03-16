
Template.writer.events({
    "keyup textarea": function (e, tmp) {
        if (e.keyCode === 13) {

            let nick = Meteor.user();
            _.each(Chatter.options.nickProperty.split("."), (prop) => {
                nick = nick[prop];
                //console.log(nick, prop);
            });

            if (typeof nick !== "string") {
                console.log("User does not have a nick");
                return;
            }

            new Chatter.Message({
                message: tmp.find("textarea").value,
                roomName: Session.get("chatter-room"),
                userId: Meteor.userId(),
                userNick: nick
            }).save();

            tmp.find("textarea").value = "";
        }
    },
});
