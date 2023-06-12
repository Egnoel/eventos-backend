import express from 'express';
import bodyParser from 'body-parser';
import connectDB from './config/db.js';
import { config } from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import inscriptionRoutes from './routes/inscriptionRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import path from 'path';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import uploadImage from './config/uploadImage.js';

config();
connectDB();
const app = express();
const PORT = process.env.PORT || 8000;
app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // update to match the domain you will make the request from
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  next();
});
app.use(express.json({ limit: '30mb', extended: true }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use('/api/user', userRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/subscribe', inscriptionRoutes);
app.post('/api/uploadImage', (req, res) => {
  uploadImage(req.body.image)
    .then((url) => res.send(url))
    .catch((err) => res.status(500).send(err));
});

app.use(notFound);
app.use(errorHandler);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:3000' },
});

io.on('connection', (socket) => {
  console.log('Connected to socket.io' + socket.id);
});

httpServer.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
