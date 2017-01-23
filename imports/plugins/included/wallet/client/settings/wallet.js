import { Template } from "meteor/templating";
import { Reaction } from "/client/api";
import { Packages } from "/lib/collections";
import { ExamplePackageConfig } from "../../lib/collections/schemas";

import "./wallet.html";


// Template.exampleSettings.helpers({
//   ExamplePackageConfig() {
//     return ExamplePackageConfig;
//   },
//   packageData() {
//     return Packages.findOne({
//       name: "wallet",
//       shopId: Reaction.getShopId()
//     });
//   }
// });


Template.wallet.helpers({
  packageData: function () {
    return Packages.findOne({
      name: "wallet",
      shopId: Reaction.getShopId()
    });
  }
});

Template.example.events({
  "click [data-event-action=showExampleSettings]": function () {
    Reaction.showActionView();
  }
});

AutoForm.hooks({
  "example-update-form": {
    onSuccess: function () {
      Alerts.removeSeen();
      return Alerts.add("wallet Payment Method settings saved.", "success");
    },
    onError: function (operation, error) {
      Alerts.removeSeen();
      return Alerts.add("Wallet Payment Method settings update failed. " + error, "danger");
    }
  }
});
