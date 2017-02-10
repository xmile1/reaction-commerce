import { SimpleSchema } from "meteor/aldeed:simple-schema";
import { PackageConfig } from "/lib/collections/schemas/registry";


export const TwilloPackageConfig = new SimpleSchema([
  PackageConfig, {
    "settings.api.twillo.accSid": {
      type: String,
      label: "Account sid",
      optional: true
    },
    "settings.api.twillo.authToken": {
      type: String,
      label: "Authentication Token",
      optional: true
    },
    "settings.api.twillo.phoneNumber": {
      type: String,
      label: "Twillo Phone Number",
      optional: true
    }
  }
]);

export const JusibePackageConfig = new SimpleSchema([
  PackageConfig, {
    "settings.api.jusibe.accessToken": {
      type: String,
      label: "Jusibe Access Token",
      optional: true
    },
    "settings.api.jusibe.publicKey": {
      type: String,
      label: "Jusibe Public Key",
      optional: true
    },
    "settings.api.jusibe.phoneNumber": {
      type: String,
      label: "Shop Name",
      optional: true
    }
  }
]);

export const DefaultPackageConfig = new SimpleSchema([
  PackageConfig, {
    "settings.default": {
      type: String,
      optional: true,
      defaultValue: "twilio",
      allowedValues: ["jusibe", "twilio"],
      // label: false,
      autoform: {
        afFieldInput: {
          type: "radio"
        }
      }
    }
  }
]);
