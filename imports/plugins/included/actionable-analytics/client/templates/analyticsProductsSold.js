/* eslint-disable no-unused-vars  */
import { Template } from "meteor/templating";
import Chart from "chart.js";
import { Meteor } from "meteor/meteor";
import { ReactiveDict } from "meteor/reactive-dict";

const backgroundColor = [
  "rgba(255, 99, 132, 0.2)",
  "rgba(54, 162, 235, 0.2)",
  "rgba(255, 206, 86, 0.2)",
  "rgba(75, 192, 192, 0.2)",
  "rgba(153, 102, 255, 0.2)",
  "rgba(255, 159, 64, 0.2)",
  "rgba(255, 99, 132, 0.2)",
  "rgba(54, 162, 235, 0.2)",
  "rgba(255, 206, 86, 0.2)",
  "rgba(75, 192, 192, 0.2)",
  "rgba(153, 102, 255, 0.2)",
  "rgba(255, 159, 64, 0.2)"
];

const borderColor = [
  "rgba(255,99,132,1)",
  "rgba(54, 162, 235, 1)",
  "rgba(255, 206, 86, 1)",
  "rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 1)",
  "rgba(255, 159, 64, 1)",
  "rgba(255,99,132,1)",
  "rgba(54, 162, 235, 1)",
  "rgba(255, 206, 86, 1)",
  "rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 1)",
  "rgba(255, 159, 64, 1)"
];

const analysisData = {
  month: ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"],
  monthCount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  year: [],
  week: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
  weekCount: [0, 0, 0, 0, 0, 0],
  day: ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"],
  dayCount: [0, 0, 0, 0, 0, 0, 0]
};

const getDates = (date)=> {
  if (analysisData.year.indexOf(date.getFullYear()) === -1) {
    analysisData.year.push(date.getFullYear());
  }
};

Meteor.call("analytics/getorders", (error, result) => {
  result.forEach((order) => {
    getDates(order.updatedAt);
  });
});

const views = {};

getYearOrders = function (date, length) {
  const index = date.getMonth();
  analysisData.monthCount[index] = analysisData.monthCount[index] + length;
};

displayYearChart = function () {
  const ctx = document.getElementById("yearChart");
  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: analysisData.month,
      datasets: [{
        label: "# Number of Sales per Month",
        data: analysisData.monthCount,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
};

Template.analyticsProductsSold.onCreated(function () {
  this.state = new ReactiveDict();
  this.state.setDefault({
    renderTemplate: ""
  });
  const template = Template.instance();
  template.formMessages = new ReactiveVar({});
});

const validateView = (view, period) => {
  check(view, Match.OptionalOrNull(String));

  // Valid
  if (view !== `Select ${period}`) {
    return true;
  }

  // Invalid
  return {
    error: "INVALID_VIEW",
    reason: `Select ${period}`
  };
};

const showYear = (template) => {
  views.year = template.$("#year option:selected").text();
  views.month = template.$("#month option:selected").text();
  views.week = template.$("#week option:selected").text();
  let validatedView = validateView(views.year, "Year");

  const templateInstance = Template.instance();
  const errors = {};
  templateInstance.formMessages.set({});

  if (validatedView !== true) {
    errors.comment = validatedView;
  }

  if ($.isEmptyObject(errors) === false) {
    templateInstance.formMessages.set({
      errors: errors
    });
    return;
  }

  validatedView = validateView(views.month, "Month");
  if (validatedView === true) {
    validatedView = validateView(views.week, "Week");
    if (validatedView === true) {
      template.state.set("renderTemplate", "analyticsWeekView");
      return;
    }
    template.state.set("renderTemplate", "analyticsMonthView");
    return;
  }

  template.state.set("renderTemplate", "analyticsYearView");
};

Template.analyticsProductsSold.events({
  "submit form[name=productViewForm]"(event, template) {
    template.state.set("renderTemplate", "");
    event.preventDefault();
    showYear(template);
  },

  "change select[id=year]"(event, template) {
    event.preventDefault();
    template.state.set("renderTemplate", "");
  },

  "change select[id=month]"(event, template) {
    event.preventDefault();
    template.state.set("renderTemplate", "");
  },

  "change select[id=week]"(event, template) {
    event.preventDefault();
    template.state.set("renderTemplate", "");
  }
});

Template.analyticsProductsSold.helpers({
  messages() {
    return Template.instance().formMessages.get();
  },

  hasError(error) {
    if (error !== true && typeof error !== "undefined") {
      return "has-error has-feedback";
    }

    return false;
  },

  showTemplate() {
    const instance = Template.instance();
    return instance.state.get("renderTemplate");
  },

  showYears() {
    return analysisData.year;
  },

  showMonths() {
    return analysisData.month;
  },

  showWeeks() {
    return analysisData.week;
  }
});

Template.analyticsYearView.onRendered(function () {
  analysisData.monthCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  Meteor.call("analytics/getorders", (error, result) => {
    result.forEach((order) => {
      if (order.updatedAt.getFullYear() === Number(views.year.trim())) {
        getYearOrders(order.updatedAt, order.items.length);
      }
    });
    displayYearChart();
  });
});

Template.analyticsYearView.helpers({
  year() {
    return views.year.trim();
  }
});

const getWeek = (date)=> {
  const thisDate = date.getDate();
  const day = date.getDay();

  return Math.ceil((thisDate - 1 - day) / 7);
};

const getMonthOrders = (date, length)=> {
  const weekOfMonth = getWeek(date);
  analysisData.weekCount[weekOfMonth] = analysisData.weekCount[weekOfMonth] + length;
};

displayMonthChart = function () {
  const ctx = document.getElementById("monthChart");
  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: analysisData.week,
      datasets: [{
        label: "# Number of Sales per Week",
        data: analysisData.weekCount,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
};

Template.analyticsMonthView.onRendered(function () {
  analysisData.weekCount = [0, 0, 0, 0, 0, 0];
  Meteor.call("analytics/getorders", (error, result) => {
    result.forEach((order) => {
      const theYear = order.updatedAt.getFullYear() === Number(views.year.trim());
      const theMonth = analysisData.month[order.updatedAt.getMonth()] === views.month.trim();
      if (theYear && theMonth) {
        getMonthOrders(order.updatedAt, order.items.length);
      }
    });
    displayMonthChart();
  });
});

Template.analyticsMonthView.helpers({
  year() {
    return views.year.trim();
  },

  month() {
    return views.month.trim();
  }
});

Template.analyticsWeekView.helpers({
  year() {
    return views.year.trim();
  },

  month() {
    return views.month.trim();
  },

  week() {
    return views.week.trim();
  }
});

let generateDates = true;

const getWeekOrders = (date, length)=> {
  const index = date.getDay();
  analysisData.dayCount[index] = analysisData.dayCount[index] + length;
  analysisData.day[index] = analysisData.day[index].match(/^\w+/) + " " + date.getDate()
      + " " + analysisData.month[date.getMonth()];
};

const displayWeekChart = ()=> {
  const ctx = document.getElementById("weekChart");
  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: analysisData.day,
      datasets: [{
        label: "# Number of Sales per Day",
        data: analysisData.dayCount,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
};

Template.analyticsWeekView.onRendered(function () {
  generateDates = true;
  analysisData.dayCount = [0, 0, 0, 0, 0, 0, 0];
  analysisData.day = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
  Meteor.call("analytics/getorders", (error, result) => {
    result.forEach((order) => {
      const theYear =
          order.updatedAt.getFullYear() === Number(views.year.trim());
      const month = order.updatedAt.getMonth();
      const theMonth =
          analysisData.month[month] === views.month.trim();
      const week = getWeek(order.updatedAt);
      const theWeek =
          analysisData.week[week] === views.week.trim();
      if (theYear && theMonth && theWeek) {
        getWeekOrders(order.updatedAt, order.items.length);
      }
    });
    displayWeekChart();
  });
});
