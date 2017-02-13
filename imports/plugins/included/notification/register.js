/* eslint camelcase: 0 */
import { Reaction } from "/server/api";

Reaction.registerPackage({
  label: "NotificationBoard",
  name: "notification",
  icon: "fa fa-bullhorn",
  autoEnable: true,
  settings: {
    default: "twillo",
    api: {
      twilio: {
        authToken: "",
        accSid: "",
        phoneNumber: ""
      },
      jusibe: {
        authToken: "",
        accSid: "",
        phoneNumber: ""
      }
    },
    email: {
      host: "",
      port: "",
      user: "",
      password: ""
    }
  },
  registry: [
    // Dashboard card
    {
      provides: "dashboard",
      label: "Notification",
      description: "Notification settings",
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
