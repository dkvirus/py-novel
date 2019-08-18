const nodemailer = require('nodemailer')
const { emailAccount, emailPass } = require('../../config')

const transporter = nodemailer.createTransport({//邮件传输
    host: 'smtp.qq.com',                // qq smtp服务器地址
    secureConnection: false,            // 是否使用安全连接，对https协议的
    port: 465,                          // qq邮件服务所占用的端口
    auth: {
        user: emailAccount,            // 开启SMTP的邮箱，有用发送邮件
        pass: emailPass,               // 授权码 
    },
})

const sendEmail = function (mailOption) {
    return new Promise(function (resolve, reject) {
        transporter.sendMail(mailOption, async function (err) {
            if (err) {
                console.log('[-] utils > email > sendEmail()', err.message)
                reject({ code: '9999', message: '发送邮件失败', data: {} })
            }

            resolve({ code: '0000', message: '已发送邮件', data: {} })
        })
    })
}

global.sendEmail = sendEmail
