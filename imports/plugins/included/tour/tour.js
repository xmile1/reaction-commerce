import Shepherd from "tether-shepherd";
import "/node_modules/tether-shepherd/dist/css/shepherd-theme-arrows.css";

const welcomeText = `With Reaction commerce:
<ul>
  <li> Access dashboard </li>
  <li> Create and Modify your products </li>
  <li> View orders made on your products </li>
  <li> Manage registerd users accounts </li>
  <li> Add Shop members </li>
  <li> Receive or make online payments for goods </li>
</ul>`;

export const tour = new Shepherd.Tour({
  defaults: {
    showCancelLink: true,
    scrollTo: true,
    classes: "shepherd-theme-arrows"
  }
});

tour.addStep("Welcome", {
  title: "Welcome to Reaction Commerce",
  text: welcomeText,
  attachTo: ".admin-controls-quicklinks",
  advanceOn: ".docs-link click"
});

tour.addStep("Product", {
  title: "Create Product",
  text: "Click to create your product. Once the window is opened, enter your product details.",
  attachTo: ".contents left",
  advanceOn: ".docs-link click"
});

tour.addStep("Dashboard", {
  title: "Dashboard",
  text: "You can check and modify things here",
  attachTo: ".icon-reaction-logo right",
  advanceOn: ".docs-link clink"
});

tour.addStep("Orders", {
  title: "Orders",
  text: "See a list of orders made on your products",
  // attachTo: ".orders right",
  advanceOn: ".docs-link clink"
});

tour.addStep("User Accounts", {
  title: "User Accounts",
  text: "See a list of user accounts and guests, <br> modify account settings and add Shop members",
  // attachTo: ".user-accounts right",
  advanceOn: ".docs-link clink"
});
