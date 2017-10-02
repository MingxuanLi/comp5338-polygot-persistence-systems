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
    //TODO - need to do conversion date for all the csv files
    // const posts = await csvParser.parseCsvFile(csvFiles[0].path);
    // const users = await csvParser.parseCsvFile(csvFiles[2].path);
    const votes = await csvParser.parseCsvFile(csvFiles[3].path);
    const votesFields = Object.keys(votes[0]);
    votes.forEach((voteData) => {
        if(!moment(voteData.CreationDate, moment.ISO_8601).isValid() && !_.isEmpty(voteData.CreationDate)){
            voteData.CreationDate = moment(voteData.CreationDate, dateFormat);
        }
        voteData.CreationDate = moment(voteData.CreationDate).unix();
    });

    const newCsvVotes = json2csv({ data: votes, fields: votesFields, quotes: ''});
    fs.outputFileSync(csvFiles[3].out, newCsvVotes);
};

generateNeo4jCsvFiles();