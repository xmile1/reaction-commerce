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
    Meteor.call("wallet/sendFund", doc.amount, doc.payerEmail, (err, transaction) => {
      if (err) {
        walletApi.handlePaystackSubmitError(template, err);
        walletApi.enableButton(template, "Resend");
      } else {
        Alerts.toast(`Funds successfully sent to ${transaction.username}`);
        walletApi.enableButton(template, "Transfer Now");
        this.resetForm();
      }
    });
    return false;
  }
});
