/* eslint-disable no-undef */

import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";

const validateComment = (comment) => {
  check(comment, Match.OptionalOrNull(String));

  // Valid
  if (comment !== "Select One") {
    return true;
  }

  // Invalid
  return {
    error: "INVALID_COMMENT",
    reason: "Select a reason for cancelling order"
  };
};

Template.coreOrderCancelOrder.onCreated(function () {
  const template = Template.instance();

  template.showCancelOrderForm = ReactiveVar(true);
  this.state = new ReactiveDict();
  template.formMessages = new ReactiveVar({});

  this.autorun(() => {
    const currentData = Template.currentData();
    const order = currentData.order;

    if (order.workflow.status === "cancelled") {
      template.showCancelOrderForm = ReactiveVar(false);
    }

    this.state.set("order", order);
  });
});

Template.coreOrderCancelOrder.events({
  "submit form[name=cancelOrderForm]"(event, template) {
    event.preventDefault();

    const commentInput = template.$(".input-comment option:selected");

    const comment = commentInput.text();
    const validatedComment = validateComment(comment);

    const templateInstance = Template.instance();
    const errors = {};

    templateInstance.formMessages.set({});

    if (validatedComment !== true) {
      errors.comment = validatedComment;
    }

    if ($.isEmptyObject(errors) === false) {
      templateInstance.formMessages.set({
        errors: errors
      });
      // prevent order cancel
      return;
    }

    const newComment = {
      body: comment,
      userId: Meteor.userId(),
      updatedAt: new Date
    };

    const state = template.state;
    const order = state.get("order");

    Alerts.alert({
      title: "Cancel this order?",
      showCancelButton: true,
      cancelButtonText: "No",
      confirmButtonText: "Yes"
    }, (confirmed) => {
      if (confirmed) {
        Meteor.call("orders/cancelOrder", order, newComment, (error) => {
          if (!error) {
            template.showCancelOrderForm.set(false);
            const amount = parseInt(order.billing[0].invoice.total, 10);
            Meteor.call("wallet/refund", amount, order.email, (err, user)=> {
              if (!err) {
                Meteor.call("notification/notify", "cancel", {
                  orderId: order._id,
                  message: `your order with id ${order._id} has been canceled`,
                  balance: parseInt(user.wallet.balance, 10),
                  amount
                }, order.userId);
              }
            });
          }
        });
      }
    });
  }
});

Template.coreOrderCancelOrder.helpers({
  showCancelOrderForm() {
    const template = Template.instance();
    return template.showCancelOrderForm.get();
  },

  messages() {
    return Template.instance().formMessages.get();
  },

  hasError(error) {
    if (error !== true && typeof error !== "undefined") {
      return "has-error has-feedback";
    }

    return false;
  }
});
