import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import * as Collections from "/lib/collections";
import { Reaction } from "/server/api";
import Twilio from "twilio";
import request from "request";
import { Logger } from "/server/api";


Meteor.methods({
  "notification/sendSms"(type, message, phoneNumber) {
    check(type, String);
    check(message, String);
    check(phoneNumber, String);
    const settings = Collections.Packages.findOne({
      name: "notification",
      shopId: Reaction.getShopId()
    }).settings;
    const notificationDetails = {
      userId: Meteor.userId(),
      type,
      message,
      settings
    };
    smsApi = settings.default;
    Meteor.call(`notification/${smsApi}`, notificationDetails, phoneNumber);
  },
  "notification/twillo"(details, number) {
    check(details, Object);
    check(number, String);
    const client = Twilio(
      details.settings.api.twillo.accSid,
      details.settings.api.twillo.authToken
    );
    client.messages.create({
      to: number,
      body: details.message,
      from: details.settings.api.twillo.phoneNumber
    }, (err, res) => {
      if (err) {
        Logger.warn("notification/twilio failure", error.message);
      } else {
        Logger.info("notification/twilio failure", res.body);
      }
    });
  },
  "notification/jusibe"(details, number) {
    check(details, Object);
    check(number, String);
    const username = details.settings.api.jusibe.publicKey;
    const password = details.settings.api.jusibe.accessToken;
    const from = details.settings.api.jusibe.phoneNumber;
    form = {
      to: number,
      from: Reaction.getShopName(),
      message: from || Reaction.getShopName()
    };
    const apiType = type => `https://jusibe.com/smsapi/${type}`;
    request.post(apiType("send_sms"), { form }, (err, res) => {
      if (res.statusCode === 200) {
        Logger.info("notification/jusibe", res.body);
      } else {
        Logger.warn("notification/jusibe", res.body);
      }
    })
    .auth(username, password, true);
  },
  "notification/postInApp"(type, message, transactionId = "") {
    check(type, String);
    check(message, String);
    check(transactionId, String);
    Collections.Notifications.insert({
      userId: Meteor.userId(),
      type,
      message
    });
    Collections.Accounts.update({_id: Meteor.userId()}, {$inc: {
      notificationCount: 1
    }});
    if (type === "checkout") {
      shopOwner = Collections.Accounts.findOne({shopId: Reaction.getShopId()});
      user = Meteor.user().username || Meteor.user().emails[0].address;
      Collections.Notifications.insert({
        userId: Meteor.userId(),
        type,
        shopOwnerMessage: `${user} just completed a transaction with id ${transactionId}`
      });
    }
  },

  "notification/getInApp"(userId, limit, skip = 0) {
    check(userId, String);
    check(limit, Number);
    check(skip, Number);
    const notifications = Collections.Notifications.find({userId}, { limit, skip}).fetch();
    return {
      notifications,
      limit
    };
  },

  "notification/deleteAll"() {
    Collections.Notifications.delete({userId: Meteor.userId()});
    return true;
  }

});
