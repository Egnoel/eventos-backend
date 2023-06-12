import asyncHandler from "express-async-handler";
import Inscription from "../models/inscriptionModel.js";
import Event from "../models/eventModel.js";

export const subscribe = asyncHandler(async (req, res) => {
  console.log("entrou");
  if (!req.user) return res.status(400).send("user not found");
  const event = await Event.findById(req.params.eventID);
  if (!event) return res.status(400).send("event not found");
  const user = req.user;
  try {
    var signed = await Inscription.create({
      participant: user,
      event: event,
    });
    signed = await signed
      .populate("participant", "-password")
      .populate("event")
      .execPopulate();
    res.status(200).json(signed);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const subscribed = asyncHandler(async (req, res) => {
  try {
    const sub = await Inscription.find({ event: req.params.eventID }).populate(
      "participant",
      "firstName lastName pic email"
    );
    res.json(sub);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
