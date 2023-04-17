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

    async createComment(req, res) {
        try{
            // front sends both event id and main comment id (when commenting a comment)
            console.log(req.params)
            console.log(req.body)
            const errors = validationResult(req)
            if(! errors.isEmpty()) throw new CustomError(10);
            if(!req.params.eventId && !req.body.comment_id) throw new CustomError(10);
            if (!req.user) throw new CustomError(1011);
            const {content, receiver_name} = req.body;
            const commentTable = new Comment(COMMENT_TABLE);
            const eventTable = new Event(EVENT_TABLE);
            const event = await eventTable.getById(req.params.eventId);
            if(!event) throw new CustomError(1009);

            const commentData= {
                content: content,
            }
            const {admin_id} = await eventTable.getAdminId(req.params.eventId);
            if (req.user.id === admin_id) 
                commentData.author_organization_id = event.organizer_id;
            else
                commentData.author_id = req.user.id

            if(req.body.comment_id) {
                const commentTable = new Comment(COMMENT_TABLE);
                const mainComment = await commentTable.getById(req.body.comment_id);
                if(!mainComment) throw new CustomError(1010);

                commentData.comment_id = req.body.comment_id;
                commentData.receiver_name = receiver_name;
            } else {
                commentData.event_id = req.params.eventId
            }

            console.log(commentData)
            const [comment] = await commentTable.set(commentData);
            console.log(comment);
            return res.json({commentData});
        } catch(e) {
            e.addMessage = 'Create comment';
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