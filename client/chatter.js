Template.chatter.onCreated(function () {
    Session.set("chatter-room", "help");
    
    
});

Template.registerHelper("session", function (key) {
    return Session.get(key);
});