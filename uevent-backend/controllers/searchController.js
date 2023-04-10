const   EVENT_TABLE = 'event',
        ORGANIZATION_TABLE = 'organization',
        Event = require('../models/event'),
        Organization = require('../models/organization'),
        {CustomError, errorReplier} = require('../models/error');

class SearchController{
    async getEvents(req, res) {
        try {
          const event = new Event(EVENT_TABLE);
          const query = req.body.searchQuery || '';
          const regex = new RegExp(query, 'i'); 
          const events = await event.getAll({ 
            filter: (event) => {
              return regex.test(event.title) || regex.test(event.description);
            }
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
          const query = req.body.searchQuery || '';
          const regex = new RegExp(query, 'i');
      
          const [events, organizations] = await Promise.all([ 
            event.getAll({ 
              filter: (event) => {
                return regex.test(event.title) || regex.test(event.description);
              }
            }),
            org.getAll({ 
              filter: (org) => {
                return regex.test(org.title) || regex.test(org.description);
              }
            })
          ]);
      
          res.json({ events, organizations });
        } catch (e) {
          e.addMessage = 'Search events and orgs';
          errorReplier(e, res);
        }
      }
}
module.exports = new SearchController()