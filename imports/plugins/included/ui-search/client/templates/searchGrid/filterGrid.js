import { Session } from "meteor/session";

Template.filterGrid.helpers({
  getBrands(products) {
    return _.uniq(_.pluck(products, "vendor"));
  }
});

Template.filterGrid.events({
  "change #price-filter": function (event) {
    Session.set("priceFilter", event.target.value);
  },
  "change #sort-value": function (event) {
    Session.set("sortValue", event.target.value);
  },
  "change #brand-filter": function (event) {
    Session.set("brandFilter", event.target.value);
  }
});

