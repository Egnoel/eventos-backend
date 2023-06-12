import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  const decoded = jwt.decode(token);

  if (decoded.exp < Date.now() / 1000) {
    throw new Error('Token has expired');
  }

  return token;
};

export default generateToken;
