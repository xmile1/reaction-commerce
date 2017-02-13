import { Shops, Products, Orders, Cart, Accounts, Emails } from "/lib/collections";

export default () => {
  // Global API configuration
  const Api = new Restivus({
    useDefaultAuth: true,
    prettyJson: true,
    defaultHeaders: {
      "Content-Type": "application/json"
    }
  });

  const getApiOptions = (collectionName) => {
    return {
      routeOptions: {
        authRequired: true
      },
      endpoints: {
        // GET all items in collection
        get: {
          authRequired: false,
          action() {
            const allRecords = collectionName.find();
            if (allRecords) {
              return { statusCode: 201, status: "success", data: allRecords };
            }
            return {
              statusCode: 404,
              status: "fail",
              message: "error"
            };
          }
        },

        // POST into a collection
        post: {
          action() {
            const isInserted = collectionName.insert(this.bodyParams);
            if (isInserted) {
              return { statusCode: 201, status: "success", data: isInserted };
            }

            return { status: "fail", message: "error" };
          }
        },

        // UPDATE a collection
        put: {
          action() {
            const isUpdated = collectionName.update(this.urlParams.id, {
              $set: this.bodyParams
            });
            if (isUpdated) {
              return { statusCode: 201, status: "success", data: isUpdated };
            }
            return { status: "fail", message: "record not found" };
          }
        },

        // DELETE an record in a collection
        delete: {
          action() {
            const isDeleted = collectionName.remove(this.urlParams.id);

            if (isDeleted) {
              return { status: "success", data: { message: "record deleted" } };
            }
            return { status: "fail", message: "record not found" };
          }
        }
      }
    };
  };

  Api.addCollection(Shops, getApiOptions(Shops));
  Api.addCollection(Products, getApiOptions(Products));
  Api.addCollection(Orders, getApiOptions(Orders));
  Api.addCollection(Cart, getApiOptions(Cart));
  Api.addCollection(Accounts, getApiOptions(Accounts));
  Api.addCollection(Emails, getApiOptions(Emails));
};
