/* eslint camelcase: 0 */
import { Template } from "meteor/templating";
import { Random } from "meteor/random";
import { Router } from "/client/api";
import { Cart } from "/lib/collections";
import { PaystackPayment } from "../../lib/collections/schemas";
import { Packages } from "/lib/collections";
import { Reaction } from "/client/api";
import { Paystack } from "../../lib/api";
import "./paystack.html";
import "../../lib/api/paystackApi";

function uiEnd(template, buttonText) {
  template.$(":input").removeAttr("disabled");
  template.$("#btn-complete-order").text(buttonText);
  return template.$("#btn-processing").addClass("hidden");
}

paystackKeys = () => {
  const paystack = Packages.findOne({
    name: "paystack",
    shopId: Reaction.getShopId()
  });
  return {
    public: paystack.settings.publicKey,
    secret: paystack.settings.secretKey
  };
};

paymentAlert = (errorMessage) => {
  return $(".alert").removeClass("hidden").text(errorMessage);
};

hidePaymentAlert = () => {
  return $(".alert").addClass("hidden").text("");
};

handlePaystackSubmitError = (error) => {
  const serverError = error !== null ? error.message : void 0;
  if (serverError) {
    return paymentAlert("Oops! " + serverError);
  } else if (error) {
    return paymentAlert("Oops! " + error, null, 4);
  }
};

Template.paystackPaymentForm.helpers({
  PaystackPayment() {
    return PaystackPayment;
  }
});

AutoForm.addHooks("paystack-payment-form", {
  onSubmit(doc) {
    const cart = Cart.findOne();
    const amount = parseFloat(cart.cartTotal(), 10) * 100;
    const key = paystackKeys().public;
    const template = this.template;
    const details = {
      key,
      name: doc.payerName,
      email: doc.payerEmail,
      reference: Random.id(),
      amount,
      callback(response) {
        const secret = paystackKeys().secret;
        const reference = response.reference;
        if (reference) {
          Paystack.verify(reference, secret, (err, res) => {
            if (err) {
              handlePaystackSubmitError(err, "");
              uiEnd(template, "Resubmit payment");
            } else {
              const transaction = res.data;
              const paymentMethod = {
                processor: "Paystack",
                storedCard: transaction.authorization.card_type,
                method: "Paystack Payment",
                transactionId: transaction.reference,
                currency: transaction.currency,
                amount: transaction.amount,
                status: "created",
                mode: "authorize",
                createdAt: new Date(),
                transactions: []
              };
              paymentMethod.transactions.push(transaction.authorization);
              Meteor.call("cart/submitPayment", paymentMethod);
            }
          });
        }
      },
      onClose() {
        handlePaystackSubmitError(`Sorry a server error 
          occurred please retry or use a different payment system`);
        uiEnd(template, "resubmit payment");
      }
    };
    PaystackPop.setup(details).openIframe();
    return false;
  }
});




Template.paystackPaymentForm.onCreated(function () {
  this.autorun(() => {

  });
});
