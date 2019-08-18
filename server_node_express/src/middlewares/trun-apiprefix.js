/**
 * 替换 api 请求前缀
 * 
 * 通常 api 如下，请求前缀 /api/v2 代表 api 的版本，一段时间会更改一次，写死肯定不好。 
 *      app.get('/api/v1/rbac/user', function () {}),
 *      app.get('/api/v1/rbac/org', function () {}),
 * 所有接口都有相同的请求前缀，在代码里书写时通常将前缀定义成一个变量 
 *      const apiPrefix = '/api/v1'
 * 书写变成了，虽然将前缀写成了变量，但每个路由都需要加这个前缀很麻烦，提供中间件消除这种麻烦。
 *      app.get(`${apiPrefix}/rbac/user`, function () {}),
 *      app.get(`${apiPrefix}/rbac/org`, function () {}),
 * 这么写仍然破坏了代码的美感，本中间件就是在所有路由之前消除前缀，写法变成了。
 *      app.get('/rbac/user', function () {}),
 *      app.get('/rbac/org', function () {}),
 * 前缀如果有变化，只需修改调用中间件那一个地方即可。
 * 清爽~
 */

module.exports = function (apiPrefix) {
    return function (req, res, next) {
        req.url = req._parsedUrl.pathname.replace(apiPrefix, '')
        next()
    }
}