/**
 * Created by mingxuanli on 8/10/17.
 */

const _ = require('lodash');
const moment = require('moment');
const tagIds = '[4, 60]';

const query = `
    MATCH (answer:Answer)<-[:Accepted]-(question:Question)-[:Contains]->(tag:Tag)
    WHERE tag.Id in ${tagIds}
    WITH tag, min(answer.CreationDate - question.CreationDate) as time
    MATCH (answer:Answer)<-[:Accepted]-(question:Question)-[:Contains]->(tag:Tag)
    WHERE answer.CreationDate - question.CreationDate = time
    RETURN tag.Id as tagId, tag.TagName as tagName, time, question.Id as questionId, question.Title as questionTitle
`;

const executeQuery = (session) => {
    let res = [];
    return new Promise((resolve, reject) => {
        session.run(query)
            .then(result => {
                _.forEach(result.records, (record) => {
                    res.push({
                        tagId: record._fields[0].toInt(),
                        tagName: record._fields[1],
                        timeDiff: record._fields[2].toInt(),
                        questionId: record._fields[3].toInt(),
                        questionTitle: record._fields[4]
                    });
                });
                resolve(res);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

module.exports = {
    query,
    executeQuery
};