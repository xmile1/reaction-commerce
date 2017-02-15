/* eslint-disable no-undef */
import { Template } from "meteor/templating";
import { Meteor } from "meteor/meteor";
import { WalletTransfer } from "../../lib/collections/schemas";
import * as walletApi from "../../lib/api/walletApi";
import "./transfer.html";
Template.transfer.helpers({
  WalletTransfer() {
    return WalletTransfer;
  }
});
AutoForm.addHooks("wallet-transfer-form", {
  onSubmit(doc) {
    const template = this.template;
    Meteor.call("wallet/sendFund", doc.amount, doc.payerEmail, (err, user) => {
      if (err) {
        walletApi.handlePaystackSubmitError(template, err);
        walletApi.enableButton(template, "Resend");
      } else {
        Alerts.toast(`Funds successfully sent to ${user.emails[0].address}`);
        walletApi.enableButton(template, "Transfer Now");
        this.resetForm();
        Meteor.call("notification/notify", "transfer", {
          amount: doc.amount,
          balance: user.wallet.balance,
          userTo: user.profile.addressBook[0].fullName || user.emails[0].address
        }, user._id);
      }
    });
    return false;
  }
});
