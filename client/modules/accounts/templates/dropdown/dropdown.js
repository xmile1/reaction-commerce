import { Reaction, Logger} from "/client/api";
import { StaticPages, Tags } from "/lib/collections";
import { Session } from "meteor/session";
import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { buyerTour, vendorTour } from "/imports/plugins/included/tour/client/tour";
import { FlowRouter as Router } from "meteor/kadira:flow-router-ssr";
import * as Collections from "/lib/collections";
// import { Accounts } from "/lib/collections";

Template.staticPagesNav.onCreated(function () {
  Meteor.subscribe("viewPages");
});

Template.staticPagesNav.helpers({
  staticPages() {
    let vendorId = "admin";
    if (Router.getParam("shopName")) {
      const shopName = Router.getParam("shopName");
      vendorId = Collections.Accounts.find({"profile.vendorDetails.0.shopName": shopName}).fetch()[0];
      vendorId = vendorId._id;
    }
    return StaticPages.find({shopId: Reaction.shopId, pageOwner: vendorId}).fetch();
  }
});

Template.loginDropdown.events({

  /**
   * Submit sign up form
   * @param  {Event} event - jQuery Event
   * @param  {Template} template - Blaze Template
   * @return {void}
   */
  "click .dropdown-menu": (event) => {
    return event.stopPropagation();
  },

  /**
   * Submit sign up form
   * @param  {Event} event - jQuery Event
   * @param  {Template} template - Blaze Template
   * @return {void}
   */
  "click #logout": (event, template) => {
    event.preventDefault();
    template.$(".dropdown-toggle").dropdown("toggle");
    // Meteor.logoutOtherClients();
    Meteor.logout((error) => {
      if (error) {
        Logger.warn("Failed to logout.", error);
      }
    });
  },

  "click #takeTour": (event) => {
    event.preventDefault();
    if (Meteor.user()) {
      if (Reaction.hasAdminAccess()) {
        vendorTour.start();
      } else {
        buyerTour.start();
      }
    }
  },

  /**
   * Submit sign up form
   * @param  {Event} event - jQuery Event
   * @param  {Template} template - Blaze Template
   * @return {void}
   */
  "click .user-accounts-dropdown-apps a": function (event, template) {
    if (this.name === "createProduct") {
      event.preventDefault();
      event.stopPropagation();

      Meteor.call("products/createProduct", (error, productId) => {
        let currentTag;
        let currentTagId;

        if (error) {
          throw new Meteor.Error("createProduct error", error);
        } else if (productId) {
          currentTagId = Session.get("currentTag");
          currentTag = Tags.findOne(currentTagId);
          if (currentTag) {
            Meteor.call("products/updateProductTags", productId, currentTag.name, currentTagId);
          }
          Reaction.Router.go("product", {
            handle: productId
          });
        }
      });
    } else if (this.route || this.name) {
      event.preventDefault();
      if (vendorTour.currentStep && vendorTour.currentStep.isOpen()) {
        vendorTour.next();
      }
      const route = this.name || this.route;
      Reaction.Router.go(route);
    }
    template.$(".dropdown-toggle").dropdown("toggle");
  }
});
