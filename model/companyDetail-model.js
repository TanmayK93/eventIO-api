const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let companyDetailSchema = new Schema({
  companyName: { type: String, default: "" },
  organizationProfile: { type: String, default: "" },
  companyLogo: { type: String, default: "" },
  email: { type: String, default: "" },
  website: { type: String, default: "" },
  linkedInProfile: { type: String, default: "" },
  twitterProfile: { type: String, default: "" },
  facebookProfile: { type: String, default: "" },
  category: { type: String, default: "" },
  companyAddress: { type: String, default: "" },
  companyPhone: { type: String, default: "" },
  profile: { type: String, default: "" },
  fulltimepositions: { type: String, default: "" },
  parttimepositions: { type: String, default: "" },
  cooptimepositions: { type: String, default: "" },
  location: { type: String }
});

module.exports = mongoose.model("companyDetail", companyDetailSchema);
