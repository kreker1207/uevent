const Entity = require('./entity');

module.exports = class Comment extends Entity {
    constructor(tableName) {
        super(tableName);
    }

    async getComments(eventId) {
        if (eventId) {
            return await super.table().select('id', 'content', 'author_id', 'author_organization_id')
                .where({ event_id: eventId });
        } else {
            return [];
        }
    }

    /*async getEventId(commentId){
        // not used at all (maybe used for create comments)
        if(commentId) {
            return await super.table().select('event.id as event_id').from('comment')
            .join('event', 'comment.event_id', '=', 'event.id')
            .where({ id: commentId });
        }
        else return result[0];
    }*/

    async getAllCommentsForEvent(eventId) {
        const comments = await super.table()
          .where({event_id: eventId})
          .orderBy('id', 'asc')
          .select('*');
        for (const comment of comments) {

            const replies = await super.table()
            .where({comment_id: comment.id })
            .orderBy('id', 'asc')
            .select('*');
            comment.replies = replies;

            const createdAt = new Date(comment.created_at);

            const year = createdAt.getFullYear()
            const month = (createdAt.getMonth()+1).toString().padStart(2, '0')
            const day = createdAt.getDate().toString().padStart(2, '0')
            const hours = createdAt.getHours().toString().padStart(2, '0')
            const minutes = createdAt.getMinutes().toString().padStart(2, '0')

            const createdAtFormatted = `${year}-${month}-${day} ${hours}:${minutes}`;

            for(const reply of comment.replies) {
                const createdAt = new Date(reply.created_at);
                const year = createdAt.getFullYear()
                const month = (createdAt.getMonth()+1).toString().padStart(2, '0')
                const day = createdAt.getDate().toString().padStart(2, '0')
                const hours = createdAt.getHours().toString().padStart(2, '0')
                const minutes = createdAt.getMinutes().toString().padStart(2, '0')
                const createdAtFormattedReplies = `${year}-${month}-${day} ${hours}:${minutes}`;

                reply.created_at = createdAtFormattedReplies
            }

            comment.created_at = createdAtFormatted;
        }
        return comments;
    }
}
        
          

    