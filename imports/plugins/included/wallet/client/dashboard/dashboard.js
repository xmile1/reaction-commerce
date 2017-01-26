import { Template } from "meteor/templating";
import { Accounts } from "/lib/collections";


Template.walletDashboard.onCreated(function () {
  this.state = new ReactiveDict();
  this.state.setDefault({
    renderTemplate: "overview"
  });
});

Template.walletDashboard.helpers({
  Wallet() {
    return Accounts.findOne({_id: Meteor.userId()})
      .wallet;
  },
  showTemplate() {
    const instance = Template.instance();
    return instance.state.get("renderTemplate");
  }
});

Template.walletDashboard.events({
  "click .nav-pills li"(event, template) {
    currentTab = $(event.target).closest("li");
    currentTab.addClass("active");
    $(".nav-pills  li").not(currentTab).removeClass("active");
    template.state.set("renderTemplate", currentTab.data("template"));
  }

});
