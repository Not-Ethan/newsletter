// strategies/magicLogin.js
const { Strategy } = require('passport-strategy');
const redis = require('redis');

const redisClient = redis.createClient({
    socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
    },
});

module.exports = new Strategy(async (req, done) => {
  const { token } = req.query;

  if (!token) {
    return done(null, false, { message: 'Token is required' });
  }

  const id = await redisClient.get(`login:${token}`);

  if (!id) {
    return done(null, false, { message: 'Invalid or expired token' });
  }

  await redisClient.del(`magiclink:${token}`);
  return done(null, { id });
});
