/* eslint-disable consistent-return, no-unused-vars */
import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import * as Schemas from "/lib/collections/schemas";
import * as Collections from "/lib/collections";

Meteor.methods({
  "insert/review"(review) {
    check(review, Schemas.Reviews);
    Meteor.publish("Reviews");
    Collections.Reviews.insert(review);
  },

  "twitter/hashtag"(query) {
    check(query, String);
    const promise = new Promise(
      function (resolve, reject) {
        const twitt = require("twitter-node-client").Twitter;

        let config;
        if (Meteor.settings.TWITTER_KEY) {
          config = Meteor.settings.TWITTER_KEY;
        }        else {
          config = {
            consumerKey: process.env.consumerKey,
            consumerSecret: process.env.consumerSecret,
            accessToken: process.env.accessToken,
            accessTokenSecret: process.env.accessTokenSecret
          };
        }

        const success = (data) => {
          const tags = [];
          const parsedData = JSON.parse(data);
          parsedData.statuses.forEach((status)=>{
            tags.push({name: status.user.screen_name, text: status.text});
          });
          resolve(tags);
        };

        const error = (err, response, body) => {
          return ("ERROR [%s]", err);
        };
        const twit = new twitt(config);
        twit.getSearch({q: query, count: 10}, error, success);
      }
    );

    promise.then((val)=> {
      return val;
    });
    return promise;
  }
});
