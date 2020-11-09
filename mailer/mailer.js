const nodemailer = require('nodemailer');


// Create a SMTP transporter object
let mailConfig = {
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
        user: 'estevan.hayes@ethereal.email',
        pass: 'pC3CqD3Cfa1bjrUTSb'
    }
};


module.exports = nodemailer.createTransport(mailConfig);