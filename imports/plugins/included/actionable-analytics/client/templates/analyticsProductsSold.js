import {
  Template
} from "meteor/templating";
import Chart from "chart.js";
import {
  Orders
} from "/lib/collections";
import {
  Meteor
} from "meteor/meteor";

const analysisData = {
  month: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
  orders: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
};
let ordersDates = {};

getOrders = function (date, length) {
  let index = date.getMonth();
  console.log(index);
  analysisData.orders[index] = analysisData.orders[index] + length;
  console.log(analysisData.orders[index]);
};

displayGraph = function () {
  let ctx = document.getElementById("myChart");
  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: analysisData.month,
      datasets: [{
        label: "# Number of Sales per Month",
        data: analysisData.orders,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)"
        ],
        borderColor: [
          "rgba(255,99,132,1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255,99,132,1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
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
  console.log('DisplayGraph funtion');
};

Template.analyticsProductsSold.onRendered(function () {
  analysisData.orders = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  Meteor.call("analytics/getorders", (error, result) => {
    const dates = [];
    result.forEach((order) => {
      getOrders(order.updatedAt, order.items.length);
      dates.push(order.updatedAt);
    });
    displayGraph();
    ordersDates = dates;
  });
});

Template.analyticsProductsSold.helpers({

});
