import { Tags, Products } from "/lib/collections";

Template.filterGrid.helpers({
  displayTags: function () {
    const tags = Tags.find().fetch();
    return tags;
  },

  displayPrice: function () {
    const priceRange = ["$10 - $20", "$30 - $50", "$60 -$70" ];
    return priceRange;
  },

  displayBrand: function () {
    let vendors = [];
    const products = Products.find().fetch();
    products.forEach
  },
  displaySellers: function () {

  }
});


