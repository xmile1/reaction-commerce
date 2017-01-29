import { Meteor } from "meteor/meteor";
import { Orders } from "/lib/collections";
import { Accounts } from "/lib/collections";
import { Products } from "/lib/collections";

Meteor.methods({
  "analytics/getorders": function () {
    const result = Orders.find({
      "workflow.status": "coreOrderWorkflow/completed"
    }).fetch();
    return result;
  },

  "analytics/getcustomername": function (id) {
    check(id, String);
    const result = Accounts.find({
      userId: id
    }).fetch();
    return result;
  },

  "analytics/getvendour": function (id) {
    check(id, String);
    const result = Products.find({
      _id: id
    }).fetch();
    return result;
  }
});
