import asyncHandler from 'express-async-handler';
import Event from '../models/eventModel.js';

export const allEvents = asyncHandler(async (req, res) => {
  try {
    const events = await Event.find().populate('creator', '-password');
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
  if (!req.user) return res.status(400).send('user not found');
  if (
    !title ||
    !description ||
    !eventDate ||
    !eventTime ||
    !category ||
    !eventpic
  )
    return res.status(400).send('please fill all the fields');
  const user = req.user;

  try {
    var event = await Event.create({
      title,
      creator: user,
      eventDate,
      eventTime,
      description,
      eventpic,
      category,
    });

    event = await event.populate('creator', '-password').execPopulate();
    res.status(200).send(event);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const oneEvent = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const event = await Event.findById(id).populate('creator', '-password');
    if (!event) return res.status(400).send('no event found');

    res.status(200).send(event);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const editEvent = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!req.body)
    return res.status(400).send('Data to update can not be empty!');
  const event = await Event.findById(id);
  if (!event) return res.status(400).send('no event found');
  try {
    const eventUpdate = await Event.findByIdAndUpdate(id, req.body, {
      useFindAndModify: false,
    }).populate('creator', 'name');
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
      'creator',
      'name'
    );
    if (!event) return res.status(400).send('no event found');
    res.status(200).send(event);
  } catch (error) {
    res.status(400).send('filter error');
    throw new Error(error.message);
  }
});

export const deleteEvent = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const event = await Event.findById(id);
  if (!event) return res.status(400).send('no event found');
  try {
    const events = await Event.findByIdAndRemove(id);
    res.status(200).send('Deleted successfuly');
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const registerForEvent = asyncHandler(async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user._id;

  try {
    // Verificar se o evento existe
    const event = await Event.findById(eventId);
    if (!event) {
      res.status(404).send('Evento não encontrado');
      return;
    }

    // Verificar se o usuário já está inscrito no evento
    if (event.registrations.includes(userId)) {
      res.status(400).send('Usuário já está inscrito neste evento');
      return;
    }

    // Adicionar o usuário à lista de inscrições do evento
    event.registrations.push(userId);
    await event.save();

    res.status(200).send('Inscrição no evento realizada com sucesso');
  } catch (error) {
    res.status(400).send('Erro ao realizar a inscrição no evento');
  }
});
