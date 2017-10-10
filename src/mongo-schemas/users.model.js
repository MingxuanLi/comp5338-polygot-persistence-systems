/**
 * Created by mingxuanli on 28/9/17.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsersModelSchema = new Schema({
    // Original Fields
    Id: Number,
    CreationDate: Date,
    DisplayName: String,
    Views: Number,
    UpVotes: Number,
    DownVotes: Number,
    // Additional Fields
    PostsIds: [Number]
    // Remove Unused Fields - Location, Age, Reputation, LastAccessDate
});

UsersModelSchema.index({
    Id: 1
});

const UsersModel = mongoose.model('Users', UsersModelSchema);

module.exports = {
    schema: UsersModelSchema,
    model: UsersModel
};