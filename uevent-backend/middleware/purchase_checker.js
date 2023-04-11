const   EVENT_TABLE = 'event',
        USERS_TABLE = 'users',
        PURCHASE_TABLE = 'purchase',
        PRIVATE_KEY = 'sandbox_DFCMyxeDMiDFDNAKtmCipT91BlGd2NP1fZ3SDHLw',
        PUBLIC_KEY = 'sandbox_i64245894082',
        {secret_access, secret_refresh, secret_mails} = require('../config'),
        Event = require('../models/event'),
        User = require('../models/user'),
        Purchase = require('../models/purchase'),
        Mailer = require('../middleware/mailer'),
        LiqPay = require('../middleware/liqpay'),
        {CustomError, errorReplier} = require('../models/error');
//
const mailer = new Mailer();


module.exports = async function purCheker(){
    try {
        console.log('purchase checker started');
        const liqpay = new LiqPay(PUBLIC_KEY, PRIVATE_KEY);
        const purchase = await new Purchase(PURCHASE_TABLE);
        setInterval(async ()=> {
            console.log('restarting check');
            const orders = await purchase.get({status: false});
            orders.forEach(order => {
                if(!order.status) {
                    liqpay.api("request", {
                        "action"   : "status",
                        "version"  : "3",
                        "order_id" : order.id,
                        "language": "uk",
                    }, (reply_json)=> {
                        if(reply_json.result != 'ok') return;
                        //
                        purchase.set({id: order.id, status: true}, true)
                        mailer.sendTicket(order.email, 
                        {location: order.location, date_time: order.date_time});
                    });
                }
            });
        }, 60000)
    } catch (error) {
        e.addMessage = 'purchase checker';
        errorReplier(e, res);
        purCheker();
    }
};
