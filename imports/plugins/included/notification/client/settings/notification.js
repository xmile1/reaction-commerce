/* eslint-disable no-undef */
import { Template } from "meteor/templating";
import { Reaction } from "/client/api";
import { Packages } from "/lib/collections";
import { NotificationPackageConfig } from "../../lib/collections/schemas";

import "./notification.html";


Template.notificationSettings.helpers({
  NotificationPackageConfig() {
    return NotificationPackageConfig;
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
  "notification-update-form": {
    onSuccess: function () {
      Alerts.removeSeen();
      return Alerts.add("Paystack Payment Method settings saved.", "success");
    },
    onError: function (operation, error) {
      Alerts.removeSeen();
      return Alerts.add("Paystack Payment Method settings update failed. " + error, "danger");
    }
  }
});
