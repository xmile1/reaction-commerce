/* eslint dot-notation: 0 */
/* eslint-disable no-undef */
import { expect } from "meteor/practicalmeteor:chai";
import { sinon} from "meteor/practicalmeteor:sinon";
import Fixtures from "/server/imports/fixtures";
import { Reaction } from "/server/api";
import { Reviews } from "/lib/collections";

Fixtures();

describe("Core review methods", function () {
  let sandbox;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe("Add review to products", function () {
    beforeEach(function () {
      Reviews.remove({});
    });

    it("should create review for product", function () {
      sandbox.stub(Reaction, "hasOwnerAccess", () => true);
      const review = {productId: "23456", rating: 2, comment: "This is a comment", username: "moyosore"};
      Meteor.call("insert/review", review);
      const newReview = Reviews.find({productId: "23456"}).count();
      expect(newReview).to.equal(1);
    });
  });
});
