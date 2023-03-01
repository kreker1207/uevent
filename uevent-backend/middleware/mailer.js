const config = require('./mailConfig.json');

module.exports = class Mailer {
    constructor(){
        this.transporter = require('nodemailer').createTransport(config.transport);
    };

    // VVV For front VVV
    //FrontAddress = 'http://localhost:3000';
    // VVV For postman VVV
    FrontAddress = 'http://localhost:3000';

    sendConfirmEmail (email, token) {
        this.transporter.sendMail({
            from: config.from,
            to: email,
            subject: 'Uevent Email confirmation',
            html: `You can confirm your email by this URL: \
            <a href="${this.FrontAddress}/confirmEmail/${token}">\
            Confirm Email!</a>`,
        }, (error, info) => {
            if (error) {
                console.log(error);
                return error;
            }
        });
    };
}