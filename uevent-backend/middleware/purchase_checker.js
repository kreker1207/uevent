const   EVENT_TABLE = 'event',
        USERS_TABLE = 'users',
        ORG_TABLE = 'organization',
        PURCHASE_TABLE = 'purchase',
        PRIVATE_KEY = 'sandbox_DFCMyxeDMiDFDNAKtmCipT91BlGd2NP1fZ3SDHLw',
        PUBLIC_KEY = 'sandbox_i64245894082',
        {secret_access, secret_refresh, secret_mails} = require('../config'),
        Event = require('../models/event'),
        Organization = require('../models/organization'),
        User = require('../models/user'),
        Purchase = require('../models/purchase'),
        Mailer = require('../middleware/mailer'),
        LiqPay = require('../middleware/liqpay'),
        {PDFDocument} = require('pdf-lib'),
        Fs = require('fs'),
        {CustomError, errorReplier} = require('../models/error');
//
const mailer = new Mailer();
const pdfBuffer = Fs.readFileSync('./middleware/UeventTicketTemplate.pdf')

const pdfFormFilling = async (organization, event, userLogin) => {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pdfForm = pdfDoc.getForm();
    pdfForm.getTextField('OrgTitle').setText(organization.title)
    pdfForm.getTextField('OrgEmail').setText(organization.email)
    pdfForm.getTextField('OrgPhone').setText(organization.phone_number)
    pdfForm.getTextField('OrgLocation').setText(organization.location)

    pdfForm.getTextField('EveTitle').setText(event.title)
    pdfForm.getTextField('EveLocation').setText(event.location)
    pdfForm.getTextField('EveDateTime').setText(event.event_datetime)
    pdfForm.getTextField('Owner').setText(userLogin)
    pdfForm.flatten();
    return await pdfDoc.save();
}

module.exports = async function purCheker(){
    try {
        console.log('purchase checker started');
        const liqpay = new LiqPay(PUBLIC_KEY, PRIVATE_KEY);
        const purTable = new Purchase(PURCHASE_TABLE);
        const orgTable = new Organization(ORG_TABLE);
        const eveTable = new Event(EVENT_TABLE);
        const userTable = new User(USERS_TABLE);
        setInterval(async ()=> {
            console.log('restarting check');
            const orders = await purTable.get({status: false}, true);
            orders.forEach(order => {
                if(order.status) return;

                liqpay.api("request", {
                    "action"   : "status",
                    "version"  : "3",
                    "order_id" : order.id,
                    "language": "uk",
                }, async (reply_json)=> {
                    if(reply_json.result != 'ok') return;
                    //
                    console.log(order);
                    const buyer = await userTable.getById(order.user_id);
                    const event = await eveTable.getById(order.event_id);
                    //
                    const seatsRemaining = await purTable.getRemaining(event.id, event.seat);
                    if (seatsRemaining <= 0) {
                        mailer.sendRefund(buyer.email, order.id);
                        liqpay.api("request", {
                            "action"   : "refund",
                            "version"  : "3",
                            "order_id" : order.id
                        }, ( json ) => {
                            if(json.status !== 'error') return
                            mailer.sendRefundError(buyer.email, order.id);
                            //
                        });
                        purTable.del({id: order.id});
                        return;
                    };
                    //
                    const organization = await orgTable.getById(event.organizer_id);
                    const organization_admin = await userTable.getById(organization.admin_id);

                    if (!organization.phone_number) organization.phone_number = 'not specified!'
                    organization.email = organization_admin.email;
                    const pdfResBuffer = await pdfFormFilling(organization, event, buyer.login)
                    mailer.sendTicket(buyer.email, {location: event.location, buyer: buyer.login,
                    date_time: event.date_time, buffer: pdfResBuffer});
                    purTable.set({id: order.id, status: true}, true);
                });
                return;
            });
        //}, 10000)
        }, 300000)
    } catch (error) {
        e.addMessage = 'purchase checker';
        errorReplier(e, res);
        purCheker();
    }
};
