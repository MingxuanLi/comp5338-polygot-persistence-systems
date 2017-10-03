/**
 * Created by mingxuanli on 28/9/17.
 */

const mongoose = require('mongoose');
const TagsSchema = require('./tags.model').schema;
const Schema = mongoose.Schema;

const PostsModelSchema = new Schema({
    // Original Fields
    Id: Number,
    PostTypeId: Number,
    ParentId: Number,
    AcceptedAnswerId: Number,
    CreationDate: Date,
    Score: Number,
    OwnerUserId: Number,
    LastEditorUserId: Number,
    LastEditDate: Date,
    LastActivityDate: Date,
    Title: String,
    AnswerCount: Number,
    // Changed Fields
    Tags: [TagsSchema],
    // Additional Fields
    AnswersIds: [Number]
    // Remove Unused Fields - CommentCount, FavoriteCount, ViewCount, OwnerDisplayName
});

const PostsModel = mongoose.model('Posts', PostsModelSchema);

module.exports = {
    schema: PostsModelSchema,
    model: PostsModel
};