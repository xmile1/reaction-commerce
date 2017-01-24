import { SimpleSchema } from "meteor/aldeed:simple-schema";

export const WalletPayment = new SimpleSchema({
  payerName: {
    type: String,
    label: "Name"
  },
  payerEmail: {
    type: String,
    label: "Email"
  },
  amount: {
    type: Number,
    label: "Amount"
  }
});
