import { Template } from "meteor/templating";
import { Meteor } from "meteor/meteor";
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
      alert("Please enter comment");
      return false;
    }
    review.productId = Products.findOne()._id;
    productId = Products.findOne()._id;
    try {
      review.username = Meteor.user().username || Meteor.user().emails[0].address;
      Meteor.call("insert/review", review, function (error) {
        if (error) {
          return error;
        }
      });
      document.getElementById("comment").value = "";
    }    catch (error) {
      alert("You need to sign in to post a review");
    }
  }
});

Template.showReviews.helpers({
  reviews: () => {
    productId = Products.findOne()._id;
    Meteor.subscribe("Reviews");
    return Reviews.find({productId: productId}).fetch();
  }
});
