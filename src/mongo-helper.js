/**
 * Created by mingxuanli on 26/9/17.
 */
const mongoose = require('mongoose');
const Tags = require('./mongo-schemas/tags.model');

const loadData = (data) => {
    mongoose.connect('mongodb://localhost:27017/polygot-persistence', {useMongoClient:true});
    Tags.remove({}, (err, res) => {
        data.forEach((val, index) => {
            const tag = new Tags(val);
            tag.save((err, res) => {
                console.log(err);
                console.log(res);
            });
        });
        // mongoose.disconnect();
    });
};

module.exports = {
    loadData
};