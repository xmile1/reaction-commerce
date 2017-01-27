import { Template } from "meteor/templating";
import { Meteor } from "meteor/meteor";
import "./review.html";
import { Reviews } from "/lib/collections";
import { Products } from "/lib/collections";
import { Router } from "/client/api";

console.log(Reviews);
const review = {};
Template.productReview.events({
  "click .stars": () => {
    review.rating = document.querySelectorAll(".current-rating").length;
    document.getElementById("user-rate").innerHTML = review.rating;
  },
  "click #send": () => {
    review.comment = document.getElementById("comment").value;
    review.productId = Products.findOne()._id;
    review.username = Meteor.user().username || Meteor.user().emails[0].address;
    console.log(review);
    Meteor.call("insert/review", review, function (error) {
      if (error) {
        console.log(error);
      }
    });
  }
});
