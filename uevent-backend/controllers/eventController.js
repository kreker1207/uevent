const { errorReplier, CustomError } = require('../models/error');

const   EVENT_TABLE = 'event',
        ORGANIZATION_TABLE = 'organization',
        THEME_TABLE = 'theme',
        PURCHASE_TABLE = 'purchase',
        jwt = require('jsonwebtoken'),
        {secret_refresh} = require('../config'),
        {validationResult} = require('express-validator'),
        Organization = require('../models/organization'),
        { v4: uuidv4 } = require('uuid'),
        Fs = require('fs'),
        Tag = require('../models/tag'),
        Sub = require('../models/sub'),
        Purchase = require('../models/purchase'),
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
            if(req.user) {
                const subTable = new Sub('sub');
                const sub = await subTable.get({user_id: req.user.id, event_id: req.params.id});
                if (sub) result.isSub = true
                else result.isSub = false
            }
            res.json(result);

            if(req.user) {
                const subTable = new Sub('sub');
                const sub = await subTable.get({user_id: req.user.id, event_id: req.params.id});
                if (sub) result.isSub = true
                else result.isSub = false
            }

            res.json(result);
        } catch(e){
            e.addMessage= 'Get event by id';
            errorReplier(e,res);
        }
    }
    async getTags(req,res){
        try{
            const tags = new Tag(THEME_TABLE);
            const result = await tags.getAllSorted();
            res.json(result);

        }
        catch(e){
            e.addMessage= 'Get sorted tags';
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
            const result = await event.getEventByOrgId(req.params.orgId,req.params.page, 9);
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
            const {title, description, event_datetime, location, seat, price, tags, format, publish_date } = req.body;
            const event = new Event(EVENT_TABLE);
            const organization = new Organization(ORGANIZATION_TABLE);
            const candidate = await organization.getById(req.params.orgId);
            const {refreshToken} = req.cookies;
            checkEventAndRelation(candidate,refreshToken);
            const date = new Date(publish_date)
            date.setDate(date.getDate()) 
            const eventData= {
                organizer_id: req.params.orgId,
                title,
                description,
                event_datetime,
                location:location,
                seat,
                price:price,
                tags:tags,
                format,
                publish_date: date
            }
            console.log(eventData)
            const pawn = await event.setEvent(eventData);
            return res.json(pawn)

        }catch(e){
            e.addMessage = 'Create event';
            errorReplier(e,res);
        }
    }
    async editEvent(req,res){
            try{
                if (!req.user) {
                    return res.status(401).json({message: `User needs to login first`})
                }
                const {title, description, seat, price, event_datetime, format, location, publish_date} = req.body;
    
                const event = new Event(EVENT_TABLE);
                const organization = new Organization(ORGANIZATION_TABLE);
                const oldEvent = await event.getById(req.params.id);
                const org = await organization.getById(oldEvent.organizer_id);
                if (!oldEvent) return res.status(401).json({message: `User does not exists`})
                else if (org.admin_id !== req.user.id) return res.status(400).json({message: `You can not edit this event`})
                const new_pawn = await event.set({
                    id: req.params.id, 
                    title, 
                    description, 
                    seat,
                    price,
                    event_datetime,
                    format,
                    location,
                    publish_date
                })
               return res.json(new_pawn[0]);
            }catch(e){
            e.addMessage = 'Edit event';
            errorReplier(e,res);
        }
    }

    async editAvatar(req, res) {
        try {
            if (!req.user){
                throw new CustomError(1011);
            }
            if (!req.files || Object.keys(req.files).length === 0) {
                throw new CustomError(1012);
            }

            const event = new Event(EVENT_TABLE);
            const eve = await event.table().select('*').where({id: req.params.id}).first();
            
            const avatar_name = eve.title + '_' + uuidv4() + '.png';
            const avatar_path = './public/event_pics/';
            
            // input name on front should be like this VVV (avatar)
            const avatar = req.files.avatar;
            avatar.mv(avatar_path + avatar_name, function(err) {
                if (err) return res.status(500).send(err);
            });
            await event.set({id: eve.id, eve_pic: avatar_name});

            if(eve.eve_pic !== 'none.png') {
                Fs.unlinkSync(avatar_path + eve.eve_pic)
            }
            
            res.send('Success File uploaded!');
        } catch (e) {
            e.addMessage = 'edit eve avatar';
            errorReplier(e, res);
        }
    }

    async setSub(req, res) {
        try {
            if (!req.user) throw new CustomError(1011);
            if (!req.params.id) throw new CustomError(10);

            const subTable = new Sub('sub');
            const subObj = {event_id: req.params.id, user_id: req.user.id};
            const sub = await subTable.get(subObj);
            if (sub) {
                subTable.del(subObj)
                res.json({isSub: false})
            }
            else {
                subTable.set(subObj)
                res.json({isSub: true})
            }
        } catch (e) {
            e.addMessage = 'set Subscription';
            errorReplier(e, res);
        }
    }

    async getBuyers(req, res) {
        try {
            if (!req.params.id) throw new CustomError(10);
            const eveTable = new Event(EVENT_TABLE);
            const event = await eveTable.getById(req.params.id);
            if (!event) throw new CustomError(1009);

            const purTable = new Purchase(PURCHASE_TABLE);
            const puchseUsers = await purTable.getUsers(event.id)
            res.json(puchseUsers);
        } catch (e) {
            e.addMessage = 'get Buyers';
            errorReplier(e, res);
        }
    }

    async deleteEvent(req,res){
        try{
            const event = new Event(EVENT_TABLE);
            const organization = new Organization(ORGANIZATION_TABLE);
            const candidate = await event.getById(req.params.id);
            const org = await organization.getById(candidate.organizer_id);
            const {refreshToken} = req.cookies;
            checkEventAndRelation(org,refreshToken);
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
