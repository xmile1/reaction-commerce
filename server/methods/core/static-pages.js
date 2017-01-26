import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import {StaticPages } from "/lib/collections";
import * as Collections from "/lib/collections";
import * as Schemas from "/lib/collections/schemas";

Meteor.methods({
  /**
   * @summary - Creates a Static Page
   * @param{String} name - The name of the page
   * @param{String} title - The title of the page
   * @param{String} body - The body of the page
   */
  insertPage: function (title, slug, content, shopId, pageOwner, createdAt) {
    check(title, String);
    check(slug, String);
    check(content, String);
    check(shopId, String);
    check(pageOwner, String);
    check(createdAt, Date);

    const page = {
      title: title,
      slug: slug,
      content: content,
      shopId: shopId,
      pageOwner: pageOwner,
      createdAt: createdAt
    };
    check(page, Schemas.StaticPages);
    Collections.StaticPages.insert(page);
  },

  /**
   * @summary - Updates a Static Page
   * @param{String} pageId - The page to be updated
   * @param{String} name - The new name for the page
   * @param{String} title - The new title for the page
   * @param{String} body - The new body for the page
   */
  "updatePage"(_id, title, slug, content, shopId) {
    check(_id, String);
    check(title, String);
    check(slug, String);
    check(content, String);
    check(shopId, String);

    const page = {
      title,
      slug,
      content,
      shopId
    };
    check(page, Schemas.StaticPages);
    Collections.StaticPages.update(_id, {
      $set:
        page

    });
  },

  /**
   * @summary - Deletes a Static Page
   * @param{String} pageId - The id of the page
   */
  "deletePage"(_Id) {
    check(_Id, String);
    StaticPages.remove(_Id);
  }
});
