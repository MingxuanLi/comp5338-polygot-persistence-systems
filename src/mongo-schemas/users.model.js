/**
 * Created by mingxuanli on 28/9/17.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsersModelSchema = new Schema({
    Id: Number,
    Reputation: Number,
    CreationDate: Date,
    DisplayName: String,
    LastAccessDate: Date,
    Views: Number,
    UpVotes: Number,
    DownVotes: Number
});

const UsersModel = mongoose.model('Users', UsersModelSchema);

module.exports = {
    schema: UsersModelSchema,
    model: UsersModel
};