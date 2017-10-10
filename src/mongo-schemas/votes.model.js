/**
 * Created by mingxuanli on 28/9/17.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VotesModelSchema = new Schema({
    // Original Fields
    Id: Number,
    PostId: Number,
    VoteTypeId: Number,
    CreationDate: Date,
    UserId: Number
    // Remove Unused Fields - BountyAmount
});

VotesModelSchema.index({
    Id: 1,
    PostId: 1
});

const VotesModel = mongoose.model('Votes', VotesModelSchema);

module.exports = {
    schema: VotesModelSchema,
    model: VotesModel
};