import Shepherd from "tether-shepherd";
import "/node_modules/tether-shepherd/dist/css/shepherd-theme-arrows.css";
import { Accounts } from "/lib/collections";
import { Template } from 'meteor/templating'
import "./tour.html";





function options (whoseTour) {
  return {defaults: {
    showCancelLink: true,
    scrollTo: true,
    classes: "shepherd-theme-arrows",
    buttons: [getButton(whoseTour).back, getButton(whoseTour).next]}
  };
}

export const vendorTour = new Shepherd.Tour(options("vendorTour"));
export const buyerTour = new Shepherd.Tour(options("buyerTour"));

function getButton(whichTour){

  if (whichTour == "vendorTour") {
    var actionNext = ()=>{
      vendorTour.next();
    }
    var actionHide = ()=>{
      vendorTour.hide();
    }
    var actionBack = ()=>{
      vendorTour.back();
    }
  }

  else if (whichTour == "buyerTour") {
    var actionNext = ()=>{
      buyerTour.next();
    }
    var actionHide = ()=>{
      buyerTour.hide();
    }
    var actionBack = ()=>{
      buyerTour.back();
    }
  }

const allButtons = {
  nexttime:
  {
    text: 'Dont Show Next Time',
    classes: 'shepherd-button-secondary',
    action: () => {
      Accounts.update({_id: Meteor.userId()}, {$set: {takenTour: true}});
      return actionHide()
    }
  },
  next:
   {
    text: 'Next',
    action: actionNext,
    classes: 'shepherd-button-example-primary'
  },
  back:
  {
   text: 'Back',
   action: actionBack,
   classes: 'shepherd-button-example-primary'
 },
 finish:
 {
  text: 'Finish',
  action: actionHide,
  classes: 'shepherd-button-example-primary'
}

}
return allButtons;
};


let template={};
Template.tour.onRendered(function () {
  template.welcomeText = this.$('.welcomeText').html();
  template.aboutDashboard = this.$('.aboutDashboard').html();
  template.dashboardDetails = this.$('.dashboardDetails').html();
  template.product = this.$('.product').html();
  template.profileOrdersAccounts = this.$('.profileOrdersAccounts').html();
  template.shop = this.$('.shop').html();
  template.retakeTour = this.$('.retakeTour').html();


  vendorTour.addStep("Welcome", {
    title: "Welcome to Reaction Commerce",
    text: template.welcomeText,
    buttons: [getButton("vendorTour").nexttime, getButton("vendorTour").next]
  });

  vendorTour.addStep("toDashboard", {
    title: "customize Store",
    text: template.aboutDashboard,
    attachTo: ".tour-accounts bottom",
    advanceOn: "#dropown-apps-dashboard click"

  });

  vendorTour.addStep("dashboard", {
    title: "customize Store",
    text: template.dashboardDetails,
    advanceOn: "#dropown-apps-dashboard click"
  });

  vendorTour.addStep("newProduct", {
    title: "Create New Product",
    text: template.product,
    attachTo: ".tour-create-content left",
    advanceOn: ".docs-link clink"
  });

  vendorTour.addStep("profileOrdersAccounts", {
    title: "Orders",
    text: template.profileOrdersAccounts,
    advanceOn: ".docs-link clink"
  });

  vendorTour.addStep("visitShop", {
    title: "Shop",
    text: template.shop,
    attachTo: ".rui.tag.link bottom",
    advanceOn: ".tour-shop",
    buttons: [getButton("vendorTour").nexttime, getButton("vendorTour").back, getButton("vendorTour").finish ]
  });

  vendorTour.addStep("toViewnextTime", {
    title: "Information",
    text: template.retakeTour,
    // attachTo: ".user-accounts right",
    advanceOn: ".docs-link clink"
  });

  buyerTour.addStep("shop", {
    title: "Shopping",
    text: template.retakeTour,
    // attachTo: ".user-accounts right",
    advanceOn: ".docs-link clink"
  });

});
