import { Template } from "meteor/templating";

Template.AnalyticsForm.events({
  "click div.bhoechie-tab-menu>div.list-group>a": function (event) {
    event.preventDefault();
    $(event.currentTarget).siblings("a.active").removeClass("active");
    $(event.currentTarget).addClass("active");
    const index = $(event.currentTarget).index();
    $("div.bhoechie-tab>div.bhoechie-tab-content").removeClass("active");
    $("div.bhoechie-tab>div.bhoechie-tab-content").eq(index).addClass("active");
  }
});

