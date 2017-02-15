/* eslint-disable no-undef */
import { Template } from "meteor/templating";
import { Meteor } from  "meteor/meteor";
import { WalletFund } from "../../lib/collections/schemas";
import { Paystack } from "/imports/plugins/included/paystack/lib/api/paystack";
import * as walletApi from "../../lib/api/walletApi";
import "/imports/plugins/included/paystack/lib/api/paystackApi";
import "./dashboard.html";


Template.fund.helpers({
  WalletPayment() {
    return WalletFund;
  }
});

AutoForm.addHooks("wallet-fund-form", {
  onSubmit(doc) {
    const self = this;
    Meteor.call("paystack/getKeys", (err, keys) => {
      const amount = doc.amount * 100;
      const key = keys.public;
      const template = this.template;
      const details = {
        key,
        name: doc.payerName,
        email: doc.payerEmail,
        reference: Random.id(),
        amount,
        callback(response) {
          const secret = keys.secret;
          const reference = response.reference;
          if (reference) {
            Paystack.verify(reference, secret, (error, res) => {
              if (error) {
                walletApi.handlePaystackSubmitError(template, error);
                walletApi.enableButton(template, "Resubmit payment");
              } else {
                const transaction = {
                  from: "Paystack",
                  amount: res.data.amount,
                  date: new Date()
                };
                Meteor.call("wallet/fundAccount", transaction, (e, user) => {
                  Alerts.toast("Account funded");
                  Meteor.call("notification/notify", "wallet", {
                    transactionId: reference,
                    amount: doc.amount,
                    userId: Meteor.userId(),
                    balance: user.wallet.balance / 100,
                    message: `Your account has been funded with ${res.data.amount}`
                  });
                });
                walletApi.enableButton(template, "Pay Now");
                self.resetForm();
              }
            });
          }
        },
        onClose() {
          walletApi.enableButton(template, "Pay Now");
        }
      };
      try {
        PaystackPop.setup(details).openIframe();
      } catch (error) {
        walletApi.handlePaystackSubmitError(template, error);
        walletApi.enableButton(template, "Pay Now");
      }
    });
    return false;
  }
});
