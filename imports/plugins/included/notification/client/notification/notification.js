import { Template } from "meteor/templating";
import { Session } from "meteor/session";
import moment from "moment";''
import { ReactiveDict } from "meteor/reactive-dict";
import { Notifications } from "/lib/collections";
import { Accounts } from "/lib/collections";

import "./notification";

const reRenderNotification = (template) => {
  const skip = template.state.get("skip");
  Meteor.call("notification/getInApp", Meteor.userId(), 3, skip, (err, notification) => {
    template.state.set("notification", notification.notifications);
  });
};


Template.notification.onCreated(function () {
  this.state = new ReactiveDict();
  this.state.setDefault({
    notifications: [],
    skip: 0,
    count: 0
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
  },
  getStatus(status) {
    return status ? "#f2f2f2" : "";
  },
  getUnread() {
    const template = Template.instance();
    Meteor.call("notification/getReadCount", (err, count) => {
      template.state.set("count", count);
    });
    return template.state.get("count");
  },
  getDate(date) {
    return moment(date).fromNow();
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
  },
  "click .delete-all"(event, template) {
    Meteor.call("notification/deleteAll",  ()=> {
      reRenderNotification(template);
    });
  },

  "click .notification"(event, template) {
    Meteor.call("notification/markRead", this._id, ()=> {
      reRenderNotification(template);
      Meteor.call("notification/getReadCount", (err, count) => {
        template.state.set("count", count);
      });
    });
  },

  "click .notification-delete"(event, template) {
    Meteor.call("notification/delete", this._id, () => {
      reRenderNotification(template);
    });
  }
});

