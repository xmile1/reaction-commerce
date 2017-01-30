import { Template } from "meteor/templating";
import Chart from "chart.js";
import _ from "lodash";

let productData = {};
let productDetails = [];
let productCounts = [];
let productIds = [];
let productNames = [];
const backgroundColor = ["#FF6384", "#36A2EB", "#FFCE56", "#FE7EA6", "#2ACEEB"];

const storeProductData = (productId) => {
  if (productData[productId]) {
    productData[productId] = productData[productId] + 1;
  } else {
    productData[productId] = 1;
  }
};

const getProducts = (productId) => {
  productId.forEach((id) => {
    Meteor.call("analytics/getproduct", id, (error, result) => {
      productNames.push(result[0].title);
    });
  });
};

const displayProducts = () => {
  const ctx = document.getElementById("sellingProductChart");
  const myChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: productNames,
      datasets: [{
        data: productCounts,
        backgroundColor: backgroundColor,
        hoverBackgroundColor: backgroundColor
      }]
    }
  });
};

Template.analyticsHighestSelling.onRendered(() => {
  productData = {};
  productDetails = [];
  productCounts = [];
  productIds = [];
  productNames = [];

  Meteor.call("analytics/getorders", (error, result) => {
    result.forEach((order) => {
      order.items.forEach(item => {
        storeProductData(item.productId);
      });
    });
    Object.keys(productData).forEach(id => {
      productDetails.push({
        ID: id,
        count: productData[id]
      });
    });

    productData = _.orderBy(productDetails, ["count"], ["desc"]).slice(0, 5);
    productData.forEach(data => {
      productIds.push(data.ID);
      productCounts.push(data.count);
    });
    getProducts(productIds);
    displayProducts();
  });
});
