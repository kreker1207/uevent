const { stringify } = require('uuid');

const   USERS_TABLE = 'users',
        PRIVATE_KEY = 'sandbox_DFCMyxeDMiDFDNAKtmCipT91BlGd2NP1fZ3SDHLw',
        PUBLIC_KEY = 'sandbox_i64245894082',
        bcrypt = require('bcryptjs'),
        sha1 = require('js-sha1'),
        jwt = require('jsonwebtoken'),
        {secret_access, secret_refresh, secret_mails} = require('../config'),
        User = require('../models/user'),
        Mailer = require('../middleware/mailer'),
        crypto = require('crypto'),
        {CustomError, errorReplier} = require('../models/error');
//
const mailer = new Mailer();

class purchaseController{
    async testBuy1(req, res){
        try{
            if (!req.user || req.user.id <= 0)
                throw new CustomError(1011);
            console.log('\nTest Buy: Forming purchase data:')
            console.log(req.body);

            const json_string = JSON.stringify({
                public_key: PUBLIC_KEY,
                version:"3",
                action:"pay",
                amount:"1",
                currency:"UAH",
                description:"testBuy",
                order_id:"000001"
            });
            console.log (json_string)

            const data = Buffer.from(json_string).toString('base64');
            console.log('data:')
            console.log (data)
            const sign_string = PRIVATE_KEY + data + PRIVATE_KEY;
            console.log('sign_string:')
            console.log (sign_string)
            const hash = crypto.createHash('sha1').update(sign_string).digest();
            console.log('hash: ' + hash);
            const signature = Buffer.from(hash).toString('base64');
            console.log('signature:')
            console.log(signature)
            return res.json({data: data, signature: signature})
        }catch(e){
            e.addMessage = 'test buy';
            errorReplier(e, res);
        }
    }
}
module.exports = new purchaseController()