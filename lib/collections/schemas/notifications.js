import { SimpleSchema } from "meteor/aldeed:simple-schema";

export const Notifications = new SimpleSchema({
  userId: {
    type: String,
    optional: false
  },

  type: {
    type: String
  },

  status: {
    type: Boolean,
    defaultValue: 0
  },

  message: {
    type: Boolean,
    defaultValue: 0
  },

  createdAt: {
    type: Date,
    autoValue() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {
          $setOnInsert: new Date()
        };
      }
      return this.unset();
    }
  },

  updatedAt: {
    type: Date,
    autoValue() {
      if (this.isUpdate) {
        return new Date();
      }
      return this.unset();
    },
    denyInsert: true,
    optional: true
  }
});
