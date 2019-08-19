const userDao = require('../daos/user')

module.exports = {

    updateUser: async function (req, res) {
        const { userId, nickname, avatarUrl, address, gender } = req.body
        
        if (!userId) {
            return res.json({ code: '9999', message: '用户ID(userId)不能为空', data: {} })
        }

        try {
            const result = await userDao.updateUser({ nickname, avatarUrl, userId, address, gender })
            res.json(result)
        } catch (e) {
            console.log('[-] routes > user > updateUser()', e.message)
            res.json({ code: '9999', message: '修改用户信息失败', data: {} })
        }
    },

}