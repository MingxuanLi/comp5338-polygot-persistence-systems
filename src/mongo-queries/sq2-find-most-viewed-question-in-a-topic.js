/**
 * Created by mingxuanli on 8/10/17.
 */

const Posts = require('../mongo-schemas/posts.model');

// Input Param, Please change it for different queries
const tagId = 1;
const tagName = 'government';

// Query
const query = [
    {
        $unwind: "$Tags"
    },
    {
        $match: {
            $or: [
                {"Tags.Id": tagId},
                {"Tags.TagName": {$eq: tagName}}
            ]
        }
    },
    {
        $sort: {"ViewCount": -1}
    },
    {
        $limit: 1
    }
];

const executeQuery = () => {
    return new Promise((resolve, reject) => {
        Posts.model.aggregate(query, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

module.exports = {
    query,
    executeQuery
};