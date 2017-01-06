import Shepherd from "tether-shepherd";
import "/node_modules/tether-shepherd/dist/css/shepherd-theme-arrows.css";

export const tour = new Shepherd.Tour({
  defaults: {
    classes: "shepherd-theme-arrows"
  }
});

tour.addStep("example", {
  title: "Example Shepherd",
  text: "Creating a Shepherd is easy too! Just create ...",
  attachTo: ".admin-controls-quicklinks",
  advanceOn: ".docs-link click"
});

tour.addStep("example", {
  title: "Examp2 ",
  text: "Creating 2 Shepherd is easy too! Just create ...",
  attachTo: ".admin-controls-quicklinks",
  advanceOn: ".docs-link click"
});
