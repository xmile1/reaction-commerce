/* eslint-disable no-undef */
/* eslint-env node*/

import _ from "lodash";
import { IconButton } from "/imports/plugins/core/ui/client/components";
import { Template } from "meteor/templating";
import { ProductSearch, Tags } from "/lib/collections";
import { Session } from "meteor/session";


Template.searchModal.onCreated(function () {
  this.state = new ReactiveDict();
  this.state.setDefault({
    initialLoad: true,
    slug: "",
    canLoadMoreProducts: false,
    searchQuery: "",
    productSearchResults: [],
    tagSearchResults: []
  });


  // Allow modal to be closed by clicking ESC
  // Must be done in Template.searchModal.onCreated and not in Template.searchModal.events
  $(document).on("keyup", (event) => {
    if (event.keyCode === 27) {
      const view = this.view;
      $(".js-search-modal").fadeOut(400, () => {
        $("body").css("overflow", "visible");
        Blaze.remove(view);
      });
    }
  });

  // Filters product by price
  const priceFilter = (products, query) =>  {
    return _.filter(products, (product) => {
      if (product.price) {
        const productMaxPrice = parseFloat(product.price.max);
        const productMinPrice = parseFloat(product.price.min);
        const queryMaxPrice = parseFloat(query[1]);
        const queryMinPrice = parseFloat(query[0]);
        if (productMinPrice >= queryMinPrice && productMaxPrice <= queryMaxPrice) {
          return product;
        }
      }
    });
  };
  // Sorts product by price
  const sort = (products, type) => {
    return products.sort((a, b) => {
      const A = parseFloat(a.price.min);
      const B = parseFloat(b.price.min);
      if (A < B) {
        return type === "DESC" ? 1 : -1;
      }
      if (A > B) {
        return type === "ASC" ? 1 : -1;
      }
      return 0;
    });
  };


  // Filters product by brand
  function brandFilter(products, query) {
    return _.filter(products, (product) => {
      return product.vendor === query;
    });
  }

  this.autorun(() => {
    const searchQuery = this.state.get("searchQuery");
    const priceQuery = Session.get("priceFilter");
    const brandQuery = Session.get("brandFilter");
    const sortQuery = Session.get("sortValue");
    const facets = this.state.get("facets") || [];
    const sub = this.subscribe("SearchResults", "products", searchQuery, facets);

    if (sub.ready()) {
      let results = ProductSearch.find().fetch();
      if (!["null", "all"].includes(priceQuery) && priceQuery) {
        const range = priceQuery.split("-");
        results =  priceFilter(results, range);
      } if (!["null", "all"].includes(brandQuery) && brandQuery) {
        results = brandFilter(results, brandQuery);
      } if (sortQuery !== "null" && sortQuery) {
        results = sort(results, sortQuery);
      }
      this.state.set("productSearchResults", results);
      const hashtags = [];
      for (const product of results) {
        if (product.hashtags) {
          for (const hashtag of product.hashtags) {
            if (!_.includes(hashtags, hashtag)) {
              hashtags.push(hashtag);
            }
          }
        }
      }
      const tagResults = Tags.find({
        _id: { $in: hashtags }
      }).fetch();
      this.state.set("tagSearchResults", tagResults);
    }
  });
});


Template.searchModal.helpers({
  IconButtonComponent() {
    const instance = Template.instance();
    const view = instance.view;

    return {
      component: IconButton,
      icon: "fa fa-times",
      kind: "close",
      onClick() {
        $(".js-search-modal").fadeOut(400, () => {
          $("body").css("overflow", "visible");
          Blaze.remove(view);
        });
      }
    };
  },
  productSearchResults() {
    const instance = Template.instance();
    const results = instance.state.get("productSearchResults");
    return results;
  },
  tagSearchResults() {
    const instance = Template.instance();
    const results = instance.state.get("tagSearchResults");
    return results;
  }
});

Template.searchModal.events({
  // on type, reload Reaction.SaerchResults
  "keyup input": (event, templateInstance) => {
    event.preventDefault();
    const searchQuery = templateInstance.find("#search-input").value;
    templateInstance.state.set("searchQuery", searchQuery);
    $(".search-modal-header:not(.active-search)").addClass(".active-search");
    if (!$(".search-modal-header").hasClass("active-search")) {
      $(".search-modal-header").addClass("active-search");
    }
  },
  "click [data-event-action=filter]": function (event, templateInstance) {
    event.preventDefault();
    const instance = Template.instance();
    const facets = instance.state.get("facets") || [];
    const newFacet = $(event.target).data("event-value");

    tagToggle(facets, newFacet);

    $(event.target).toggleClass("active-tag btn-active");

    templateInstance.state.set("facets", facets);
  },
  "click [data-event-action=productClick]": function () {
    const instance = Template.instance();
    const view = instance.view;
    $(".js-search-modal").delay(400).fadeOut(400, () => {
      Blaze.remove(view);
    });
  },
  "click [data-event-action=clearSearch]": function (event, templateInstance) {
    $("#search-input").val("");
    $("#search-input").focus();
    const searchQuery = templateInstance.find("#search-input").value;
    templateInstance.state.set("searchQuery", searchQuery);
  },
  "click [data-event-action=toggleFilter]": function () {
    $("#filterGrid").toggleClass("hidden");
  }
});

Template.searchModal.onDestroyed(() => {
  // Kill Allow modal to be closed by clicking ESC, which was initiated in Template.searchModal.onCreated
  $(document).off("keyup");
});

function tagToggle(arr, val) {
  if (arr.length === _.pull(arr, val).length) {
    arr.push(val);
  }
  return arr;
}
