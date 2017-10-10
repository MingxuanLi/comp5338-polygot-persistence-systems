/**
 * Created by mingxuanli on 8/10/17.
 */
const _ = require('lodash');
const moment = require('moment');

// Input Param, Please change it for different queries
const UserId = 1;

const query = `
    
`;

const executeQuery = (session) => {
    let res = [];
    return new Promise((resolve, reject) => {
        session.run(query)
            .then(result => {
                _.forEach(result.records, (record) => {
                    res.push({
                        Id: record.get(0).properties.Id.toInt(),
                        DisplayName: record.get(0).properties.DisplayName,
                        CreationDate: moment.utc(record.get(0).properties.CreationDate.toInt() * 1000),
                        UpVotes: record.get(0).properties.UpVotes.toInt(),
                        DownVotes: record.get(0).properties.DownVotes.toInt()
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