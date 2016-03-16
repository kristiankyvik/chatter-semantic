Meteor.startup(function () {
  // Use Meteor.startup to render the component after the page is ready
  React.render(<App />, document.getElementById("render-target"));
});

Template.chatter.onCreated(function () {
    Session.set("chatter-room", "Channels");
    Session.set("chatter-view", "roomList");
    Session.set("chatter-state", "open");

    Meteor.subscribe('chatterUsers', Session.get("chatter-room"));
    Meteor.subscribe('chatterRooms');
    Meteor.subscribe('chatterUserRooms');
});

Template.chatter.helpers({
    view() {
        return Session.get("chatter-view");
    },

    state(s) {
        return Session.get("chatter-state") === s;
    }
});

Template.registerHelper("session", function (key) {
    return Session.get(key);
});

Template.chatter.events({
    "click .chatter-open"() {
        Session.set("chatter-state", "open");
    }
});



