/* eslint-disable no-undef */
import { Template } from "meteor/templating";
import { Meteor } from "meteor/meteor";
import { ReactiveDict } from "meteor/reactive-dict";
import { Reaction } from "/client/api";
import { Packages } from "/lib/collections";
import { TwilioPackageConfig } from "../../lib/collections/schemas";
import { JusibePackageConfig } from "../../lib/collections/schemas";
import { DefaultPackageConfig } from "../../lib/collections/schemas";
import { EmailNotificationPackageConfig } from "../../lib/collections/schemas";


import "./notification.html";


Template.notificationSettings.onCreated(function () {
  this.state = new ReactiveDict();
  this.state.setDefault({
    smsMethod: "twilioSettings"
  });
});

Template.notificationSettings.helpers({
  showSettings() {
    const template = Template.instance();
    return template.state.get("smsMethod");
  }
});

Template.notificationSettings.events({
  "change #smsMethod"(event, template) {
    const method = event.target.value;
    if (method.length > 1) {
      template.state.set("smsMethod", method);
    }
  }
});


Template.twilioSettings.helpers({
  TwilioPackageConfig() {
    return TwilioPackageConfig;
  },
  packageData() {
    return Packages.findOne({
      name: "notification",
      shopId: Reaction.getShopId()
    });
  }
});

Template.jusibeSettings.helpers({
  JusibePackageConfig() {
    return JusibePackageConfig;
  },
  packageData() {
    return Packages.findOne({
      name: "notification",
      shopId: Reaction.getShopId()
    });
  }
});

Template.notificationSettings.helpers({
  DefaultPackageConfig() {
    return DefaultPackageConfig;
  },
  packageData() {
    return Packages.findOne({
      name: "notification",
      shopId: Reaction.getShopId()
    });
  }
});

Template.emailNotificationSettings.helpers({
  EmailNotificationPackageConfig() {
    return EmailNotificationPackageConfig;
  },
  packageData() {
    return Packages.findOne({
      name: "notification",
      shopId: Reaction.getShopId()
    });
  }
});
// Template.paystack.helpers({
//   packageData: function () {
//     return Packages.findOne({
//       name: "notification",
//       shopId: Reaction.getShopId()
//     });
//   }
// });

// Template.paystack.events({
//   "click [data-event-action=showPaystackSettings]": function () {
//     Reaction.showActionView();
//   }
// });

AutoForm.hooks({
  "twilio-update-form": {
    onSuccess: function () {
      Meteor.call("notification/sendSms", "Wallet deposit", "you have be credited");
      Alerts.removeSeen();
      return Alerts.add("Paystack Payment Method settings saved.", "success");
    },
    onError: function (operation, error) {
      Alerts.removeSeen();
      return Alerts.add("Paystack Payment Method settings update failed. " + error, "danger");
    }
  }
});

AutoForm.hooks({
  "jusibe-update-form": {
    onSuccess: function () {
      Alerts.removeSeen();
      return Alerts.add("Jusibe api settings saved", "success");
    },
    onError: function (operation, error) {
      Alerts.removeSeen();
      return Alerts.add("Jusibe api settings saved. " + error, "danger");
    }
  }
});
