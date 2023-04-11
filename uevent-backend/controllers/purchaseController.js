const   EVENT_TABLE = 'event',
        PURCHSE_TABLE = 'purchase',
        PRIVATE_KEY = 'sandbox_DFCMyxeDMiDFDNAKtmCipT91BlGd2NP1fZ3SDHLw',
        PUBLIC_KEY = 'sandbox_i64245894082',
        { v4: uuidv4 } = require('uuid'),
        {secret_access, secret_refresh, secret_mails} = require('../config'),
        Event = require('../models/event'),
        Purchase = require('../models/purchase')
        LiqPay = require('../middleware/liqpay'),
        {CustomError, errorReplier} = require('../models/error');
//

class purchaseController{
    async testBuy1(req, res){
        try{
            if (!req.user || req.user.id <= 0)
                throw new CustomError(1011);
            console.log('\nTest Buy: Forming purchase data:')
            console.log(req.body);
            

            const event = new Event(EVENT_TABLE);
            console.log('EVENT to be bought:')
            const pevent = await event.getById(req.body.event_id);
            console.log(pevent)

            if (!pevent)
                throw new CustomError(1009);
            const liqpay = new LiqPay(PUBLIC_KEY, PRIVATE_KEY);
            const order_id = uuidv4()
            const {data, signature} = liqpay.cnb_object({
                'action'         : 'pay',
                'amount'         : pevent.price,
                'currency'       : 'UAH',
                'description'    : 'description text',
                'order_id'       : order_id,
                'version'        : '3'
            });

            const purchase = new Purchase(PURCHSE_TABLE);
            await purchase.set({id: order_id, event_id: pevent.id,
            user_id: req.user.id, status: false});
            
            return res.json({data, signature})
        }catch(e){
            e.addMessage = 'test buy';
            errorReplier(e, res);
        }
    }
}
module.exports = new purchaseController()