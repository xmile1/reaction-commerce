/* eslint dot-notation: 0 */
import { expect } from "meteor/practicalmeteor:chai";
import { sinon} from "meteor/practicalmeteor:sinon";
import Fixtures from "/server/imports/fixtures";
import { Reaction } from "/server/api";
import { StaticPages } from "/lib/collections";

Fixtures();

describe("Core static pages methods", function () {
  let sandbox;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    // StaticPages = Factory.create("staticPage");
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe("Manage Static Pages", function () {
    beforeEach(function () {
      StaticPages.remove({});
    });

    it("should create new staticPage for valid input", function () {
      sandbox.stub(Meteor, "userId", () => "12345678");
      sandbox.stub(Reaction, "hasOwnerAccess", () => true);
      Meteor.call("insertPage", "title", "slug", "content", "shopId", userId, new Date());
      const newStaticPage = StaticPages.find({pageOwner: userId}).count();
      expect(newStaticPage).to.equal(1);
    });
    it("should update a staticPage with valid input", function () {
      sandbox.stub(Meteor, "userId", () => "12345678");
      sandbox.stub(Reaction, "hasOwnerAccess", () => true);
      Meteor.call("insertPage", "title", "slug", "content", "shopId", userId, new Date());
      const newStaticPage = StaticPages.find({pageOwner: userId}).fetch();
      Meteor.call("updatePage", newStaticPage._id, "newtitle", "newslug", "newcontent", shopId);
      const updatedStaticPage = StaticPages.find({pageOwner: userId}).fetch();
      expect(updatedStaticPage.title).to.equal("newtitle");
      expect(updatedStaticPage.slug).to.equal("newslug");
      expect(updatedStaticPage.content).to.equal("newcontent");
    });
    it("should delete a staticPage based on specified id", function () {
      sandbox.stub(Meteor, "userId", () => "12345678");
      sandbox.stub(Reaction, "hasOwnerAccess", () => true);
      Meteor.call("insertPage", "title", "slug", "content", "shopId", userId, new Date());
      const newStaticPage = StaticPages.find({pageOwner: userId}).fetch();
      Meteor.call("deletePage", newStaticPage._id);
      const deletedStaticPage = StaticPages.find({id: newStaticPage._id}).fetch();
      expect(deletedStaticPage).to.equal([]);
    });
  });
});
