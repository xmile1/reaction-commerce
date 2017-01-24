/* eslint camelcase: 0 */
import { Template } from "meteor/templating";
import { WalletPayment } from "../../lib/collections/schemas";

import "./wallet.html";

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

Template.walletPaymentForm.helpers({
  WalletPayment() {
    return WalletPayment;
  }
});

AutoForm.addHooks("wallet-payment-form", {
  onSubmit(doc) {
    return false;
  }
});
