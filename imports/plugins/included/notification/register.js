/* eslint camelcase: 0 */
import { Reaction } from "/server/api";

Reaction.registerPackage({
  label: "NotificationBoard",
  name: "notification",
  icon: "fa fa-bullhorn",
  autoEnable: true,
  settings: {
    mode: false,
    publicKey: "",
    secretKey: ""
  },
  registry: [
    // Dashboard card
    {
      provides: "dashboard",
      label: "Twillo sms",
      description: "Twillo sms settings",
      icon: "fa fa-bullhorn",
      priority: 3,
      container: "core"
    },

    // Settings panel
    {
      label: "Notification Settings", // this key (minus spaces) is used for translations
      route: "/dashboard/notification",
      provides: "settings",
      container: "dashboard",
      template: "notificationSettings"
    }
  ]
});
