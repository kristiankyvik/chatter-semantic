Template.nav.onCreated(function () {

});

Template.nav.helpers({

});

Template.nav.events({
    "click .rooms"(e) {
        Session.set("chatter-view", "roomList");
    },
    
    "click .users"(e) {
        Session.set("chatter-view", "users");
    },
    
    "click .close"() {
        Session.set("chatter-state", "closed");
    },
    
    "click .minimize"() {
        Session.set("chatter-state", "minimized");
    },
});