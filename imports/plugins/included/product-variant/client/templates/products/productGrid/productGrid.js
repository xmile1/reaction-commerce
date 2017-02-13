import _ from "lodash";
import { Session } from "meteor/session";
import { Template } from "meteor/templating";
import { Reaction } from "/client/api";
import Logger from "/client/modules/logger";
import { ReactionProduct } from "/lib/api";
import Sortable from "sortablejs";
import { buyerTour, vendorTour } from "/imports/plugins/included/tour/client/tour";
import { Meteor } from "meteor/meteor";
import { Accounts } from "/lib/collections";

/**
 * productGrid helpers
 */

Template.productGrid.onCreated(function () {
  Session.set("productGrid/selectedProducts", []);
});

Template.productGrid.onRendered(function () {
  const instance = this;
  const hasTakenTour = Accounts.findOne(Meteor.userId()).takenTour;

  if (Reaction.hasPermission("createProduct")) {
    const productSort = $(".product-grid-list")[0];

    this.sortable = Sortable.create(productSort, {
      group: "products",
      handle: ".product-grid-item",
      onUpdate() {
        const tag = ReactionProduct.getTag();

        instance.$(".product-grid-item")
          .toArray()
          .map((element, index) => {
            const productId = element.getAttribute("id");
            const position = {
              position: index,
              updatedAt: new Date()
            };

            Meteor.call("products/updateProductPosition", productId, position, tag,
              error => {
                if (error) {
                  Logger.warn(error);
                  throw new Meteor.Error(403, error);
                }
              });
          });

        Tracker.flush();
      }
    });
  }
  if (Meteor.user().emails.length > 0 && !hasTakenTour) {
    if (Reaction.hasAdminAccess()) {
      vendorTour.start();
    }    else {
      buyerTour.start();
    }
  }
});

Template.productGrid.events({
  "click [data-event-action=loadMoreProducts]": (event) => {
    event.preventDefault();
    loadMoreProducts();
  },
  "change input[name=selectProduct]": (event) => {
    let selectedProducts = Session.get("productGrid/selectedProducts");

    if (event.target.checked) {
      selectedProducts.push(event.target.value);
    } else {
      selectedProducts = _.without(selectedProducts, event.target.value);
    }

    Session.set("productGrid/selectedProducts", _.uniq(selectedProducts));

    const productCursor = Template.currentData().products;

    if (productCursor) {
      const products = productCursor.fetch();

      const filteredProducts = _.filter(products, (product) => {
        return _.includes(selectedProducts, product._id);
      });

      Reaction.showActionView({
        label: "Product Settings",
        i18nKeyLabel: "productDetailEdit.productSettings",
        template: "productSettings",
        type: "product",
        data: {
          products: filteredProducts
        }
      });
    }
  }
});

Template.productGrid.helpers({
  loadMoreProducts() {
    return Template.instance().state.equals("canLoadMoreProducts", true);
  },

  products() {
    return Template.currentData().products;
  }
});
