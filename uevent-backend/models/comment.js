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

    async getAllCommentsForEvent(eventId, parentId = null) {
        const comments = await super.table()
          .where({ event_id: eventId || null, comment_id: parentId || null })
          .orderBy('id', 'asc')
          .select('*');
        for (const comment of comments) {
            const replies = await super.table()
            .where({ main_comment_id: comment.id })
            .orderBy('id', 'asc')
            .select('*');
            comment.replies = replies;
            const createdAt = new Date(comment.created_at);
            const createdAtFormatted = `${createdAt.getFullYear()}:${createdAt.getMonth()+1}:${createdAt.getDate()} ${createdAt.getHours()}:${createdAt.getMinutes()}`;
            comment.created_at = createdAtFormatted;
        }
        return comments;
    }
}
        
          

    