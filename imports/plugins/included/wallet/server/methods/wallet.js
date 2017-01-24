import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import _ from "lodash";
import * as Collections from "/lib/collections";
import * as Schemas from "/lib/collections/schemas";
import { Logger, Reaction } from "/server/api";



Meteor.methods({

  "wallet/fundAccount"(transaction) {
    // check(transaction, Collections.Transactions);
    check(transaction, Schemas.Received);

    const update = {
      $inc: {
        "wallet.balance": transaction.amount
      }
    };

    Collections.Accounts.update({ _id: Meteor.userId()}, update);
    Meteor.call("wallet/receiveFund", Meteor.userId(), transaction);
    return transaction;
  },

  "wallet/receiveFund"(user, transaction) {
    check(transaction, Schemas.Received);
    check(user, String);
    const update = {
      $push: {
        "wallet.transactions.received": transaction
      }
    };

    Collections.Accounts.update({_id: user}, update);
  },

  "wallet/sentFund"(user, transaction) {
    check(transaction, Schemas.Sent);
    check(user, String);

    const update = {
      $push: {
        "wallet.transactions.sent": transaction
      }
    };

    Collections.Accounts.update({username: user }, update);
  },

  "wallet/withdrawFund"(amount) {
    check(amount, Number);
    const update = {
      $inc: {
        "wallet.balance": -amount
      }
    };

    Collections.Accounts.update({ _id: Meteor.userId()}, update);
    Meteor.call("wallet/receiveFund", transaction);
    return transaction;
  },

  "wallet/sendFund"(username, amount) {
    check(username, String);
    check(amount, Number);

    const credit = {
      $inc: {
        "wallet.balance": transaction.amount
      }
    };

    const debit = {
      $inc: {
        "wallet.balance": -transaction.amount
      }
    };
    Collections.Accounts.update({_id: username }, credit);
    Collections.Accounts.update({_id: Meteor.userId()}, debit);

    const sentTransaction = {
      username,
      amount,
      date: new Date()
    };

    const receivedTransaction = {
      from: Meteor.user().username,
      amount,
      date: new Date()
    };

    Meteor.call("wallet/receiveFund", username, receivedTransaction);

  }
});
