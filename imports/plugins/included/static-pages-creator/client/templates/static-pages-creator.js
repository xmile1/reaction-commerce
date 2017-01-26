import SimpleMDE from "simplemde";
import { Template } from "meteor/templating";
import { StaticPages } from "/lib/collections";
import * as Collections from "/lib/collections";
import "./static-pages-creator.html";
import "/node_modules/simplemde/dist/simplemde.min.css";
import { Reaction } from "/client/api";
import { FlatButton } from "/imports/plugins/core/ui/client/components";
import { Alerts, Alert } from "/imports/plugins/core/ui/client/components";

let simplemde;
Template.staticPages.onRendered(function () {
  $("#main").css("overflow", "visible");

  simplemde = new SimpleMDE({
    element: document.getElementById("editormd"),
    autofocus: true
  });

  $(".editor-toolbar").append('<a id="static-pages-submit" title="Save" tabindex="-1" class="fa fa-floppy-o static-pages-new"></a>');
});

Template.staticPages.helpers({
  baseUrl() {
    return window.location.host;
  },
  userPages() {
    return StaticPages.find({shopId: Reaction.shopId}).fetch();
  }

  // IconButtonComponent() {
  //   return {
  //     component: FlatButton,
  //     icon: "fa fa-plus",
  //     kind: "flat",
  //     onClick() {
  //       $("#static-page-title").val("");
  //       $("#static-page-slug").val("");
  //       simplemde.value("");
  //       $("#static-pages-submit").addClass("static-pages-new").removeClass("static-pages-update").text("Create");
  //     }
  //   };
  // }
});

Template.staticPages.events({
  "click .static-pages-new": function (event, template) {
    const title = $("#static-page-title").val();
    const slug = $("#static-page-slug").val();
    const shopId = Reaction.shopId;
    const pageOwner = Meteor.user()._id;
    const content = simplemde.value();
    const createdAt = new Date();
    Meteor.call("insertPage", title, slug, content, shopId, pageOwner,  createdAt);
  },
  "click .static-pages-update": function (event, template) {
    const _id = $("#static-page-id").val();
    const title = $("#static-page-title").val();
    const slug = $("#static-page-slug").val();
    const shopId = Reaction.shopId;
    const pageOwner = Meteor.user()._id;
    const content = simplemde.value();
    const createdAt = new Date();

    Meteor.call("updatePage", _id, title, slug, content, shopId);
  },
  "click #static-pages-menu-toggle": function (event, template) {
    event.preventDefault();
    $("#static-pages-wrapper").toggleClass("active");
    $("#static-pages-menu-toggle > i").toggleClass("fa-toggle-on fa-toggle-off");
    $("#static-pages-menu-toggle").toggleClass("static-pages-menu-adjust");
  },
  "click .editPage": function (event, template) {
    const _id = $(event.currentTarget).parents("tr").attr("id");
    const pageDetails = StaticPages.find({_id}).fetch();
    $("#static-page-title").val(pageDetails[0].title);
    $("#static-page-slug").val(pageDetails[0].slug);
    $("#static-page-id").val(pageDetails[0]._id);
    simplemde.value(pageDetails[0].content);
    $("#static-pages-submit").removeClass("static-pages-new").addClass("static-pages-update").title("Update");
  },
  "click .deletePage": function (event, template) {
    // Call Are you sure you want to delete
    const _id = $(event.currentTarget).parents("tr").attr("id");
    Meteor.call("deletePage", _id);
  },
  "click .addPage": function (event, template) {
    $("#static-page-title").val("");
    $("#static-page-slug").val("");
    simplemde.value("");
    $("#static-pages-submit").addClass("static-pages-new").removeClass("static-pages-update").text("Create");
  }
});
