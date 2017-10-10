/**
 * Created by mingxuanli on 9/10/17.
 */

const _ = require('lodash');
const moment = require('moment');

// Input Param, Please change it for different queries
const tagId = 4;

const query = `
    MATCH (user:User)-[:Owned]->(answer:Answer)<-[:Accepted]-(question:Question)-[:Contains]->(tag:Tag{Id:${tagId}})
    WITH user, tag, count(*) as answersCount
    ORDER by answersCount DESC
    LIMIT 1
    MATCH (user)-[:Owned]->(answer:Answer)<-[:Accepted]-(question:Question)-[:Contains]->(tag)
    RETURN user.Id as userId, user.DisplayName as userDisplayName, question.Id as questionId, question.Title as questionTitle
`;

const executeQuery = (session) => {
    let res = [];
    return new Promise((resolve, reject) => {
        session.run(query)
            .then(result => {
                _.forEach(result.records, (record) => {
                    res.push({
                        userId: record._fields[0].toInt(),
                        userDisplayName: record._fields[1],
                        questionId: record._fields[2].toInt(),
                        questionTitle: record._fields[3]
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