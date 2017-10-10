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
    OwnerUserId: Number,
    Title: String,
    AnswerCount: Number,
    ViewCount: Number,
    // Changed Fields
    Tags: [TagsSchema],
    // Additional Fields
    AnswersIds: [Number],
    VotesIds: [Number]
    // Remove Unused Fields - CommentCount, FavoriteCount, OwnerDisplayName, Score, LastEditorUserId, LastEditDate, LastActivityDate
});

PostsModelSchema.index({
    Id: 1,
    ParentId: 1,
    AcceptedAnswerId: 1,
    OwnerUserId: 1
});

const PostsModel = mongoose.model('Posts', PostsModelSchema);

module.exports = {
    schema: PostsModelSchema,
    model: PostsModel
};