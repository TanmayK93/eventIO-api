const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let registerCompanySchema = new Schema({
  event: { type: mongoose.SchemaTypes.ObjectId, ref: "events" },
  otherInfo: [
    {
      companyId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "companyDetail"
      },
      boothId: { type: Number, default: 1, unique: true },
      qrcode: { type: String },
      beaconDeviceFlag: { type: Boolean, default: false }
    }
  ]
});

module.exports = mongoose.model("registerCompany", registerCompanySchema);
