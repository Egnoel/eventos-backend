import asyncHandler from "express-async-handler";
import Event from "../models/eventModel.js";
import User from "../models/userModel.js";

export const allEvents = asyncHandler(async (req, res) => {
  try {
    const events = await Event.find().populate("creator", "-password");
    const limit = req.query.limit || events.length;
    res.status(200);
    res.json(events.slice(0, limit));
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const createEvent = asyncHandler(async (req, res) => {
  const { title, eventDate, eventTime, description, category, eventpic } =
    req.body;
  const { _id } = req.user;
  if (
    !title ||
    !description ||
    !eventDate ||
    !eventTime ||
    !category ||
    !eventpic
  )
    return res.status(400).send("please fill all the fields");
  const user = await User.findById(_id);

  try {
    var event = await Event.create({
      title,
      creator: user,
      eventDate,
      eventTime,
      description,
      eventpic,
      category,
      registrations: [],
      favourites: [],
    });

    event = await event.populate("creator", "-password").execPopulate();
    user.createdEvents.push(event._id);
    await user.save();
    res.status(200).send(event);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const oneEvent = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const event = await Event.findById(id).populate("creator", "-password");
    if (!event) return res.status(400).send("no event found");

    res.status(200).send(event);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const editEvent = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!req.body)
    return res.status(400).send("Data to update can not be empty!");
  const event = await Event.findById(id);
  if (!event) return res.status(400).send("no event found");
  try {
    const eventUpdate = await Event.findByIdAndUpdate(id, req.body, {
      useFindAndModify: false,
    }).populate("creator", "name");
    res.status(200).send(eventUpdate);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const filterEvents = asyncHandler(async (req, res) => {
  const category = req.body.category;
  try {
    const event = await Event.find({ category: category }).populate(
      "creator",
      "name"
    );
    if (!event) return res.status(400).send("no event found");
    res.status(200).send(event);
  } catch (error) {
    res.status(400).send("filter error");
    throw new Error(error.message);
  }
});

export const deleteEvent = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const event = await Event.findById(id);
  if (!event) return res.status(400).send("no event found");
  try {
    await Event.findByIdAndRemove(id);
    res.status(200).send("Deleted successfuly");
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const myEvents = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const user = await User.findById(_id);
    if (!user) return res.status(400).send("no user found");
    const events = await Event.find({ creator: user._id });
    res.status(200).send(events);
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "Erro ao buscar eventos do usuário",
    });
  }
});

export const myFavorites = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const favorites = await User.findById(_id).populate("favorites");
    if (!favorites) return res.status(400).send("no user found");
    res.status(200).send(favorites.favorites);
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "Erro ao buscar eventos favoritos do usuário",
    });
  }
});
