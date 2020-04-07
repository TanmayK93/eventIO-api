const express = require("express");
const registerRoutes = express.Router();

// Require Event model in our routes module
let registerModel = require("../model/registerCompany-model");
let companyModel = require("../model/companyDetail-model");

registerRoutes.route("/getallDetails").get(function(req, res) {
  registerModel
    .find()
    .populate("event")
    .populate("otherInfo.companyId")
    .exec(function(err, companyData) {
      if (err) return handleError(err);
      res.json(companyData[0].otherInfo);
    });
});

registerRoutes.route("/").get(function(req, res) {
  registerModel
    .find({ event: "5dc97f84127ae3415964145e" })
    .populate("otherInfo.companyId")
    .exec(function(err, companyData) {
      if (err) return handleError(err);
      let ArrayData = [];
      for (step = 0; step < companyData.length; step++) {
        data = companyData[step].otherInfo.map(function(obj, index, arr) {
          newobj = obj;
          ArrayData.push(newobj);
        });
      }
      var resultArray = {};
      resultArray = [];
      var formattedarray = ArrayData.map(function(obj, index, arr) {
        var resultData = {
          boothId: obj.boothId,
          beaconDeviceFlag: obj.beaconDeviceFlag,
          companyId: obj.companyId._id,
          companyName: obj.companyId.companyName,
          organizationProfile: obj.companyId.organizationProfile,
          companyLogo: obj.companyId.companyLogo,
          email: obj.companyId.email,
          website: obj.companyId.website,
          linkedInProfile: obj.companyId.linkedInProfile,
          twitterProfile: obj.companyId.twitterProfile,
          facebookProfile: obj.companyId.facebookProfile,
          category: obj.companyId.category,
          companyAddress: obj.companyId.companyAddress,
          companyPhone: obj.companyId.companyPhone,
          fulltimepositions: obj.companyId.fulltimepositions,
          parttimepositions: obj.companyId.parttimepositions,
          cooptimepositions: obj.companyId.cooptimepositions
        };
        resultArray.push(resultData);
      });
      res.json(resultArray);
    });
});

registerRoutes.route("/getinfo/:email").post(function(req, res) {
  registerModel
    .find({ event: "5dc97f84127ae3415964145e" })
    .populate("otherInfo.companyId")
    .exec(function(err, companyData) {
      if (err) return handleError(err);
      let ArrayData = [];
      for (step = 0; step < companyData.length; step++) {
        data = companyData[step].otherInfo.map(function(obj, index, arr) {
          if (obj.companyId.email == req.params.email) {
            newobj = obj;
            ArrayData.push(newobj);
          }
        });
      }
      var resultArray = {};
      resultArray = [];
      var formattedarray = ArrayData.map(function(obj, index, arr) {
        var resultData = {
          boothId: obj.boothId,
          beaconDeviceFlag: obj.beaconDeviceFlag,
          companyId: obj.companyId._id,
          companyName: obj.companyId.companyName,
          organizationProfile: obj.companyId.organizationProfile,
          companyLogo: obj.companyId.companyLogo,
          email: obj.companyId.email,
          website: obj.companyId.website,
          linkedInProfile: obj.companyId.linkedInProfile,
          twitterProfile: obj.companyId.twitterProfile,
          facebookProfile: obj.companyId.facebookProfile,
          category: obj.companyId.category,
          companyAddress: obj.companyId.companyAddress,
          companyPhone: obj.companyId.companyPhone,
          fulltimepositions: obj.companyId.fulltimepositions,
          parttimepositions: obj.companyId.parttimepositions,
          cooptimepositions: obj.companyId.cooptimepositions,
          qrcode: obj.qrcode,
          beaconDeviceFlag: obj.beaconDeviceFlag
        };
        resultArray.push(resultData);
      });
      res.json(resultArray);
    });
});

registerRoutes
  .route("/updateBeaconStatus/:boothId/:beaconDeviceFlag")
  .post(async function(req, res) {
    var query = registerModel.updateOne(
      {
        event: "5dc97f84127ae3415964145e",
        "otherInfo.boothId": { $eq: req.params.boothId }
      },
      {
        $set: { "otherInfo.$.beaconDeviceFlag": req.params.beaconDeviceFlag }
      }
    );
    await query.exec();
  });

module.exports = registerRoutes;
