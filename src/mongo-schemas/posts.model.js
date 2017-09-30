/**
 * Created by mingxuanli on 28/9/17.
 */

const mongoose = require('mongoose');
const TagsSchema = require('./tags.model').schema;
const Schema = mongoose.Schema;

const PostsModelSchema = new Schema({
    Id: Number,
    PostTypeId: Number,
    ParentId: Number,
    AcceptedAnswerId: Number,
    CreationDate: Date,
    Score: Number,
    ViewCount: Number,
    OwnerUserId: Number,
    LastEditorUserId: Number,
    LastEditDate: Date,
    LastActivityDate: Date,
    Title: String,
    // Changed Field
    // Tags: [TagsSchema],
    AnswerCount: Number,
    CommentCount: Number,
    FavoriteCount: Number,
    // Additional Field
    AnswersIds: [Number]
});

const PostsModel = mongoose.model('Posts', PostsModelSchema);

module.exports = {
    schema: PostsModelSchema,
    model: PostsModel
};