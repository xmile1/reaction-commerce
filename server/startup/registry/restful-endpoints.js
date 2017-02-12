import { Shops, Products, Orders, Cart, Accounts, Emails } from "/lib/collections";

export default () => {

	//Global API configuration
	const Api = new Restivus({
		useDefaultAuth: true,
		prettyJson: true,
		defaultHeaders: {
			'Content-Type': 'application/json'
		},
	});

	const getApiOptions = (collectionName) => {
		return {
			endpoints: {
				//get all items in collections
				get: {
					authRequired: false,
					action: () => {
						const allRecords = collectionName.find();
						if (allRecords) {
							return { status: 'success', data: allRecords }
						}
						return { status: 'fail', message: 'error' };
					}
				},

				//insert into the collection
				post: {
					action: () => {
						const isInserted = collectionName.insert(this.bodyParams);
						if (isInserted) {
							return { status: 'success', data: isInserted }
						}

						return { status: 'fail', message: 'error' }
					}
				},

				//update a collection
				put: {
					action: () => {
						const isUpdated = collection.update(this.urlParams.id, {
							$set: this.bodyParams
						});
						if (isUpdated) {
							return { status: 'success', data: isUpdated }
						}
						return { status: 'fail', message: 'record not found' }
					}
				},

				//delete a record
				delete: () => {
					const isDeleted = collection.remove(this.urlParams.id);

					if (isDeleted) {
						return { status: 'success', data: { message: 'record deleted' } }
					}
				}
			}
		}
	}

	Api.addCollection(Shops, getApiOptions(Shops));
	Api.addCollection(Products, getApiOptions(Products));
	Api.addCollection(Orders, getApiOptions(Orders));
	Api.addCollection(Cart, getApiOptions(Cart));
	Api.addCollection(Accounts, getApiOptions(Accounts));
	Api.addCollection(Emails, getApiOptions(Emails));
}