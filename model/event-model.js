var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var eventSchema = new Schema({
  eventName: { type: String },
  eventStartDateTime: { type: String },
  eventEndDateTime: { type: String },
  place: { type: String },
  description: { type: String },
  registerCompanyList: [
    {
      registerInfo: { type: Number, ref: "registerCompanySchema" }
    }
  ]
});

module.exports = mongoose.model("events", eventSchema);
