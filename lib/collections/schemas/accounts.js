import { SimpleSchema } from "meteor/aldeed:simple-schema";
import { shopIdAutoValue } from "./helpers";
import { Address } from "./address";
import { Vendor } from "./vendor";
import { Metafield } from "./metafield";

/**
 * Accounts Schemas
 */

export const Profile = new SimpleSchema({
  addressBook: {
    type: [Address],
    optional: true
  },
  vendorDetails: {
    type: [Vendor],
    optional: true
  },
  name: {
    type: String,
    optional: true
  },
  picture: {
    type: String,
    optional: true
  }
});

export const Email = new SimpleSchema({
  provides: {
    type: String,
    defaultValue: "default",
    optional: true
  },
  address: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  verified: {
    type: Boolean,
    defaultValue: false,
    optional: true
  }
});

/**
 * Wallet Schema
 */
export const Sent = new SimpleSchema({
  username: {
    type: String,
    label: "Username",
    optional: true
  },
  amount: {
    type: Number,
    label: "Amount Sent",
    optional: true
  },
  date: {
    type: Date,
    optional: true
  }
});

export const Received = new SimpleSchema({
  from: {
    type: String,
    label: "Username",
    optional: true
  },
  amount: {
    type: Number,
    label: "Amount Sent",
    optional: true
  },
  date: {
    type: Date,
    optional: true
  }
});

export const Transactions = new SimpleSchema({
  sent: {
    type: [Sent],
    optional: true
  },
  received: {
    type: [Received],
    optional: true
  }
});

export const Wallet = new SimpleSchema({
  balance: {
    type: Number,
    label: "balance",
    optional: true,
    defaultValue: 0
  },
  transactions: {
    type: Transactions,
    optional: true
  }
});


/**
 * Reaction Schemas Accounts
 */

export const Accounts = new SimpleSchema({
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    index: 1,
    label: "Accounts ShopId"
  },
  sessions: {
    type: [String],
    optional: true,
    index: 1
  },
  shopId: {
    type: String,
    autoValue: shopIdAutoValue,
    regEx: SimpleSchema.RegEx.Id,
    index: 1
  },
  emails: {
    type: [Email],
    optional: true
  },
  acceptsMarketing: {
    type: Boolean,
    defaultValue: false,
    optional: true
  },
  state: {
    type: String,
    defaultValue: "new",
    optional: true
  },
  note: {
    type: String,
    optional: true
  },
  profile: {
    type: Profile,
    optional: true
  },
  metafields: {
    type: [Metafield],
    optional: true
  },
  wallet: {
    type: Wallet,
    optional: true
  },
  takenTour: {
    type: Boolean,
    optional: true,
    defaultValue: false
  },
  notificationCount: {
    type: Number,
    optional: true,
    defaultValue: 0
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
  },
  updatedAt: {
    type: Date,
    autoValue() {
      if (this.isUpdate) {
        return {
          $set: new Date
        };
      } else if (this.isUpsert) {
        return {
          $setOnInsert: new Date
        };
      }
    },
    optional: true
  }
});
