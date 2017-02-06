import { SimpleSchema } from "meteor/aldeed:simple-schema";
import { PackageConfig } from "/lib/collections/schemas/registry";


export const NotificationPackageConfig = new SimpleSchema([
  PackageConfig, {
    "settings.mode": {
      type: Boolean,
      defaultValue: true
    },
    "settings.authToken": {
      type: String,
      label: "Public Key",
      optional: true
    },
    "settings.accSid": {
      type: String,
      label: "Secret Key",
      optional: true
    }
  }
]);
