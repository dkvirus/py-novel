const nodemailer = require('nodemailer');
const { email_account, email_pass } = require('../configs/config');

const transporter = nodemailer.createTransport({//邮件传输
        host: 'smtp.qq.com',                // qq smtp服务器地址
        secureConnection: false,            // 是否使用安全连接，对https协议的
        port: 465,                          // qq邮件服务所占用的端口
        auth: {
            user: email_account,            // 开启SMTP的邮箱，有用发送邮件
            pass: email_pass,               // 授权码 
        },
});

global.transporter = transporter;