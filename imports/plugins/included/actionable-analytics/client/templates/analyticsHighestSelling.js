/* eslint-disable no-unused-vars  */

import { Template } from "meteor/templating";
import Chart from "chart.js";
import _ from "lodash";

let productData = {};
let productDetails = [];
let productCounts = [];
let productIds = [];
let productNames = [];

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
    type: "bar",
    data: {
      labels: productNames,
      datasets: [{
        label: "Products Sold",
        data: productCounts,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)"
        ],
        borderColor: [
          "rgba(255,99,132,1)",
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)"
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
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
