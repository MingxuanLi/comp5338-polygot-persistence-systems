/**
 * Created by mingxuanli on 8/10/17.
 */

const _ = require('lodash');
const moment = require('moment');

// Input Param, Please change it for different queries
const tagId = 4;
const tagName = '"government"';

const query = `
    MATCH (question:Question)-[:Contains]->(tag:Tag)
    WHERE tag.TagName = ${tagName} or tag.Id = ${tagId}
    RETURN question
    ORDER BY question.ViewCount DESC
    LIMIT 1
`;

const executeQuery = (session) => {
    let res = [];
    return new Promise((resolve, reject) => {
        session.run(query)
            .then(result => {
                _.forEach(result.records, (record) => {
                    res.push({
                        Id: record.get(0).properties.Id.toInt(),
                        Title: record.get(0).properties.Title,
                        CreationDate: moment.utc(record.get(0).properties.CreationDate.toInt() * 1000),
                        ViewCount: record.get(0).properties.ViewCount.toInt()
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