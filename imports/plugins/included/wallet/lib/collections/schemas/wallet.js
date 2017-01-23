import { SimpleSchema } from "meteor/aldeed:simple-schema";

export const WalletPayment = new SimpleSchema({
  payerName: {
    type: String,
    label: "Cardholder name"
  },
  payerEmail: {
    type: String,
    label: "Email"
  }
});
