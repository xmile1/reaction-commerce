/* eslint camelcase: 0 */
import { Reaction } from "/server/api";

Reaction.registerPackage({
  label: "wallet",
  name: "wallet",
  icon: "fa fa-credit-card-alt",
  autoEnable: true,
  settings: {
    mode: false
  },
  registry: [
    // Dashboard card
    {
      provides: "dashboard",
      label: "wallet Payment",
      description: "wallet payment provider",
      icon: "fa fa-credit-card-alt",
      priority: 3,
      container: "paymentMethod"
    },

    // Payment form for checkout
    {
      template: "walletPaymentForm",
      provides: "paymentMethod"
    },
    {
      route: "/wallet",
      icon: "fa fa-google-wallet",
      template: "walletDashboard",
      label: "wallet",
      name: "wallet"
    }
  ]
});
