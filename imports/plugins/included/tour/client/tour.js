import Shepherd from "tether-shepherd";
import "/node_modules/tether-shepherd/dist/css/shepherd-theme-arrows.css";
import { Accounts } from "/lib/collections";
import * as template from "./template";

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
    var actionBack = ()=>{
      vendorTour.hide();
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
      return actionNext
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
 }

}
return allButtons;
};

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
  buttons: [getButton("vendorTour").nextTime,getButton("vendorTour").back, getButton("vendorTour").next]
});

vendorTour.addStep("toViewnextTime", {
  title: "Information",
  text: template.retakeTour,
  // attachTo: ".user-accounts right",
  advanceOn: ".docs-link clink"
});
