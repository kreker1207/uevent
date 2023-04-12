const { errorReplier, CustomError } = require('../models/error');

const   EVENT_TABLE = 'event',
        ORGANIZATION_TABLE = 'organization',
        jwt = require('jsonwebtoken'),
        {secret_refresh} = require('../config'),
        {validationResult} = require('express-validator'),
        Organization = require('../models/organization'),
        Event = require('../models/event');

class EventController{
    async getEvents(req,res){
        try{
            const event = new Event(EVENT_TABLE);
            const pawns = await event.getAll(req.params.page,9);
            res.json(pawns)
        } catch(e){
            e.addMessage = 'Get events';
            errorReplier(e, res);
            }
    }
    async getEventById(req,res){
        try{
            const event = new Event(EVENT_TABLE);
            const result = await event.getById(req.params.id);
            res.json(result);

        } catch(e){
            e.addMessage= 'Get event by id';
            errorReplier(e,res);
        }
    }

    async getEventByUserId(req,res){
        try{
            const event = new Event(EVENT_TABLE);
            const result = await event.getEventByUserId(req.params.userId,req.params.page,4);
            res.json(result);
        } catch(e){
            e.addMessage= 'Get events by user id';
            errorReplier(e,res);
        }
    }   
    async getEventByOrgId(req,res){
        try{
            const event = new Event(EVENT_TABLE);
            const result = await event.getEventByOrgId(req.params.orgId,req.params.page,4);
            res.json(result);
        } catch(e){
            e.addMessage= 'Get events by user id';
            errorReplier(e,res);
        }
    }   
   
    async createEvent(req,res){
        try{
            const errors = validationResult(req)
            if(! errors.isEmpty()){
                throw new CustomError(10);
            }
            const {title, description, event_datetime, location,seat,price,tags} = req.body;
            const event = new Event(EVENT_TABLE);
            const organization = new Organization(ORGANIZATION_TABLE);
            const candidate = await organization.getById(req.params.orgId);
            const {refreshToken} = req.cookies;
            checkEventAndRelation(candidate,refreshToken);
            const eventData= {
                organizer_id: req.params.orgId,
                title,
                description,
                event_datetime,
                location:location,
                seat:seat,
                price:price,
                tags:tags

            }
            const pawn = await event.setEvent(eventData);
            console.log(pawn)
            return res.json({eventData})

        }catch(e){
            e.addMessage = 'Create event';
            errorReplier(e,res);
        }
    }
    async deleteEvent(req,res){
        try{
            const event = new Event(EVENT_TABLE);
            const candidate = await event.getById(req.params.id)
            const {refreshToken} = req.cookies;
            checkEventAndRelation(candidate,refreshToken);
            const pawn = await event.del({id: req.params.id});
            
            res.json(pawn)
        } catch(e){
            e.addMessage = 'Delete event by id';
            errorReplier(e, res);
        }
    }
    
}
module.exports = new EventController()

function checkEventAndRelation(candidate,token) {
    const decodedToken = jwt.verify(token, secret_refresh, { ignoreExpiration: true });
    const userId = decodedToken.id;
    if (!candidate){
        throw new CustomError(1006);
    } else if(userId != candidate.admin_id) throw new CustomError(1007);
}
