import { Template } from "meteor/templating";
import { Meteor } from "meteor/meteor";
import { Products} from "/lib/collections";

import "./review.html";

Template.digitalProduct.onRendered(function () {
  const digital = Products.findOne().isDigital;
  if (digital) {
    document.getElementById("digital").defaultChecked = true;
    document.getElementById("showUrl").style.display = "block";
  }
});

Template.digitalProduct.events({
  "click #digital": () => {
    const productId = Products.findOne()._id;
    if (document.getElementById("digital").checked) {
      document.getElementById("showUrl").style.display = "block";
      Meteor.call("products/updateProductField", productId, "isDigital", true);
    }    else {
      document.getElementById("showUrl").style.display = "none";
      Meteor.call("products/updateProductField", productId, "isDigital", false);
      Meteor.call("products/updateProductField", productId, "downloadUrl", "");
    }
  },

  "change #file-input": (event) => {
    const productId = Products.findOne()._id;
    const file = event.target.files[0];
    if (file.size > 5242880) {
      Alerts.toast("file is too large");
      document.getElementById("file-input").value = "";
      return;
    }
    Alerts.toast("Successfully upload item", "success");
    const uploader = new Slingshot.Upload("uploadToAmazonS3");
    uploader.send(file, (error, url) => {
      if (error) {
        Alerts.toast(error.message, "error");
      } else {
        Meteor.call("products/updateProductField", productId, "downloadUrl", url);
        Alerts.toast("Successfully upload item", "success");
      }
    });
  }
});

Template.digitalProduct.helpers({
  downloadLink() {
    return Products.findOne().downloadUrl;
  }
});

Template.showDigitalDetail.onRendered(function () {
  const digital = Products.findOne().isDigital;
  const link =  Products.findOne().downloadUrl;
  if (digital && link) {
    document.getElementById("showDetails").style.display = "block";
  }
});
