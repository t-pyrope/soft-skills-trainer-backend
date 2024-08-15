const juice = require('juice');
const path = require('path');
const pug = require('pug');
const nodemailer = require('nodemailer');
const htmlToText = require('nodemailer-html-to-text').htmlToText;
const SMTPTransport = require('nodemailer-smtp-transport');

const config = require('../config');

const transportEngine = new SMTPTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: config.mailer.user,
        pass: config.mailer.password,
    }
})

const transport = nodemailer.createTransport(transportEngine);

transport.use('compile', htmlToText());

module.exports = async function sendMail(options) {
    const html = pug.renderFile(
        path.join(__dirname, '../templates', options.template) + '.pug',
        options.locals || {}
    );

    const message = {
        html: juice(html),
        to: {
            address: options.to,
        },
        subject: options.subject,
    }

    return await transport.sendMail(message);
}

module.exports.transportEngine = transportEngine;
