import { Template } from "meteor/templating";
import { ReactiveDict } from "meteor/reactive-dict";
let productDetails = [];
const header = ["Product", " Product views", "Product sales", "Converation Rate (%)"];

Template.productViewSales.onCreated(function () {
  this.state = new ReactiveDict();
  this.state.setDefault({
    productDetails: []
  });

  this.autorun(() => {
    const displaySales = () => {
      productDetails = [];
      Meteor.call("productSales/views", (error, result) => {
        result.forEach((item) => {
          productDetails.push({
            ID: item.productId,
            count: item.count,
            title: item.productTitle,
            salesCount: 0,
            conversionRate: 0.0
          });
        });

        Meteor.call("analytics/getorders", (err, res) => {
          res.forEach((order) => {
            order.items.forEach((item) => {
              productDetails.forEach((product) => {
                if (product.ID === item.productId) {
                  product.salesCount = product.salesCount + 1;
                  product.conversionRate = ((product.salesCount / product.count) * 100).toFixed(2);
                }
              });
            });
          });
          this.state.set("productDetails", productDetails);
        });
      });
    };
    displaySales();
  });
});

Template.productViewSales.helpers({

  displayProductCount: function () {
    const template = Template.instance();
    return template.state.get("productDetails");
  },

  displayTableHeader: function () {
    return header;
  },

  displayTabledata: function () {

  }
});
