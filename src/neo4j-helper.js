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
    name: 'Posts_neo4j.csv',
    src: `${__dirname}/../dataset/Posts_neo4j.csv`,
    out: assignmentDefaultImportBasePath + '/Posts_neo4j.csv'
};

const usersCsvFile = {
    name: 'Users_neo4j.csv',
    src: `${__dirname}/../dataset/Users_neo4j.csv`,
    out: assignmentDefaultImportBasePath + '/Users_neo4j.csv'
};

const connect = () => {
    driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
    session = driver.session();
    return session;
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
    const votesImportQuery = `
        LOAD CSV WITH HEADERS FROM \"file:///${assignmentName}/${votesCsvFile.name}\" AS row
        CREATE (vote:Vote)
        SET vote = row,
            vote.Id = toInteger(row.Id),
            vote.PostId = ToInteger(row.PostId),
            vote.VoteTypeId = ToInteger(row.VoteTypeId),
            vote.CreationDate = ToInteger(row.CreationDate),
            vote.UserId = ToInteger(row.UserId)
    `;
    return session.run(votesImportQuery);
};

const loadPostsGraphData = () => {
    const postsImportQuery = `
        LOAD CSV WITH HEADERS FROM \"file:///${assignmentName}/${postsCsvFile.name}\" AS row
        CREATE (post:Post)
        SET post = row,
            post.Id = toInteger(row.Id),
            post.PostTypeId = toInteger(row.PostTypeId),
            post.ParentId = ToInteger(row.ParentId),
            post.AcceptedAnswerId = ToInteger(row.AcceptedAnswerId),
            post.CreationDate = ToInteger(row.CreationDate),
            post.Score = ToInteger(row.Score),
            post.OwnerUserId = ToInteger(row.OwnerUserId),
            post.LastEditorUserId = ToInteger(row.LastEditorUserId),
            post.LastEditDate = ToInteger(row.LastEditDate),
            post.LastActivityDate = ToInteger(row.LastActivityDate),
            post.AnswerCount = ToInteger(row.AnswerCount),
            post.ViewCount = ToInteger(row.ViewCount),
            post.Tags = split(row.Tags, ",")
    `;
    return session.run(postsImportQuery);
};

const loadUsersGraphData = () => {
    const usersImportQuery = `
        LOAD CSV WITH HEADERS FROM \"file:///${assignmentName}/${usersCsvFile.name}\" AS row
        CREATE (user:User)
        SET user = row,
            user.Id = toInteger(row.Id),
            user.Reputation = ToInteger(row.Reputation),
            user.CreationDate = ToInteger(row.CreationDate),
            user.LastAccessDate = ToInteger(row.LastAccessDate),
            user.Views = ToInteger(row.Views),
            user.UpVotes = ToInteger(row.UpVotes),
            user.DownVotes = ToInteger(row.DownVotes)
    `;
    return session.run(usersImportQuery);
};

const setQuestionLabel = () => {
    const setQuestionLabelCypherQuery = `
        MATCH (post:Post)
        WHERE post.PostTypeId = 1 
        SET post:Question
    `;
    return session.run(setQuestionLabelCypherQuery);
};

const setAnswerLabel = () => {
    const setAnswerLabelCypherQuery = `
        MATCH (post:Post)
        WHERE post.PostTypeId = 2
        SET post:Answer
    `;
    return session.run(setAnswerLabelCypherQuery);
};

const setUserOwnPostRelationship = () => {
    const setRelationshipCypherQuery = `
        MATCH (post:Post)
        WITH post
        MATCH (user:User)
        WHERE post.OwnerUserId = user.Id
        CREATE (user)-[own:Owned]->(post)
    `;
    return session.run(setRelationshipCypherQuery);
};

const setQuestionAnswerAcceptedRelationship = () => {
    const setRelationshipCypherQuery = `
        MATCH (question:Question)
        WITH question
        MATCH (answer:Answer)
        WHERE question.PostTypeId = 1 AND question.AcceptedAnswerId = answer.Id
        CREATE (question)-[accepted:Accepted]->(answer)
    `;
    return session.run(setRelationshipCypherQuery);
};

const setQuestionAnswerAnsweredRelationship = () => {
    const setRelationshipCypherQuery = `
        MATCH (question:Question)
        WITH question
        MATCH (answer:Answer)
        WHERE question.Id = answer.ParentId
        CREATE (question)<-[answered:Answered]-(answer)
    `;
    return session.run(setRelationshipCypherQuery);
};

const setVotePostRelationship = () => {
    const setRelationshipCypherQuery = `
        MATCH (post:Post)
        WITH post
        MATCH (vote:Vote)
        WHERE post.Id = vote.PostId
        CREATE (post)<-[voted:Voted]-(vote)
    `;
    return session.run(setRelationshipCypherQuery);
};

const setPostTagRelationship = () => {
    const setRelationshipCypherQuery = `
        MATCH (post:Post) 
        WITH post
        MATCH (tag:Tag)
        WHERE tag.TagName IN post.Tags
        CREATE (post)-[contains:Contains]->(tag);
    `;
    return session.run(setRelationshipCypherQuery);
};

//TODO - Indexing for neo4j
const createIndex = () => {

};

const loadGraphData = () => {
    return Promise.all([
        loadTagsGraphData(),
        loadVotesGraphData(),
        loadUsersGraphData(),
        loadPostsGraphData()
    ]);
};

const setUpNodeLabels = () => {
    return Promise.all([
        setQuestionLabel(),
        setAnswerLabel()
    ]);
};

const setUpRelationships = () => {
    return Promise.all([
        setUserOwnPostRelationship(),
        setQuestionAnswerAcceptedRelationship(),
        setQuestionAnswerAnsweredRelationship(),
        setVotePostRelationship(),
        setPostTagRelationship()
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
    fs.copySync(usersCsvFile.src, usersCsvFile.out);
    fs.copySync(postsCsvFile.src, postsCsvFile.out);
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
    setUpNodeLabels,
    setUpRelationships,
    setUp,
    cleanUp
};