/* eslint-disable no-undef */
import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { ReactiveDict } from "meteor/reactive-dict";
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
    const currentTab = $(event.target).closest("li");
    currentTab.addClass("active");
    $(".nav-pills  li").not(currentTab).removeClass("active");
    template.state.set("renderTemplate", currentTab.data("template"));
  }
});
