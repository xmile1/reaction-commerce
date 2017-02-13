/* eslint-disable no-unused-vars  */

import { Template } from "meteor/templating";
import Chart from "chart.js";
import _ from "lodash";

let productData = {};
let vendourDetails = [];
let vendourCounts = [];
let vendourIds = [];
let vendourNames = [];

const backgroundColor = [
  "rgba(255, 99, 132, 0.2)",
  "rgba(54, 162, 235, 0.2)",
  "rgba(75, 192, 192, 0.2)",
  "rgba(153, 102, 255, 0.2)",
  "rgba(255, 159, 64, 0.2)"
];
const borderColor = [
  "rgba(255,99,132,1)",
  "rgba(54, 162, 235, 1)",
  "rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 1)",
  "rgba(255, 159, 64, 1)"
];

const storeProductData = (productId) => {
  if (productData[productId]) {
    productData[productId] = productData[productId] + 1;
  } else {
    productData[productId] = 1;
  }
};

const getVendours = (vendourId) => {
  vendourId.forEach((id) => {
    Meteor.call("analytics/getproduct", id, (error, result) => {
      const index = vendourNames.indexOf(result[0].vendor);
      if (index === -1) {
        vendourNames.push(result[0].vendor);
      } else {
        vendourCounts[index] = vendourCounts[index] + vendourCounts[vendourIds.indexOf(id)];
        delete vendourCounts[vendourIds.indexOf(id)];
      }
    });
  });
};

const displayVendours = () => {
  const ctx = document.getElementById("pieChart");
  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: vendourNames,
      datasets: [{
        label: "Products Sold",
        data: vendourCounts,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
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

Template.analyticsMostPatronisedBrand.onRendered(() => {
  productData = {};
  vendourDetails = [];
  vendourCounts = [];
  vendourIds = [];
  vendourNames = [];

  Meteor.call("analytics/getorders", (error, result) => {
    result.forEach((order) => {
      order.items.forEach(item => {
        storeProductData(item.productId);
      });
    });
    Object.keys(productData).forEach(id => {
      vendourDetails.push({
        ID: id,
        count: productData[id]
      });
    });

    productData = _.orderBy(vendourDetails, ["count"], ["desc"]).slice(0, 5);
    productData.forEach(data => {
      vendourIds.push(data.ID);
      vendourCounts.push(data.count);
    });
    getVendours(vendourIds);
    displayVendours();
  });
});
