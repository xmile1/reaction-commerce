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
                walletApi.uiEnd(template, "Resubmit payment");
              } else {
                const transaction = {
                  from: "Paystack",
                  amount: res.data.amount,
                  date: new Date()
                };
                Meteor.call("wallet/fundAccount", transaction);
                Alerts.toast("Account funded");
                walletApi.uiEnd(template, "Pay Now");
                this.resetForm();
              }
            });
          }
        },
        onClose() {
          walletApi.uiEnd(template, "Pay Now");
        }
      };
      PaystackPop.setup(details).openIframe();
    });
    return false;
  }
});
