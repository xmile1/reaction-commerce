import { FlatButton } from "/imports/plugins/core/ui/client/components";
import { Reaction } from "/client/api";
import { Tags } from "/lib/collections";
import { buyerTour, vendorTour } from "/imports/plugins/included/tour/client/tour";

Template.CoreNavigationBar.onCreated(function () {
  this.state = new ReactiveDict();
});

/**
 * layoutHeader events
 */
Template.CoreNavigationBar.events({
  "click .navbar-accounts .dropdown-toggle": function () {
    return setTimeout(function () {
      return $("#login-email").focus();
    }, 100);
  },
  "click .header-tag, click .navbar-brand": function () {
    return $(".dashboard-navbar-packages ul li").removeClass("active");
  },
  "click .search": function () {
    Blaze.renderWithData(Template.searchModal, {
    }, $("body").get(0));
    $("body").css("overflow", "hidden");
    $("#search-input").focus();
  },
  "click #takeTour": (event) =>{
    event.preventDefault();
        buyerTour.start();
  },
});


Template.CoreNavigationBar.helpers({
  IconButtonComponent() {
    return {
      component: FlatButton,
      icon: "fa fa-search",
      kind: "flat"
      // onClick() {
      //   Blaze.renderWithData(Template.searchModal, {
      //   }, $("body").get(0));
      //   $("body").css("overflow-y", "hidden");
      //   $("#search-input").focus();
      // }
    };
  },
  tourButton() {
    return {
      component: FlatButton,
      kind: "flat",
      label: "Take Tour"
        // onClick() {
        //   Blaze.renderWithData(Template.searchModal, {
        //   }, $("body").get(0));
        //   $("body").css("overflow-y", "hidden");
        //   $("#search-input").focus();
        // }
    };
  },
  onMenuButtonClick() {
    const instance = Template.instance();
    return () => {
      if (instance.toggleMenuCallback) {
        instance.toggleMenuCallback();
      }
    };
  },

  tagNavProps() {
    const instance = Template.instance();
    let tags = [];

    tags = Tags.find({
      isTopLevel: true
    }, {
      sort: {
        position: 1
      }
    }).fetch();

    return {
      name: "coreHeaderNavigation",
      editable: Reaction.hasAdminAccess(),
      isEditing: true,
      tags: tags,
      onToggleMenu(callback) {
        // Register the callback
        instance.toggleMenuCallback = callback;
      }
    };
  }
});
