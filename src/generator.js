/**
 * Created by mingxuanli on 3/10/17.
 */

const _ = require('lodash');
const fs = require('fs-extra');
const moment = require('moment');
const json2csv = require('json2csv');

const csvParser = require('./csv-parser');

const csvFiles = [
    { path: 'dataset/Posts.csv', out: 'dataset/Posts_neo4j.csv' },
    { path: 'dataset/Tags.csv', out: 'dataset/Tags_neo4j.csv' },
    { path: 'dataset/Users.csv', out: 'dataset/Users_neo4j.csv' },
    { path: 'dataset/Votes.csv', out: 'dataset/Votes_neo4j.csv' }
];
const dateFormat = 'DD-MM-YYYY kk:mm';

const generateNeo4jCsvFiles = async () => {

    const posts = await csvParser.parseCsvFile(csvFiles[0].path);
    const postsFields = _.pull(Object.keys(posts[0]), 'CommentCount', 'FavoriteCount', 'ViewCount', 'OwnerDisplayName');
    posts.forEach((postData) => {
        if(!moment(postData.CreationDate, moment.ISO_8601).isValid() && !_.isEmpty(postData.CreationDate)){
            postData.CreationDate = moment(postData.CreationDate, dateFormat);
        }
        postData.CreationDate = moment(postData.CreationDate).unix();
        if(!moment(postData.LastEditDate, moment.ISO_8601).isValid() && !_.isEmpty(postData.LastEditDate)){
            postData.LastEditDate = moment(postData.LastEditDate, dateFormat);
        }
        postData.LastEditDate = moment(postData.LastEditDate).unix();
        if(!moment(postData.LastActivityDate, moment.ISO_8601).isValid() && !_.isEmpty(postData.LastActivityDate)){
            postData.LastActivityDate = moment(postData.LastActivityDate, dateFormat);
        }
        postData.LastActivityDate = moment(postData.LastActivityDate).unix();
        // Remove Unused fields
        delete postData.CommentCount, postData.FavoriteCount, postData.ViewCount, postData.OwnerDisplayName;
    });
    const newCsvPosts = json2csv({ data: posts, fields: postsFields});
    fs.outputFileSync(csvFiles[0].out, newCsvPosts);

    const users = await csvParser.parseCsvFile(csvFiles[2].path);
    const usersFields = _.pull(Object.keys(users[0]), 'Location', 'Age');
    users.forEach((userData) => {
        if(!moment(userData.CreationDate, moment.ISO_8601).isValid() && !_.isEmpty(userData.CreationDate)){
            userData.CreationDate = moment(userData.CreationDate, dateFormat);
        }
        userData.CreationDate = moment(userData.CreationDate).unix();
        if(!moment(userData.LastAccessDate, moment.ISO_8601).isValid() && !_.isEmpty(userData.LastAccessDate)){
            userData.LastAccessDate = moment(userData.LastAccessDate, dateFormat);
        }
        userData.LastAccessDate = moment(userData.LastAccessDate).unix();
        // Remove Unused fields
        delete userData.Location, userData.Age;
    });
    const newCsvUsers = json2csv({ data: users, fields: usersFields, quotes: ''});
    fs.outputFileSync(csvFiles[2].out, newCsvUsers);

    const votes = await csvParser.parseCsvFile(csvFiles[3].path);
    const votesFields = _.pull(Object.keys(votes[0]), 'BountyAmount');
    votes.forEach((voteData) => {
        if(!moment(voteData.CreationDate, moment.ISO_8601).isValid() && !_.isEmpty(voteData.CreationDate)){
            voteData.CreationDate = moment(voteData.CreationDate, dateFormat);
        }
        voteData.CreationDate = moment(voteData.CreationDate).unix();
        // Remove Unused fields
        delete voteData.BountyAmount;
    });

    const newCsvVotes = json2csv({ data: votes, fields: votesFields, quotes: ''});
    fs.outputFileSync(csvFiles[3].out, newCsvVotes);
};

generateNeo4jCsvFiles();