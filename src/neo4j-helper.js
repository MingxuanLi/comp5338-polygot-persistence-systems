/**
 * Created by mingxuanli on 26/9/17.
 */

const _ = require('lodash');
const fs = require('fs-extra');

const neo4j = require('neo4j-driver').v1;

const assignmentName = 'comp5338-polygot-persistence-systems';
const assignmentDefaultImportBasePath = process.env.HOME + `/neo4j/db/import/${assignmentName}`;
const uri = 'bolt://localhost';
const user = 'neo4j';
const password = 'Password123';
let driver, session;

const tagsCsvFile = {
    name: 'Tags.csv',
    src: `${__dirname}/../dataset/Tags.csv`,
    out: assignmentDefaultImportBasePath + '/Tags.csv'
};

const votesCsvFile = {
    name: 'Votes_neo4j.csv',
    src: `${__dirname}/../dataset/Votes_neo4j.csv`,
    out: assignmentDefaultImportBasePath + '/Votes_neo4j.csv'
};

const postsCsvFile = {
    name: 'Posts.csv',
    src: `${__dirname}/../dataset/Posts.csv`,
    out: assignmentDefaultImportBasePath + '/Posts.csv'
};

const usersCsvFile = {
    name: 'Users.csv',
    src: `${__dirname}/../dataset/Users.csv`,
    out: assignmentDefaultImportBasePath + '/Users.csv'
};

const connect = () => {
    driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
    session = driver.session();
};

const clearGraph = () => {
    return session.run('MATCH (n) DETACH DELETE n');
};

const loadTagsGraphData = () => {
    const tagsImportQuery = `
        LOAD CSV WITH HEADERS FROM \"file:///${assignmentName}/${tagsCsvFile.name}\" AS row
        CREATE (tag:Tag)
        SET tag = row,
            tag.Id = toInteger(row.Id),
            tag.Count = ToInteger(row.Count)
    `;
    return session.run(tagsImportQuery);
};

const loadVotesGraphData = () => {
    //TODO - need to convert date into unix time
    const votesImportQuery = `
        LOAD CSV WITH HEADERS FROM \"file:///${assignmentName}/${votesCsvFile.name}\" AS row
        CREATE (vote:Vote)
        SET vote = row,
            vote.Id = toInteger(row.Id),
            vote.PostId = ToInteger(row.PostId),
            vote.VoteTypeId = ToInteger(row.VoteTypeId),
            vote.CreationDate = ToInteger(row.CreationDate),
            vote.UserId = ToInteger(row.UserId),
            vote.BountyAmount = ToInteger(row.BountyAmount)
    `;
    return session.run(votesImportQuery);
};

const loadPostsGraphData = () => {

};

const loadUsersGraphData = () => {

};

const loadGraphData = () => {
    return Promise.all([
        loadTagsGraphData(),
        loadVotesGraphData()
    ]);
};

const disconnect = () => {
    session.close();
    driver.close();
};

const setUp = () => {
    fs.ensureDirSync(assignmentDefaultImportBasePath);
    fs.copySync(tagsCsvFile.src, tagsCsvFile.out);
    fs.copySync(votesCsvFile.src, votesCsvFile.out);
};

const cleanUp = () => {
    fs.emptyDirSync(assignmentDefaultImportBasePath);
    fs.removeSync(assignmentDefaultImportBasePath);
}

module.exports = {
    connect,
    disconnect,
    clearGraph,
    loadGraphData,
    setUp,
    cleanUp
};