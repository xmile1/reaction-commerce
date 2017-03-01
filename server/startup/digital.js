import { Accounts } from "/lib/collections/";

export default function () {
  Slingshot.fileRestrictions("uploadToAmazonS3", {
    allowedFileTypes: [
      "image/jpeg",
      "audio/mp3",
      "application/pdf",
      "application/msword",
      "application/msexcel"
    ],
    maxSize: 20 * 1024 * 1024
  });

  Slingshot.createDirective("uploadToAmazonS3", Slingshot.S3Storage, {
    AWSAccessKeyId: process.env.AWSAccessKeyId,
    AWSSecretAccessKey: process.env.AWSSecretAccessKey,
    bucket: "kissa-test",
    acl: "public-read",
    authorize: function () {
      if (Roles.userIsInRole(this.userId, ["owner", "admin"], Roles.GLOBAL_GROUP)) {
        return true;
      }
      return false;
    },
    key: function (file) {
      const users = Accounts.findOne(this.userId);
      const results = users.emails[0].address + "/" + file.name;
      return results;
    }
  });
}
