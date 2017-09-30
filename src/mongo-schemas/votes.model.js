/**
 * Created by mingxuanli on 28/9/17.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VotesModelSchema = new Schema({
    Id: Number,
    PostId: Number,
    VoteTypeId: Number,
    CreationDate: Date,
    UserId: Number,
    BountyAmount: Number
});

const VotesModel = mongoose.model('Votes', VotesModelSchema);

module.exports = {
    schema: VotesModelSchema,
    model: VotesModel
};