const { errorReplier, CustomError } = require('../models/error');

const   COMMENT_TABLE = 'comment',
        EVENT_TABLE = 'event',
        jwt = require('jsonwebtoken'),
        {secret_refresh} = require('../config'),
        {validationResult} = require('express-validator'),
        Event = require('../models/event'),
        Comment = require('../models/comment');

class CommentController{
    async getComments(req,res){
        try{
            const comment = new Comment(COMMENT_TABLE);
            const pawns = await comment.getAll();
            res.json(pawns)
        } catch(e){
            e.addMessage = 'Get comments';
            errorReplier(e, res);
            }
    }
    async getCommentById(req,res){
        try{
            const comment = new Comment(COMMENT_TABLE);
            const pawns = await comment.getById(req.params.id);
            res.json(pawns)
        } catch(e){
            e.addMessage = 'Get comment by id';
            errorReplier(e, res);
            }
    }
    async getCommentsByEventId(req,res){
        try{
            const comment = new Comment(COMMENT_TABLE);
            const result = await comment.getAllCommentsForEvent(req.params.eventId)
            res.json(result);

        } catch(e){
            e.addMessage= 'Get comments by event id';
            errorReplier(e,res);
        }
    }
    async createEventComment(req,res){
        try{
            const errors = validationResult(req)
            if(! errors.isEmpty()){
                throw new CustomError(10);
            }
            const { content} = req.body;
            const comment = new Comment(COMMENT_TABLE);
            const eventTable = new Event(EVENT_TABLE);
            const event = await eventTable.getById(req.params.eventId);
            const {refreshToken} = req.cookies;
            const userId = getJwtUserId(refreshToken);
            const adminId = await eventTable.getAdminId(req.params.eventId);
            if(!event) throw new CustomError(1009);
            if(userId === adminId){
                const commenttData= {
                    author_id: userId,
                    content: content,
                    author_organization_id:event.organizer_id,
                    event_id: req.params.eventId
                }
                const [pawn] = await comment.set(commenttData);
                console.log(pawn)
                return res.json({commenttData})
            }
            else{
                const commentData= {
                    author_id: userId,
                    content: content,
                    event_id: req.params.eventId
                }
                const [pawn] = await comment.set(commentData);
                console.log(pawn)
                return res.json({commentData})
            }
            

        }catch(e){
            e.addMessage = 'Create comments';
            errorReplier(e,res);
        }
    }
    async createReplyComment(req,res){
        try{
            const errors = validationResult(req)
            if(! errors.isEmpty()){
                throw new CustomError(10);
            }
            const { content, comment_id, receiver_name } = req.body;
            if(!comment_id)throw new CustomError(1010);
            const comment = new Comment(COMMENT_TABLE);
            const eventTable = new Event(EVENT_TABLE);
            const event = await eventTable.getById(req.params.eventId);
            const {refreshToken} = req.cookies;
            const userId = getJwtUserId(refreshToken);
            const adminId = await eventTable.getAdminId(req.params.eventId);
            if(!event) throw new CustomError(1009);
            if(userId === adminId){
                const commenttData= {
                    content: content,
                    author_organization_id:event.organizer_id,
                    event_id: req.params.eventId,
                    comment_id: comment_id,
                    main_comment_id:req.params.mainComId,
                    receiver_name
                }
                const [pawn] = await comment.set(commenttData);
                console.log(pawn)
                return res.json({commenttData})
            }
            else{
                const commentData= {
                    author_id: userId,
                    content: content,
                    event_id: req.params.eventId,
                    comment_id: comment_id,
                    main_comment_id:req.params.mainComId,
                    receiver_name
                }
                const [pawn] = await comment.set(commentData);
                console.log(pawn)
                return res.json({commentData})
            }
            

        }catch(e){
            e.addMessage = 'Create comments';
            errorReplier(e,res);
        }
    }
}
module.exports = new CommentController()
function getJwtUserId(token){
    const decodedToken = jwt.verify(token, secret_refresh, { ignoreExpiration: true });
    console.log(decodedToken);
    return decodedToken.id;
}