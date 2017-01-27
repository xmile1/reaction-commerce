import { Template} from "meteor/templating";
import Chart from "chart.js";
import { Meteor } from "meteor/meteor";
import { Orders } from "/lib/collections";
import { Products } from "/lib/collections";

const productTitle = [];

Template.analyticsHighestSelling.onRendered(() => {  
    Meteor.call("analytics/getorders", (error, result) => {
        result.forEach((orders) => {
            const completedOrders = orders.items;
            completedOrders.forEach((item) => {
                Meteor.call("analytics/getProductsName", item.productId, (error, result) => {
                    productTitle.push(result[0].title);
                });    
            });
        })
    });
    displayGraphs();
});

displayGraphs = function() {
    let ctx = document.getElementById("myCharts");
    var myDoughnutChart = new Chart(ctx,{
    type: 'doughnut',
    data: data,
    options: {
        elements: {
            arc: {
                borderColor: "#000000"
            }
        }
    }
});
}

var data = {
    datasets: [{
        data: [
            1,
            2,
            3,
            4
        ],
        backgroundColor: [
            "#FF6384",
            "#4BC0C0",
            "#FFCE56",
        ],
        label: 'My dataset'
    }],
    labels: productTitle
};

    






