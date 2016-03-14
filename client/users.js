
Template.users.helpers({
    users() {
        return [
            { nickname: "Bob" },
            { nickname: "Olga"},
            { nickname: "Joe" },
        ]
    }
});


Template.userItem.events({
    "click .item"(e, t) {
        Session.set("chatter-user", t.data.nickname);
        Session.set("chatter-view", "user");
    },
});
