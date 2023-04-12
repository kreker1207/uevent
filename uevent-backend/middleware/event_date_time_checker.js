const   EVENT_TABLE = 'event',
        Event = require('../models/event'),
        {CustomError, errorReplier} = require('../models/error');
//

module.exports = async function eveChecker(){
    try {
        console.log('event datetime checker started');
        const event = new Event(EVENT_TABLE);
        const current = new Date();
        setInterval(async ()=> {
            console.log('event datetime check: ' + current);
            const alleves = await event.getAll(0, null)

            alleves.data.forEach(eve => {
                const eve_datetime = new Date(eve.event_datetime)
                /*console.log('\n' +'current ' + current + ' < ' + eve_datetime + 'eve.event_datetime????')
                console.log(eve_datetime < current)*/
                if (eve_datetime < current) {
                    event.del({id: eve.id});
                }
            });
        }, 86400000)
    } catch (error) {
        e.addMessage = 'event datetime checker';
        errorReplier(e, res);
        eveChecker();
    }
};