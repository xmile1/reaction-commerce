import { SimpleSchema } from "meteor/aldeed:simple-schema";
import { Metafield } from "./metafield";
/**
* Reaction Schemas Address
*/

export const Vendor = new SimpleSchema({
  _id: {    type: String,
    label: "Vendor Id",
    optional:true
  },
  shopName: {
    type: String,
    label: "Shop Name"
  },
  shopActive: {
    type: Boolean,
    label: "Shop Active",
    defaultValue: false
  },
  shopPhone: {
    label: "Shop Phone",
    type: String,
    optional: true
  },
  shopAddress: {
    label: "Shop Address",
    type: String,
    optional: true
  },
  createdAt: {
    type: Date,
    autoValue() {
      if (this.isInsert) {
        return new Date;
      } else if (this.isUpsert) {
        return {
          $setOnInsert: new Date
        };
      }
    }
  }
});
