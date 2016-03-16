Template.newRoom.helpers({

});

Template.newRoom.events({
    "submit .newroom": function (event) {
        event.preventDefault();
        form = {};

        $.each($('.newroom').serializeArray(), function() {
            form[this.name] = this.value;
        });

        form["roomType"] = "public";

        Meteor.call("room.build", form, function(error, result){
          var roomId = result;
          Meteor.call("userroom.build", form.name);
        });

        Session.set("chatter-room", form.name);
        Session.set("chatter-view", "room");

       }

});
