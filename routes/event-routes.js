const express = require("express");
const eventRoutes = express.Router();

// Require Event model in our routes module
let eventModel = require("../model/event-model.js");

// Defined get data(index or listing) route
eventRoutes.route("/").get(function(req, res) {
  eventModel.find(function(err, event) {
    if (err) {
      res.json(err);
    } else {
      res.json(event);
    }
  });
});

eventRoutes.route("/add").post(function(req, res) {
  let event = new eventModel({
    eventName: req.body.eventName,
    eventStartDateTime: req.body.eventStartDateTime,
    eventEndDateTime: req.body.eventEndDateTime,
    place: req.body.place,
    description: req.body.description,
    registerCompanyList: []
  });
  event
    .save()
    .then(() => {
      res.status(200).json({ User: "Event created successfully" });
    })
    .catch(() => {
      res.status(400).send("unable to save Event Information to database");
    });
});

eventRoutes.route("/delete/:id").delete(function(req, res) {
  let eventId = req.params.id;

  eventModel.findOne({ _id: { $eq: eventId } }, async function(err, event) {
    if (event) {
      var query = eventModel.deleteOne({
        _id: eventId
      });
      await query.exec();
      res.status(200).json({ Cart: "Event Deleted successfully." });
    } else {
      res.status(400).json("Event not found.");
    }
  });
});

module.exports = eventRoutes;
