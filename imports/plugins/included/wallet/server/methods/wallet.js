import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import * as Collections from "/lib/collections";
import * as Schemas from "/lib/collections/schemas";

Meteor.methods({
   /**
   * wallet/fundAccount
   * @description funds user wallet account and creates
   * a transaction history
   * @param {Object} transaction - details to be saved
   * @return {Object} returns the transaction details
   */
  "wallet/fundAccount"(transaction) {
    check(transaction, Schemas.Received);
    transaction.amount = transaction.amount / 100;
    const update = {
      $inc: {
        "wallet.balance": transaction.amount
      }
    };

    Collections.Accounts.update({ _id: Meteor.userId()}, update);
    Meteor.call("wallet/receivedFund", Meteor.userId(), transaction);
    return Collections.Accounts.findOne({_id: Meteor.userId()});
  },

  /**
   * wallet/receivedFund
   * @description creates a transaction history
   * for user been credited
   * @param {String} userId - recipient id
   * @param {Object} transaction - details to be saved
   * @return {void}
   */
  "wallet/receivedFund"(userId, transaction) {
    check(transaction, Schemas.Received);
    check(userId, String);
    const update = {
      $push: {
        "wallet.transactions.received": transaction
      }
    };
    Collections.Accounts.update({_id: userId}, update);
  },


  /**
   * wallet/sentFund
   * @description creates a transaction history
   * for user been debited
   * @param {String} userId - recipient id
   * @param {Object} transaction - details to be saved
   * @return {void}
   */
  "wallet/sentFund"(userId, transaction) {
    check(transaction, Schemas.Sent);
    check(userId, String);
    const update = {
      $push: {
        "wallet.transactions.sent": transaction
      }
    };
    Collections.Accounts.update({_id: userId }, update);
  },

  /**
   * wallet/withdrawFund
   * @description debits user account
   * @param {Number} amount - to be debited
   * @return {Number} amount debited
   */
  "wallet/withdrawFund"(amount) {
    check(amount, Number);
    const update = {
      $inc: {
        "wallet.balance": -amount
      }
    };
    Collections.Accounts.update({ _id: Meteor.userId()}, update);
    return amount;
  },

  /**
   * wallet/withdrawFund
   * @description debits user account
   * @param {Number} amount - to be debited
   * @param {String} email - recipient email
   * @return {Object} transaction details
   */
  "wallet/sendFund"(amount, email) {
    check(amount, Number);
    check(email, String);

    const query = {
      emails: {
        $elemMatch: {
          address: email
        }
      }
    };

    const user = Collections.Accounts.findOne(query);
    const sender = Collections.Accounts.findOne({
      _id: Meteor.userId()
    });

    if (!user) {
      throw new Meteor.Error("User with that email not found");
    } else {
      if (user._id === Meteor.userId()) {
        throw new Meteor.Error("haha! you cant send money to yourself");
      }
      const wallet = sender.wallet;
      if (wallet.balance < amount) {
        throw new Meteor.Error(`Insufficient balance ₦${wallet.balance} is all you have`);
      } else {
        const credit = {
          $inc: {
            "wallet.balance": amount
          }
        };
        const sentTransaction = {
          username: user.emails[0].address,
          amount,
          date: new Date()
        };
        const receivedTransaction = {
          from: Meteor.user().username || Meteor.user().emails[0].address,
          amount,
          date: new Date()
        };

        Meteor.call("wallet/withdrawFund", amount, () => {
          Collections.Accounts.update({_id: user._id }, credit);
          Meteor.call("wallet/sentFund", Meteor.userId(), sentTransaction);
          Meteor.call("wallet/receivedFund", user._id, receivedTransaction);
        });
        return Collections.Accounts.findOne({_id: user._id });
      }
    }
  },

  /**
   * wallet/checkout
   * @description completes user order
   * @param {String} username - name of user
   * @param {Number} amount - to be debited
   * @return {Object} transaction details
   */
  "wallet/checkout"(username, amount) {
    check(username, String);
    check(amount, Number);
    const wallet = Collections.Accounts.findOne({_id: Meteor.userId()}).wallet;
    if (wallet.balance < amount) {
      throw new Meteor.Error(`Insufficient balance $${wallet.balance} is all you have`);
    } else {
      shop = Collections.Shops.findOne();
      const shopOwnerEmail = shop.emails[0].address;
      const query = {
        emails: {
          $elemMatch: {
            address: shopOwnerEmail
          }
        }
      };

      const shopOwner = Collections.Accounts.findOne(query);

      const sentTransaction = {
        username: shop.addressBook[0].company,
        amount,
        date: new Date()
      };
      const receivedTransaction = {
        from: Meteor.user().username || Meteor.user().emails[0].address,
        amount,
        date: new Date()
      };
      const credit = {
        $inc: {
          "wallet.balance": amount
        }
      };
      Meteor.call("wallet/withdrawFund", amount);
      Collections.Accounts.update({_id: shopOwner._id }, credit);
      Meteor.call("wallet/sentFund", Meteor.userId(), sentTransaction);
      Meteor.call("wallet/receivedFund", shopOwner._id, receivedTransaction);
      return sentTransaction;
    }
  },

  "wallet/refund"(amount, email) {
    check(amount, Number);
    check(email, String);

    const query = {
      emails: {
        $elemMatch: {
          address: email
        }
      }
    };

    const user = Collections.Accounts.findOne(query);
    const shopOwner = Collections.Accounts.findOne({
      _id: Meteor.userId()
    });

    if (!user) {
      throw new Meteor.Error("User with that email not found");
    } else {
      const wallet = shopOwner.wallet;
      if (wallet.balance < amount) {
        throw new Meteor.Error(`Insufficient balance ₦${wallet.balance} is all you have`);
      } else {
        const credit = {
          $inc: {
            "wallet.balance": amount
          }
        };
        const sentTransaction = {
          username: user.emails[0].address,
          amount,
          date: new Date()
        };
        const receivedTransaction = {
          from: Meteor.user().username || Meteor.user().emails[0].address,
          amount,
          date: new Date()
        };
        Meteor.call("wallet/withdrawFund", amount, () => {
          Collections.Accounts.update({_id: user._id }, credit);
          Meteor.call("wallet/sentFund", Meteor.userId(), sentTransaction);
          Meteor.call("wallet/receivedFund", user._id, receivedTransaction);
        });
        return Collections.Accounts.findOne({_id: user._id });
      }
    }
  }
});
