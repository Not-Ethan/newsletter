const express = require('express');
const rd = require('redis');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const { RedisStore } = require('connect-redis');

const app = express();
const port = 3000;

// Redis clients for submitting and processing tasks
const redisSubmit = rd.createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
  },
});

const redisProcess = rd.createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
  },
});

const sessionClient = rd.createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
  },
});

const completedList = process.env.REDIS_COMPLETED_LIST || 'completed_tasks';

// Connect to Redis
redisSubmit.connect().catch(console.error);
redisProcess.connect().catch(console.error);
sessionClient.connect().catch(console.error);

// MongoDB connection
mongoose.connect(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`, {});
const Task = require('./models/Task');

app.use(session({
  store: new RedisStore({
    client: sessionClient,
    prefix: 'session:',
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 1000 }
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

const User = require('./models/user');
passport.deserializeUser(async (id, done) => {
  try {
    let user = User.findById(id);
    done(null, user);
  }
  catch (err) {
    done(err, null);
  }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Load routes
const transcriptionRoutes = require('./routes/transcription')(redisSubmit);
const authRoutes = require('./routes/auth')(sessionClient);

app.use('/api', transcriptionRoutes);
app.use('/api', authRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Redis event handlers for submitting tasks
redisSubmit.on('error', (err) => {
  console.error('Redis error:', err);
});

redisSubmit.on('connect', () => {
  console.log('Connected to Redis for submitting tasks');
});

// Redis event handlers for processing tasks
redisProcess.on('error', (err) => {
  console.error('Redis error:', err);
});

redisProcess.on('connect', () => {
  console.log('Connected to Redis for processing tasks');

  const processTasks = async () => {
    while (true) {
      try {
        const message = await redisProcess.blPop(completedList, 0);
        console.log('Received message:', message);

        if (message && message.element) {
          const task = JSON.parse(message.element);

          if (task.status === 'failed') {
            await Task.findOneAndDelete({ task_id: task.task_id });
            console.log('Task failed:', task.task_id);
          } else if (task.status === 'completed') {
            let taskResult = await redisProcess.get("task:" + task.task_id);
            await Task.findOneAndUpdate({ task_id: task.task_id }, { status: 'completed', content: taskResult });
          }
        } else {
          console.error('Received invalid message:', message);
        }
      } catch (err) {
        console.error('Redis error:', err);
      }
    }
  };

  processTasks();
});
