import { Template } from "meteor/templating";
import Chart from "chart.js";
import { Meteor } from "meteor/meteor";
import { Orders } from "/lib/collections";
import { Products } from "/lib/collections";
import _ from "lodash";

let productObject = {};

Template.analyticsHighestSelling.onRendered(() => {
    Meteor.call("analytics/getorders", (error, result) => {
        result.forEach((orders) => {
            orders.items.forEach((eachItem) => {
                if(eachItem.workflow.status === "coreOrderItemWorkflow/completed") {
                    if(!productObject.hasOwnProperty(eachItem.title)) {
                        productObject[eachItem.title] = eachItem.quantity;
                    }
                    else {
                        productObject[eachItem.title] += eachItem.quantity;
                    }
                }
            });            
        });
        const data  = getData(productObject)
        displayGraphs(data);
    });
});
getData = function(productObject) {
var data = {
    datasets: [{
        data: Object.values(productObject),
        backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)"
        ],
        label: 'My dataset'
    }],
    labels: Object.keys(productObject)
};
    return data;
}

displayGraphs = function (data) {
    let ctx = document.getElementById("myCharts");
    var myDoughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data,
        options: {
            elements: {
                arc: {
                    borderColor: "#000000"
                }
            }
        }
    });
}






