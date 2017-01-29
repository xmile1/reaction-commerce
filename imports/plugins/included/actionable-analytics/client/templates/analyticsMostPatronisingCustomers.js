import { Template } from "meteor/templating";
import Chart from "chart.js";
import _ from "lodash";

let customerData = {};
let customerIds = [];
let customerNames = [];
let counts = [];
let customerDetails = [];

const getCustomerNames = (customerId)=> {
  customerId.forEach((id) => {
    Meteor.call("analytics/getcustomername", id, (error, result) => {
      customerNames.push(result[0].profile.addressBook[0].fullName);
    });
  });
};

const displayCustomers = ()=> {
  const ctx = document.getElementById("thisChart");
  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: customerNames,
      datasets: [{
        label: "# Number of Products Bought",
        data: counts,
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

const storeCustomer = (userId, count)=> {
  if (customerData[userId]) {
    customerData[userId] = customerData[userId] + count;
  } else {
    customerData[userId] = count;
  }
};

Template.analyticsMostPatronisingCustomers.onRendered(()=> {
  // Reset variables
  customerData = {};
  customerNames = [];
  customerIds = [];
  counts = [];
  customerDetails = [];

  Meteor.call("analytics/getorders", (error, result) => {
    result.forEach((order) => {
      storeCustomer(order.userId, order.items.length);
    });

    Object.keys(customerData).forEach(data => {
      customerDetails.push({
        ID: data,
        count: customerData[data]
      });
    });

    customerData = _.orderBy(customerDetails, ["count"], ["desc"]).slice(0, 5);
    customerData.forEach(data => {
      customerIds.push(data.ID);
      counts.push(data.count);
    });
    getCustomerNames(customerIds);
    displayCustomers();
  });
});
