const redis = require('redis');
const { promisifyAll } = require('bluebird');

promisifyAll(redis);

const client = redis.createClient();

client.on('error', function (error) {
  console.error('redis error', error);
});

exports.cacheByUrl = (duration) => {
  return async (req, res, next) => {
    let key = '__express__' + req.originalUrl || req.url;

    try {
      const redisResult = await client.getAsync(key);
      if (redisResult) {
        res.send(JSON.parse(redisResult));
        console.log('cached response', key);
        return;
      } else {
        const original_write = res.write,
          original_end = res.end,
          chunks = [];
        res.write = function (chunk) {
          chunks.push(chunk);
          original_write.apply(res, arguments);
        };
        res.end = function (chunk) {
          if (chunk) chunks.push(chunk);
          res.body = Buffer.concat(chunks).toString('utf8');
          console.log('cached after response', key);
          client.setexAsync(key, duration, res.body);
          original_end.apply(res, arguments);
        };
      }

      next();
    } catch (error) {
      console.error('redis error', error);
      next();
    }
  };
};
