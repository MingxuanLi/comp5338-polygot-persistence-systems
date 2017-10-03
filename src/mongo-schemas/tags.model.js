/**
 * Created by mingxuanli on 26/9/17.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TagsModelSchema = new Schema({
    // Original Fields
    Id: Number,
    TagName: String,
    Count: Number
});

const TagsModel = mongoose.model('Tags', TagsModelSchema);

module.exports = {
    schema: TagsModelSchema,
    model: TagsModel
};