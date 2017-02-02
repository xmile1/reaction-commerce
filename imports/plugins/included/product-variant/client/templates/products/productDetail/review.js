/* eslint-disable consistent-return, no-undef */
import { Template } from "meteor/templating";
import { Meteor } from "meteor/meteor";
import { Reaction } from "/client/api";
import "./review.html";
import { Reviews } from "/lib/collections";
import { Products } from "/lib/collections";

const review = {};
Template.productReview.events({
  "click .stars": () => {
    review.rating = document.querySelectorAll(".current-rating").length;
  },
  "click #send": () => {
    review.comment = document.getElementById("comment").value;
    if (review.comment === "") {
      Alerts.toast("Please enter comment", "error");
      return false;
    }
    review.productId = Products.findOne()._id;
    try {
      review.username = Meteor.user().username || Meteor.user().emails[0].address;
      Meteor.call("insert/review", review, function (error) {
        if (error) {
          return error;
        }
      });
      document.getElementById("comment").value = "";
    }    catch (error) {
      Alerts.toast("You need to sign in to post a review", "error");
    }
  }
});

Template.showReviews.helpers({
  reviews: () => {
    const productId = Products.findOne()._id;
    Meteor.subscribe("Reviews");
    return Reviews.find({productId: productId}).fetch();
  }
});

Template.showTweets.onCreated(function () {
  this.state = new ReactiveDict();
  this.state.setDefault({
    tweets: []
  });
  const productTitle = Products.findOne().title;
  const hashtag = productTitle.toLowerCase().replace(/\s*/g, "");
  Meteor.call("twitter/hashtag", `${hashtag} #${Reaction.shopName}`, (error, result) => {
    this.state.set("tweets", result);
  });
});

Template.showTweets.helpers({
  tweeter() {
    instance = Template.instance();
    return instance.state.get("tweets");
  }
});
