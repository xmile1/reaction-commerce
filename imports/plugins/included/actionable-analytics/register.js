import { Reaction } from "/server/api";

Reaction.registerPackage({
  label: "Actionable Analytics",
  name: "actionable-analytics",
  icon: "fa fa-bar-chart-o",
  autoEnable: true,
  settings: {
    name: "Actionable Analytics",
    public: {
      segmentio: {
        enabled: false,
        apiKey: ""
      },
      googleAnalytics: {
        enabled: false,
        apiKey: ""
      },
      mixpanel: {
        enabled: false,
        apiKey: ""
      }
    }
  },
  registry: [
    {
      provides: "dashboard",
      route: "/dashboard/actionable-analytics",
      name: "actionable-analytics",
      label: "Actionable Analytics",
      description: "View Product Performance",
      icon: "fa fa-truck",
      priority: 1,
      container: "core",
      template: "actionableAnalytics"
    }
  ]
});
