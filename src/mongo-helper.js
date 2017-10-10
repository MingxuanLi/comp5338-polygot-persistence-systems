/**
 * Created by mingxuanli on 26/9/17.
 */

const _ = require('lodash');
const moment = require('moment');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const csvParser = require('./csv-parser');
const Posts = require('./mongo-schemas/posts.model');
const Tags = require('./mongo-schemas/tags.model');
const Users = require('./mongo-schemas/users.model');
const Votes = require('./mongo-schemas/votes.model');

const csvFiles = [
    { model: Posts.model, path: 'dataset/Posts.csv' },
    { model: Tags.model, path: 'dataset/Tags.csv' },
    { model: Users.model, path: 'dataset/Users.csv' },
    { model: Votes.model, path: 'dataset/Votes.csv' }
];

// Please change the settings if you would like to connect to your local or different environment
const dbUrl = 'mongodb://localhost:27017/polygot-persistence';
const dateFormat = 'DD-MM-YYYY kk:mm:ss A';

const connect = () => {
    mongoose.connect(dbUrl, {useMongoClient:true});
};

const disconnect = () => {
    mongoose.disconnect();
};

const clearCollection = () => {
    const clearCols = [];
    csvFiles.forEach((csvFile) => {
        clearCols.push(csvFile.model.remove({}).exec());
    });
    return new Promise((resolve, reject) => {
        Promise.all(clearCols).then((res) => {
            resolve(res);
        }, (err) => {
            reject(err);
        });
    });
};

const loadData = async () => {
    const posts = await csvParser.parseCsvFile(csvFiles[0].path);
    const tags = await csvParser.parseCsvFile(csvFiles[1].path);
    const users = await csvParser.parseCsvFile(csvFiles[2].path);
    const votes = await csvParser.parseCsvFile(csvFiles[3].path);

    const saveOps = [];

    tags.forEach((tagData) => {
        const newTag = new Tags.model(tagData);
        saveOps.push(newTag.save());
    });

    votes.forEach((voteData) => {
        if(!moment(voteData.CreationDate, moment.ISO_8601).isValid() && !_.isEmpty(voteData.CreationDate)){
            voteData.CreationDate = moment.utc(voteData.CreationDate, dateFormat);
        }
        const newVote = new Votes.model(voteData);
        saveOps.push(newVote.save());
    });

    posts.forEach((postData) => {
        if(!moment(postData.CreationDate, moment.ISO_8601).isValid() && !_.isEmpty(postData.CreationDate)){
            postData.CreationDate = moment.utc(postData.CreationDate, dateFormat).toISOString();
        }
        // if(!moment(postData.LastEditDate, moment.ISO_8601).isValid() && !_.isEmpty(postData.LastEditDate)){
        //     postData.LastEditDate = moment.utc(postData.LastEditDate, dateFormat);
        // }
        // if(!moment(postData.LastActivityDate, moment.ISO_8601).isValid() && !_.isEmpty(postData.LastActivityDate)){
        //     postData.LastActivityDate = moment.utc(postData.LastActivityDate, dateFormat);
        // }
        const tagNames = postData.Tags.split(',');
        postData.Tags = [];
        tagNames.forEach((tagName) => {
            const tag = tags.find(tag => tag.TagName === tagName);
            if(tag){
                postData.Tags.push(tag);
            }
        });
        if(parseInt(postData.PostTypeId) === 1){
            postData.AnswersIds = posts.filter(post => post.ParentId === postData.Id).map(post => post.Id);
        }
        postData.VotesIds = votes.filter(vote => vote.PostId === postData.Id).map(vote => vote.Id);
        const newPost = new Posts.model(postData);
        saveOps.push(newPost.save());
    });

    users.forEach((userData) => {
        if(!moment(userData.CreationDate, moment.ISO_8601).isValid() && !_.isEmpty(userData.CreationDate)){
            userData.CreationDate = moment.utc(userData.CreationDate, dateFormat);
        }
        // if(!moment(userData.LastAccessDate, moment.ISO_8601).isValid() && !_.isEmpty(userData.LastAccessDate)){
        //     userData.LastAccessDate = moment.utc(userData.LastAccessDate, dateFormat);
        // }
        userData.PostsIds = posts.filter(post => post.OwnerUserId === userData.Id).map(post => post.Id);
        const newUser = new Users.model(userData);
        saveOps.push(newUser.save());
    });

    return new Promise((resolve, reject) => {
        Promise.all(saveOps).then((res) => {
            resolve(res);
        }, (err) => {
            reject(err);
        });
    });
};

//TODO - Indexing for mongodb
const createIndex = () => {

};

module.exports = {
    connect,
    disconnect,
    clearCollection,
    loadData
};