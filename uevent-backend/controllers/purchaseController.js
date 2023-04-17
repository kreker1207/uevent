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
            //console.log('EVENT to be bought:')
            const eventTable = new Event(EVENT_TABLE);
            const event = await eventTable.getById(req.body.event_id);
            if (!event) throw new CustomError(1009);

            const purchaseTable = new Purchase(PURCHSE_TABLE);
            //const seatsRemaining = await purchaseTable.getRemaining(event.id, event.seat);
            //if (seatsRemaining <= 0) throw new CustomError(1015);

            const promoTable = new Promo(PROMO_TABLE);
            let  promo = null;
            if (req.body.promo){
                promo = await promoTable.get({name: req.body.promo});
                if (!promo) throw new CustomError(1013);
            }
            
            //console.log(event);
            const price = promo ? discountMyPrice(event.price, promo.discount) : event.price
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

            await purchaseTable.set({id: order_id, event_id: event.id,
            user_id: req.user.id, status: false});
            
            return res.json({data, signature})
        }catch(e){
            e.addMessage = 'test buy';
            errorReplier(e, res);
        }
    }
}
module.exports = new purchaseController()