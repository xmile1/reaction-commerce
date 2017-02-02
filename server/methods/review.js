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
    const a1 = new Promise(
      function (resolve, reject) {
        const twitt = require("twitter-node-client").Twitter;

        const config = {
          consumerKey: "C8EuYwqGkACiMN2w0z2v8tpvN",
          consumerSecret: "DLNClQ6ZmBuhqYNRt99a1w2BKX4keHA7ARTW6FAgiBNPPyhYXt",
          accessToken: "264145054-Qjhnxk9xFlzelwgy7m2AMely0x59GO6jDwej2w2w",
          accessTokenSecret: "aOKN3smuz9mVZqOTyT75ati1kqzccoklDFfc9WJG8Crnl"
        };

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

    a1.then((val)=> {
      return val;
    });
    return a1;
  }
});
