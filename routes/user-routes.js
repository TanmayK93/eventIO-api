const express = require("express");
const userRoutes = express.Router();
const bcrypt = require("bcryptjs");
const qrcode = require("qrcode");

var mongoose = require("mongoose");

var ObjectId = mongoose.Schema.Types.ObjectId;

// Require Post model in our routes module
let UserModel = require("../model/user-model");
let RegisterCompanyModel = require("../model/registerCompany-model");
let companyDetailModel = require("../model/companyDetail-model.js");

// Defined get data(index or listing) route
userRoutes.route("/").get(function(req, res) {
  UserModel.find(function(err, User) {
    if (err) {
      res.json(err);
    } else {
      res.json(User);
    }
  });
});

userRoutes.route("/userdetails/:uid").get(function(req, res) {
  UserModel.find({ _id: { $eq: req.params.uid } }, function(err, user) {
    if (err) {
      res.json(err);
    } else {
      var resultArray = [];
      var formattedarray = user.map(function(obj, index, arr) {
        var resultData = {
          id: obj._id,
          email: obj.email
        };
        resultArray.push(resultData);
      });
      res.json(resultArray);
    }
  });
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Defined store route
userRoutes.route("/add").post(function(req, res) {
  UserModel.find({ email: { $eq: req.body.email } }, async function(
    err,
    result,
    next
  ) {
    if (result.length == 0) {
      let salt = bcrypt.genSaltSync(10);
      let hashpass = bcrypt.hashSync(req.body.password, salt);
      let user = new UserModel({
        companyName: req.body.companyName,
        email: req.body.email,
        password: hashpass
      });
      await user.save();

      let companyDetails = new companyDetailModel({
        companyName: req.body.companyName,
        companyLogo: new String(""),
        email: req.body.email,
        website: new String(""),
        linkedInProfile: new String(""),
        twitterProfile: new String(""),
        facebookProfile: new String(""),
        category: new String(""),
        companyAddress: new String(""),
        companyPhone: new String(""),
        fulltimepositions: new String(""),
        parttimepositions: new String(""),
        cooptimepositions: new String(""),
        employmentType: new String("")
      });
      await companyDetails.save();
      let cid = "";
      let cname = "";
      let cemail = "";
      companyDetailModel.find({ email: { $eq: req.body.email } }, function(
        err,
        result
      ) {
        //console.log(result);
        if (err) throw err;
        cid = result[0].id;
        cname = result[0].companyName;
        cemail = result[0].email;
      });
      console.log("Hello");
      UserModel.find({ email: { $eq: req.body.email } }, async function(
        err,
        user
      ) {
        if (user) {
          await sleep(200);
          await run(cid).catch(error => console.error(error.stack));
          res.status(200).json({ User: "User in Registered successfully" });
        } else {
          res.status(401).json({
            status: 401,
            message: "Error"
          });
        }
      });
    } else {
      res.status(404).json({ message: "User Already Exists." });
    }
  });
});

async function run(userid) {
  await sleep(200);
  //console.log("Run Block");
  //Check this for getting bootid
  var bootIdCount = await RegisterCompanyModel.aggregate([
    {
      $project: { NumberOfItemsInArray: { $size: "$otherInfo.companyId" } }
    }
  ]);
  const qrcodeData = await qrcode.toDataURL(userid.toString());
  RegisterCompanyModel.findOne(
    { event: { $eq: "5dc97f84127ae3415964145e" } },
    async function(err, register) {
      console.log("1st Block");
      if (register) {
        var query2 = RegisterCompanyModel.update(
          { event: "5dc97f84127ae3415964145e" },
          {
            $addToSet: {
              otherInfo: [
                {
                  companyId: userid,
                  boothId: bootIdCount[0].NumberOfItemsInArray + 1,
                  qrcode: qrcodeData
                }
              ]
            }
          }
        );
        await query2.exec();
        console.log("done2");
      } else {
        register = new RegisterCompanyModel({
          event: "5dc97f84127ae3415964145e",
          otherInfo: [
            {
              companyId: userid,
              boothId: bootIdCount[0].NumberOfItemsInArray + 1,
              qrcode: qrcodeData
            }
          ]
        });
        await register.save();
      }
    }
  );
}

userRoutes.route("/login").post((req, res) => {
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(req.body.password, salt);
  UserModel.find(
    {
      email: req.body.email
    },
    function(err, user) {
      if (err) {
        res.send(err);
      }
      if (user.length === 0) {
        res.status(401).json({
          status: 401,
          message: "Unauthorized credentials mismatch"
        });
      }
      var resultArray = [];
      var formattedarray = user.map(function(obj, index, arr) {
        var isValid = bcrypt.compareSync(req.body.password, obj.password);
        if (isValid) {
          var resultData = {
            id: obj._id,
            email: obj.email,
            companyName: obj.companyName
          };
          resultArray.push(resultData);
          res.json(resultArray);
        } else {
          res.status(401).json({
            status: 401,
            message: "Unauthorized credentials mismatch"
          });
        }
      });
    }
  );
});

userRoutes.route("/update").post(function(req, res) {
  Post.findById({ _id: req.body.userid }, function(err, user) {
    if (!user) res.status(404).send("data is not found");
    else {
      let salt = bcrypt.genSaltSync(10);
      let hashpass = bcrypt.hashSync(req.body.password, salt);
      user.password = hashpass;
      user
        .save()
        .then(() => {
          res.json("User Data Updated.");
        })
        .catch(() => {
          res.status(400).send("unable to update the database");
        });
    }
  });
});

module.exports = userRoutes;
