import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../config/generateToken.js';
import Event from '../models/eventModel.js';

//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
export const allUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.send(users);
});

//@description     Register new user
//@route           POST /api/user/
//@access          Public
export const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, pic } = req.body;

  if (!firstName || !lastName || !email || !password) {
    res.status(400);
    throw new Error('Please Enter all the Feilds');
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    pic,
    favorites: [],
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
      },
      token,
    });
  } else {
    res.status(400);
    throw new Error('User not found');
  }
});

//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id);
    res.status(200).json({
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        pic: user.pic,
        favorites: user.favorites,
      },
      token,
    });
  } else {
    res.status(401);
    throw new Error('Invalid Email or Password');
  }
});

export const addFavoriteEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const { _id } = req.user;

  // Verificar se o evento já está nos favoritos do usuário
  const user = await User.findById(_id);
  if (user.favorites.includes(eventId)) {
    return res.status(400).json('Evento já está nos favoritos do usuário');
  }

  try {
    // Verificar se o evento existe
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json('Evento não encontrado');
    }

    // Adicionar o evento aos favoritos do usuário
    user.favorites.push(eventId);
    const newUser = await user.save();
    res
      .status(200)
      .json({
        data: newUser,
        message: 'Evento adicionado aos favoritos com sucesso!',
      });
  } catch (error) {
    res.status(400).json('Erro ao adicionar evento aos favoritos');
  }
});

export const removeFavoriteEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const user = req.user;

  user.favoriteEvents = user.favoriteEvents.filter(
    (event) => event.toString() !== eventId
  );
  const newUser = await user.save();

  res
    .status(200)
    .json({
      data: newUser,
      message: 'Evento removido dos favoritos com sucesso!',
    });
});
