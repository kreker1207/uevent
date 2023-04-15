const   EVENT_TABLE = 'event',
        ORGANIZATION_TABLE = 'organization',
        Event = require('../models/event'),
        Organization = require('../models/organization'),
        {CustomError, errorReplier} = require('../models/error');

class SearchController{
  async getEvents(req, res) {
    try {
      const event = new Event(EVENT_TABLE);
      const { query } = req.body || '';
      const events = await event.getSearchAll(req.params.page, 9, {
        filter: query.toLowerCase()
      });
      res.json(events);
    } catch (e) {
      e.addMessage = 'Search events';
      errorReplier(e, res);
    }
  }
  async getEventsAndOrgs(req, res) {
    try {
      const event = new Event(EVENT_TABLE);
      const org = new Organization(ORGANIZATION_TABLE);
      const { query } = req.body || ''; 
      const [events, organizations] = await Promise.all([
        event.getSearchAll(req.params.page, 20, {
          filter: query.toLowerCase()
        }),
        org.getSearchAll(req.params.page, 20, {
          filter: query.toLowerCase()
        })
      ]);
  
      res.json({ events, organizations });
    } catch (e) {
      e.addMessage = 'Search events and orgs';
      errorReplier(e, res);
    }
  }
      async getEventsFilter(req,res){
        try{
            const event = new Event(EVENT_TABLE);
            const result = await event.getEventWithFilter(req.body, req.params.page, 9);
            res.json(result);
        } catch(e){
            e.addMessage= 'Get events by filters';
            errorReplier(e,res);
        }
    }
}
module.exports = new SearchController()