import { Template } from "meteor/templating";


Template.walletDashboard.helpers({

  helloWorld() {
    return "Hello World";
  },

  showTemplate(name = "fund") {
    return name;
  }

});

Template.walletDashboard.events({


});




