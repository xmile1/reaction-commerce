/* eslint dot-notation: 0 */
/* eslint-disable no-undef */

import { expect } from "meteor/practicalmeteor:chai";
import { sinon} from "meteor/practicalmeteor:sinon";
import Fixtures from "/server/imports/fixtures";

Fixtures();

describe("Actionable Analytics methods", function () {
  let sandbox;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe("Actionable Analytics", function () {
    it("Return list of completed orders", function () {
      Meteor.call("analytics/getorders", (error, orders) => {
        expect(orders[0].workflow.status).to.equal("coreOrderWorkflow/completed");
      });
    });
    it("Should return details of a customer for a given product ID", function () {
      Meteor.call("analytics/getorders", (error, orders) => {
        Meteor.call("analytics/getcustomer", orders[0].userId, (err, customer) => {
          expect(customer.length).to.be.above(0);
          expect(customer[0].profile.addressBook[0].fullName).to.be(true);
        });
      });
    });
    it("Should return product details based on a given product ID", function () {
      Meteor.call("analytics/getorders", (error, orders) => {
        Meteor.call("analytics/getproduct", orders[0].productId, (err, product) => {
          expect(product.length).to.be.above(0);
          expect(product[0].title).to.be(true);
        });
      });
    });
  });
});
