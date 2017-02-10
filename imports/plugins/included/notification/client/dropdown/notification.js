import { Template } from "meteor/templating";
import { Session } from "meteor/session";
import { ReactiveDict } from "meteor/reactive-dict";
import { Notifications } from "/lib/collections";
import { Accounts } from "/lib/collections";

import "./notification";


Template.notification.onCreated(function () {
  this.state = new ReactiveDict();
  this.state.setDefault({
    notifications: [],
    skip: 0
  });
});

Template.notification.helpers({
  Notifications() {
    const template = Template.instance();
    skip = template.state.get("skip");
    Meteor.call("notification/getInApp", Meteor.userId(), 3, skip, (err, notification) => {
      template.state.set("notification", notification.notifications);
    });
    return template.state.get("notification");
  },
  hasValue(array = []) {
    return array.length <= 0 ? false : true;
  }
});

Template.notification.events({
  "click .n-next"(event, template) {
    const skip = template.state.get("skip") + 3;
    template.state.set("skip", skip);
    Meteor.call("notification/getInApp", Meteor.userId(), 3, skip, (err, notification) => {
      template.state.set("notification", notification.notifications);
    });
  },

  "click .n-prev"(event, template) {
    let skip = template.state.get("skip") - 3;
    skip = skip < 0 ? 0 : skip;
    template.state.set("skip", skip);
    Meteor.call("notification/getInApp", Meteor.userId(), 3, skip, (err, notification) => {
      template.state.set("notification", notification.notifications);
    });
  }
});
