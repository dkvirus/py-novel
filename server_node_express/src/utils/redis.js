const redis = require('redis')
const bluebird = require('bluebird')

// 将 redis 方法变成 Promise 方法
bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

const client = redis.createClient()

client.on('connect', function () {
  console.log('redis connected....')
})

global.redis = client