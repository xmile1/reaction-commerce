import { Template } from "meteor/templating";
import Chart from "chart.js";
import _ from "lodash";

let productData = {};
let vendourDetails = [];
let vendourCounts = [];
let vendourIds = [];
let vendourNames = [];
const backgroundColor = ["#FF6384", "#36A2EB", "#FFCE56", "#FE7EA6", "#2ACEEB"];

const storeProductData = (productId) => {
  if (productData[productId]) {
    productData[productId] = productData[productId] + 1;
  } else {
    productData[productId] = 1;
  }
};

const getVendours = (vendourId) => {
  vendourId.forEach((id) => {
    Meteor.call("analytics/getvendour", id, (error, result) => {
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
    type: "pie",
    data: {
      labels: vendourNames,
      datasets: [{
        data: vendourCounts,
        backgroundColor: backgroundColor,
        hoverBackgroundColor: backgroundColor
      }]
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
