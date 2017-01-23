/* eslint camelcase: 0 */
import { Reaction } from "/server/api";

Reaction.registerPackage({
  name: "reaction-analytics",
  icon: "fa fa-bar-chart-o",
  autoEnable: false,
  settings: {
    public: {
      segmentio: {
        enabled: true,
        api_key: ""
      },
      googleAnalytics: {
        enabled: true,
        api_key: ""
      },
      mixpanel: {
        enabled: true,
        api_key: ""
      }
    }
  },
  registry: [{
    label: "Reaction Analytics",
    route: "/dashboard/analytics",
    container: "dashboard",
    template: "AnalyticsForm"
  },
  {
    label: "Analytics Settings",
    route: "/dashboard/analytics/settings",
    provides: "settings",
    container: "dashboard",
    template: "reactionAnalyticsSettings"
  }]
});
