const express = require("express");
const companyDetailRoutes = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "uploads/companyLogo");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

// Require CompanyDetail model in our routes module
let companyDetailModel = require("../model/companyDetail-model.js");

// Defined get data(index or listing) route
companyDetailRoutes.route("/").get(function(req, res) {
  companyDetailModel.find(function(err, companyDetail) {
    if (err) {
      res.json(err);
    } else {
      res.json(companyDetail);
    }
  });
});

companyDetailRoutes.post(
  "/update/:email",
  upload.single("companyLogo"),
  async function(req, res, next) {
    var myquery = { email: req.params.email };
    if (!req.file) {
      var values = {
        organizationProfile: req.body.organizationProfile,
        website: req.body.website,
        linkedInProfile: req.body.linkedInProfile,
        twitterProfile: req.body.twitterProfile,
        facebookProfile: req.body.facebookProfile,
        category: req.body.category,
        companyAddress: req.body.companyAddress,
        companyPhone: req.body.companyPhone,
        fulltimepositions: req.body.fulltimepositions,
        parttimepositions: req.body.parttimepositions,
        cooptimepositions: req.body.cooptimepositions
      };
    } else {
      var str = req.file.path;
      var replace = str.replace("uploads/companyLogo", "ftp/companyLogo");
      var resLogo = "https://event-me-2019.herokuapp.com/" + replace;
      var values = {
        organizationProfile: req.body.organizationProfile,
        companyLogo: resLogo,
        website: req.body.website,
        linkedInProfile: req.body.linkedInProfile,
        twitterProfile: req.body.twitterProfile,
        facebookProfile: req.body.facebookProfile,
        category: req.body.category,
        companyAddress: req.body.companyAddress,
        companyPhone: req.body.companyPhone,
        fulltimepositions: req.body.fulltimepositions,
        parttimepositions: req.body.parttimepositions,
        cooptimepositions: req.body.cooptimepositions
      };
    }
    companyDetailModel.findOne(myquery, async function(err, cdata) {
      if (cdata) {
        var query = companyDetailModel.updateOne(myquery, values);
        await query.exec();
        res
          .status(200)
          .json({ message: "Company Information updated successfully" });
      } else {
        res.status(401).json({ message: "Company Information not found" });
      }
    });
  }
);

companyDetailRoutes.route("/getinfo/:email").post(function(req, res) {
  companyDetailModel.find({ email: { $eq: req.params.email } }, function(
    err,
    companyDetail
  ) {
    if (err) {
      res.json(err);
    } else if (companyDetail.length != 0) {
      res.json(companyDetail);
    } else {
      res.json({ message: "No Record Found" });
    }
  });
});

module.exports = companyDetailRoutes;
