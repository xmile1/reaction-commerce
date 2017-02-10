/* eslint-disable no-undef */
import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { Random } from "meteor/random";
import { WalletPayment } from "../../lib/collections/schemas";
import { Cart } from "/lib/collections";
import * as walletApi  from "../../lib/api/walletApi";

import "./wallet.html";

Template.walletPaymentForm.helpers({
  WalletPayment() {
    return WalletPayment;
  }
});

AutoForm.addHooks("wallet-payment-form", {
  onSubmit(doc) {
    const template = this.template;
    const amount = Math.round(Cart.findOne().cartTotal());
    Meteor.call("wallet/checkout", doc.payerName, amount, (err, transaction) => {
      if (err) {
        walletApi.handlePaystackSubmitError(template, err.message);
        walletApi.enableButton(template, "Complete Order");
      } else {
        transactionId: Random.id();
        const paymentMethod = {
          processor: "Wallet",
          method: "Wallet",
          transactionId: Random.id(),
          currency: "NGN",
          amount: transaction.amount,
          status: "passed",
          mode: "authorize",
          createdAt: new Date(),
          transactions: []
        };
        paymentMethod.transactions.push(transaction);
        Meteor.call("cart/submitPayment", paymentMethod);
        Meteor.call("notification/postInApp", "checkout", `Thank you for your purchase, 
        your order is been processed`, transactionId);
        Alerts.toast("transaction completed");
      }
    });
    return false;
  }
});
