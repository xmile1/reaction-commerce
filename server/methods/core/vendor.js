import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import {Accounts } from "/lib/collections";
import * as Collections from "/lib/collections";
import { Session } from "meteor/session";
import { Reaction } from "/server/api";

Meteor.methods({

  "vendor/activateVendor"(memberId) {
    check(memberId, String);

    Collections.Accounts.update({
      userId: memberId
    }, {
      $set: {
        "profile.vendorDetails.0.shopActive": true,
        "profile.vendorDetails.0._id": memberId
      }
    });
  },
  "vendor/deactivateVendor"(memberId) {
    check(memberId, String);

    Collections.Accounts.update({
      userId: memberId
    }, {
      $set: {
        "profile.vendorDetails.0.shopActive": false
      }
    });
  },
  "vendor/getVendorId"() {
    const profile = Collections.Accounts.find({userId: Meteor.userId()}).fetch();
    if (profile.length > 0 && profile[0].profile !== undefined && profile[0].profile.vendorDetails !== undefined) {
      return (profile[0].profile.vendorDetails[0]._id);
    }
    throw new Meteor.Error(500, "Vendor Id Not Found", "Vendor");
  },
  "vendor/getVendorDetails"() {
    const profile = Collections.Accounts.find({userId: Meteor.userId()}).fetch();
    console.log(profile[0].profile.vendorDetails, "Vendor Details");
    if (profile.length > 0 && profile[0].profile !== undefined && profile[0].profile.vendorDetails !== undefined ) {
      return (profile[0].profile.vendorDetails[0]);
    }
    throw new Meteor.Error(500, "Vendor Details Not Found", "Vendor");
  },
"vendor/updateDetails"(vendorDetails){
  Collections.Accounts.update({
   "userId": Meteor.userId()
 }, {
   $set: {
     "profile.vendorDetails[0]": vendorDetails
   }
     });
},
"vendor/upgradeToVendor"(vendorDetails){
  Collections.Accounts.upsert({
   "userId": Meteor.userId()
 }, {
   $set: {
     "profile.vendorDetails[0]": vendorDetails
   }
     });
}


});
