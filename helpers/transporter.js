const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport(
    {
        service : "gmail",
        auth : {
            user : "jamesfikrii@gmail.com",
            pass : "tnfiivhehgbwodsu"
        },
        tls : {
            rejectUnauthorized : false
        }
    }
)

module.exports = transporter