const   EVENT_TABLE = 'event',
        PURCHSE_TABLE = 'purchase',
        PROMO_TABLE = 'promo',
        PRIVATE_KEY = 'sandbox_DFCMyxeDMiDFDNAKtmCipT91BlGd2NP1fZ3SDHLw',
        PUBLIC_KEY = 'sandbox_i64245894082',
        { v4: uuidv4 } = require('uuid'),
        {secret_access, secret_refresh, secret_mails} = require('../config'),
        Event = require('../models/event'),
        Promo = require('../models/promo'),
        Purchase = require('../models/purchase'),
        LiqPay = require('../middleware/liqpay'),
        {CustomError, errorReplier} = require('../models/error');
//

const discountMyPrice = (price, discount) => {
    // discount in format (from 1 to 100)
    return price * (1 - (discount / 100)); 
}

class purchaseController{
    async Buy(req, res){
        try{
            if (!req.user || req.user.id <= 0)
                throw new CustomError(1011);
            console.log('\nTest Buy: Forming purchase data:')
            console.log(req.body);
            const promo = new Promo(PROMO_TABLE);
            let  ppromo = null;
            if (req.body.promo){
                ppromo = await promo.get({name: req.body.promo});
                if (!ppromo) throw new CustomError(1013);
            }
                
            const event = new Event(EVENT_TABLE);
            //console.log('EVENT to be bought:')
            const pevent = await event.getById(req.body.event_id);
            if (!pevent)
                throw new CustomError(1009);
            //console.log(pevent);
            const price = ppromo ? discountMyPrice(pevent.price, ppromo.discount) : pevent.price
            const order_id = uuidv4();
            const liqpay = new LiqPay(PUBLIC_KEY, PRIVATE_KEY);
            const {data, signature} = liqpay.cnb_object({
                'action'         : 'pay',
                'amount'         : price,
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