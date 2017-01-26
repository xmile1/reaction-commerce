import { Meteor } from "meteor/meteor";
import { expect } from "meteor/practicalmeteor:chai";
import { sinon } from "meteor/practicalmeteor:sinon";
import  { Reaction } from "/server/api";
// import { paystack } from "./paystack";

describe("Paystack", () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  });
  it("should call Paystack.methods.getKeys", () => {
    sandbox.stub(Meteor, "userId", () => "12345678");
    sandbox.stub(Reaction, "hasOwnerAccess", () => true);
    const result =  Meteor.call("paystack/getKeys");
    expect(result).to.be.an("object");
    expect(result).to.have.any.keys("public", "private");
  });
});

//     it("should create new staticPage for valid input", function () {
//       sandbox.stub(Meteor, "userId", () => "12345678");
//       sandbox.stub(Reaction, "hasOwnerAccess", () => true);
//       Meteor.call("insertPage", "title", "slug", "content", "shopId", "12345678", new Date());
//       const newStaticPage = StaticPages.find({pageOwner: "12345678"}).count();
//       expect(newStaticPage).to.equal(1);
//     });
//     it("should update a staticPage with valid input", function () {
//       sandbox.stub(Meteor, "userId", () => "12345678");
//       sandbox.stub(Reaction, "hasOwnerAccess", () => true);
//       Meteor.call("insertPage", "title", "slug", "content", "shopId", "12345678", new Date());
//       const newStaticPage = StaticPages.find({pageOwner: "12345678"}).fetch();
//       Meteor.call("updatePage", newStaticPage[0]._id, "newtitle", "newslug", "newcontent", "shopId");
//       const updatedStaticPage = StaticPages.find({pageOwner: "12345678"}).fetch();
//       expect(updatedStaticPage[0].title).to.equal("newtitle");
//       expect(updatedStaticPage[0].slug).to.equal("newslug");
//       expect(updatedStaticPage[0].content).to.equal("newcontent");
//     });
//     it("should delete a staticPage based on specified id", function () {
//       sandbox.stub(Meteor, "userId", () => "12345678");
//       sandbox.stub(Reaction, "hasOwnerAccess", () => true);
//       Meteor.call("insertPage", "title", "slug", "content", "shopId", "12345678", new Date());
//       const newStaticPage = StaticPages.find({pageOwner: "12345678"}).fetch();
//       Meteor.call("deletePage", newStaticPage[0]._id);
//       const deletedStaticPage = StaticPages.find({_id: newStaticPage[0]._id}).fetch();
//       expect(deletedStaticPage[0]).to.be.undefined;
//     });
//   });
// });
