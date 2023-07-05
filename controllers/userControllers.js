import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../config/generateToken.js";
import Event from "../models/eventModel.js";

//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
export const allUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).send(users);
});

//@description     Register new user
//@route           POST /api/user/
//@access          Public
export const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, pic } = req.body;

  if (!firstName || !lastName || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    pic,
    favorites: [],
    createdEvents: [],
    signedEvents: [],
  });

  if (user) {
    const token = generateToken(user._id);
    res.status(201).json({
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        pic: user.pic,
        favorites: user.favorites,
        createdEvents: user.createdEvents,
        signedEvents: user.signedEvents,
      },
      token,
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    if (await user.matchPassword(password)) {
      const token = generateToken(user._id);
      res.status(200).json({
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          pic: user.pic,
          favorites: user.favorites,
          createdEvents: user.createdEvents,
          signedEvents: user.signedEvents,
        },
        token,
      });
    } else {
      res.status(401).json({ message: "Invalid Email or Password" });
    }
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "Erro ao realizar o login",
    });
  }
});

export const singleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json("Usuário não encontrado");
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "Erro ao localizar o usuário",
    });
  }
});

export const getUser = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json("Usuário não encontrado");
    }
    console.log(user);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "Erro ao localizar o usuário",
    });
  }
});

export const addFavoriteEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const { _id } = req.user;

  // Verificar se o evento já está nos favoritos do usuário
  const user = await User.findById(_id);
  if (user.favorites.includes(eventId)) {
    return res.status(400).json("Evento já está nos favoritos do usuário");
  }

  try {
    // Verificar se o evento existe
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json("Evento não encontrado");
    }

    // Adicionar o evento aos favoritos do usuário
    const newUser = await User.findByIdAndUpdate(
      _id,
      { $push: { favorites: eventId } },
      { new: true }
    );
    event.favourites.push(_id);
    await event.save();
    res.status(200).json({
      user: newUser,
      message: "Evento adicionado aos favoritos com sucesso!",
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "Erro ao adicionar evento aos favoritos",
    });
  }
});

export const removeFavoriteEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const { _id } = req.user;

  try {
    const user = await User.findById(_id);
    if (!user.favorites.includes(eventId)) {
      return res.status(400).json("Evento não está nos favoritos do usuário");
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json("Evento não encontrado");
    }

    const newUser = await User.findByIdAndUpdate(
      _id,
      { $pull: { favorites: eventId } },
      { new: true }
    );
    event.favourites.pull(_id);
    await event.save();
    res.status(200).json({
      user: newUser,
      message: "Evento removido dos favoritos com sucesso!",
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "Erro ao remover evento dos favoritos",
    });
  }
});

export const participateEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const { _id } = req.user;
  try {
    const user = await User.findById(_id);
    const event = await Event.findById(eventId);
    if (!user) {
      return res.status(404).json("Usuário não encontrado");
    }
    if (!event) {
      return res.status(404).json("Evento não encontrado");
    }

    if (user.signedEvents.includes(eventId)) {
      return res.status(400).json("Usuário já está inscrito neste evento");
    }

    const newUser = await User.findByIdAndUpdate(
      _id,
      { $push: { signedEvents: eventId } },
      { new: true }
    );
    event.registrations.push(_id);
    await event.save();
    res.status(200).json({
      user: newUser,
      message: "Evento adicionado aos favoritos com sucesso!",
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "Erro ao realizar a inscrição no evento",
    });
  }
});

export const unsubscribeEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const { _id } = req.user;
  try {
    const user = await User.findById(_id);
    const event = await Event.findById(eventId);
    if (!user) {
      return res.status(404).json("Usuário não encontrado");
    }
    if (!event) {
      return res.status(404).json("Evento não encontrado");
    }
    if (!user.signedEvents.includes(eventId)) {
      return res
        .status(400)
        .json("Usuário não se encontra inscrito neste evento");
    }
    const newUser = await User.findByIdAndUpdate(
      _id,
      { $pull: { signedEvents: eventId } },
      { new: true }
    );
    event.registrations.pull(_id);
    await event.save();
    res.status(200).json({
      user: newUser,
      message: "Participação cancelada com sucesso!",
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "Erro ao realizar o cancelamento da inscrição no evento",
    });
  }
});
