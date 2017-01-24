/* eslint camelcase: 0 */
import { Reaction } from "/server/api";

Reaction.registerPackage({
  label: "wallet",
  name: "wallet",
  icon: "fa fa-credit-card-alt",
  autoEnable: true,
  settings: {
    mode: false
    // apiKey: ""
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

    // // Settings panel
    // {
    //   label: "Wallet Settings", // this key (minus spaces) is used for translations
    //   provides: "settings",
    //   container: "dashboard",
    //   template: "walletSettings"
    // },

    // Payment form for checkout
    {
      template: "walletPaymentForm",
      provides: "paymentMethod"
    },
    {
      route: "wallet",
      name: "wallet-dashboard",
      template: "walletDashboard"
    }
  ]
});
