import { Meteor } from  "meteor/meteor";
import { WalletPayment } from "../../lib/collections/schemas";
import { Paystack } from "/imports/plugins/included/paystack/lib/api/paystack";
import * as Collections from "/lib/collections";
import { Packages } from "/lib/collections";
import { Reaction } from "/client/api";
import "/imports/plugins/included/paystack/lib/api/paystackApi";
import "./dashboard.html";


Template.fund.helpers({
  WalletPayment() {
    return WalletPayment;
  }
});

function uiEnd(template, buttonText) {
  template.$(":input").removeAttr("disabled");
  template.$("#btn-complete-order").text(buttonText);
  return template.$("#btn-processing").addClass("hidden");
}

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


AutoForm.addHooks("wallet-payment-form", {
  onSubmit(doc) {
    const amount = doc.amount;
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
              handlePaystackSubmitError(err);
              uiEnd(template, "Resubmit payment");
            } else {
              const transaction = {
                from: "Paystack",
                amount: res.data.amount,
                date: new Date()
              };
              Meteor.call("wallet/fundAccount", transaction);
              Alerts.alert("Alert Title", "Alert Message");
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
