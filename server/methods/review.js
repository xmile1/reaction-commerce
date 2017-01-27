import { Products } from "/lib/collections";
import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { Reviews } from "/lib/collections";
import * as Schemas from "/lib/collections/schemas";
import * as Collections from "/lib/collections";
Meteor.methods({
  "insert/review"(review) {
    check(review, Schemas.Reviews);
    Meteor.publish("Reviews");
    Collections.Reviews.insert(review);
  }
});
