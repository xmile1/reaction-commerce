import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import SSR from "meteor/meteorhacks:ssr";
import * as Collections from "/lib/collections";
import { Reaction } from "/server/api";
import Twilio from "twilio";
import request from "request";
import { Logger } from "/server/api";


Meteor.methods({
  "notification/sendSms"(type, message) {
    check(type, String);
    check(message, String);
    const settings = Collections.Packages.findOne({
      name: "notification",
      shopId: Reaction.getShopId()
    }).settings;
    const user = Collections.Accounts.findOne({ _id: Meteor.userId()});
    const profile = user.profile.addressBook[0];
    if (profile.phone) {
      const notificationDetails = {
        userId: Meteor.userId(),
        type,
        message,
        settings,
        number: `+234${profile.phone}`
      };
      smsApi = settings.default;
      // console.log(profile, smsApi, notificationDetails);
      Meteor.call(`notification/${smsApi}`, notificationDetails);
    }

    if (type === "payment") {
      const admin = Collections.Accounts.findOne({shopId: Reaction.getShopId()});
      const adminNo = admin.profile.addressBook[0].phone;
      const username = profile.fullName || user.emails[0].address;
      if (adminNo) {
        const adminNotification = {
          checkout,
          message: `An order was made by ${username}, it's waiting your approval`,
          settings,
          adminNo
        };
        // console.log(adminNotification);
        Meteor.call(`notification/${smsApi}`, adminNotification);
      }
    }
  },
  "notification/twilio"(details) {
    check(details, Object);
    // console.log(details.settings.api);
    const client = Twilio(
      details.settings.api.twilio.accSid,
      details.settings.api.twilio.authToken
    );
    client.messages.create({
      to: details.number,
      body: details.message,
      from: details.settings.api.twilio.phoneNumber
    }, (err, res) => {
      if (err) {
        Logger.warn("notification/twilio failure", err);
      } else {
        Logger.info("notification/twilio failure", res.body);
      }
    });
  },
  "notification/jusibe"(details) {
    check(details, Object);
    const username = details.settings.api.jusibe.publicKey;
    const password = details.settings.api.jusibe.accessToken;
    const from = details.settings.api.jusibe.phoneNumber;
    form = {
      to: details.number,
      from: from || Reaction.getShopName(),
      message: details.message
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
    const userId = Meteor.userId();
    Collections.Notifications.insert({
      userId,
      type,
      read: false,
      message,
      createdAt: new Date()
    });

    let  notificationCount = 1;

    if (type === "payment") {
      shopOwner = Collections.Accounts.findOne({shopId: Reaction.getShopId()});
      user = Meteor.user().username || Meteor.user().emails[0].address;
      Collections.Notifications.insert({
        userId: shopOwner._id,
        type,
        read: false,
        message: `${user} just completed an order with id ${transactionId}`,
        createdAt: new Date()
      });
      notificationCount++;
    }
    Collections.Accounts.update({_id: Meteor.userId()}, {$inc: {
      notificationCount
    }});
  },

  "notification/getInApp"(userId, limit, skip = 0) {
    check(userId, String);
    check(limit, Number);
    check(skip, Number);
    const notifications = Collections.Notifications.find({userId}, { limit, skip, sort: {createdAt: -1 }}).fetch();
    return {
      notifications,
      limit
    };
  },

  "notification/deleteAll"() {
    Collections.Notifications.remove({userId: Meteor.userId()});
    return true;
  },

  "notification/delete"(notificationId) {
    check(notificationId, String);
    Collections.Notifications.remove({_id: notificationId});
    return true;
  },

  "notification/markRead"(notificationId) {
    check(notificationId, String);
    Collections.Notifications.update({_id: notificationId}, { $set: {
      read: true
    }});
    return true;
  },

  "notification/getReadCount"() {
    return Collections.Notifications.find({userId: Meteor.userId(), read: false})
      .count();
  },

  "notification/email"() {
    // Fs.readFile("./template.html", function (err, html) {
    //   if (err) throw err;
    //   const template = _.template(html.toString());

    //   cb(err, template(model));
    // });
  }

});
