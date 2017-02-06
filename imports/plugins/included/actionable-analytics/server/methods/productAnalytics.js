import { Meteor } from "meteor/meteor";
import { ProductAnalytics } from "/lib/collections";
import {Products} from "/lib/collections";

Meteor.methods({
  "ProductAnalytics/count"(productId) {
    check(productId, String);
    const productname = Products.findOne({
      _id: productId
    });
    const productTitle = productname.title;
    const productSales = productname.salesCount;
    
    const product = ProductAnalytics.find({
      productId: productId
    }).fetch();
      if (product.length > 0) {  
        const query = {
          $inc: { count: 1}
        }
        ProductAnalytics.update({productId}, query)
      }
      else {
      const setCount = {
        productId,
        count: 1,
        productTitle,
      }
      ProductAnalytics.insert(setCount);
    }
  },

  "productSales/views": function() {
    const productDetails = ProductAnalytics.find().fetch();
    return productDetails;
  }
});