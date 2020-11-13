const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

let mailConfig;
if (process.env.NODE_ENV === 'PROD') {
    const options = {
        auth: {
            api_key: process.env.SENDGRID_API_SECRET
        }
    }
    mailConfig = sgTransport(options);
} else {
    if (process.env.NODE_ENV === 'STG') { //Staging
        const options = {
            auth: {
                api_key: process.env.SENDGRID_API_SECRET
            }
        }
        mailConfig = sgTransport(options);
    } else {
        // Create a SMTP transporter object desarrollo
        mailConfig = {
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: process.env.ethereal_user,
                pass: process.env.ethereal_pwd
            }
        };
    }
}


module.exports = nodemailer.createTransport(mailConfig);