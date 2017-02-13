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

  "analytics/getcustomer": function (id) {
    check(id, String);
    const result = Accounts.find({
      userId: id
    }).fetch();
    return result;
  },

  "analytics/getproduct": function (id) {
    check(id, String);
    const result = Products.find({
      _id: id
    }).fetch();
    return result;
  },

  "analytics/getProductOrder": function (productId) {
    check(productId, String);
    const result = Products.findOne({
      _id: productId
    });
    if (result) {
      const query = {
        $inc: { salesCount: 1 }
      }
      Products.update({productId}, query)
    }
  }
});
