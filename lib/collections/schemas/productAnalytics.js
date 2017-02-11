import { SimpleSchema } from "meteor/aldeed:simple-schema";


export const ProductAnalytics = new SimpleSchema({
  productId: {
    type: String
  },
  count: {
    type: Number,
    optional: true
  },

  productTitle: {
    type: String
  }
});
