Template.nav.onCreated(function () {

});

Template.nav.helpers({
    view(v) {
        return Session.get("chatter-view") === v;
    }
});

Template.nav.events({
    "click .ui.icon.item"(e) {
        Session.set("chatter-view", "roomList");
        Session.set("chatter-room", "Channels");
    },

    "click .rooms"(e) {
        Session.set("chatter-view", "roomList");
    },

    "click .users"(e) {
        Session.set("chatter-view", "users");
    },

    "click .close"() {
        Session.set("chatter-state", "closed");
    },

    "click .settings"(e) {
        var room = Session.get("chatter-view");
        Session.set("chatter-view", "settings");
    },

    "click .minimize"() {
        Session.set("chatter-state", "minimized");
    },
});
