/**
 * Created by mingxuanli on 8/10/17.
 */

const Posts = require('../mongo-schemas/posts.model');

// Input Param, Please change it for different queries
const tagIds = [4, 60];

// Query
const query = [
    {
        $match: {
            PostTypeId: 1,
            AcceptedAnswerId: {"$exists": true, "$ne": null}
        }
    },
    {
        $project: {
            questionId: "$Id",
            postCreationDate: "$CreationDate",
            questionTitle: "$Title",
            acceptedAnswerId: "$AcceptedAnswerId",
            tags: {
                $filter: {
                    input: "$Tags",
                    as: "item",
                    cond: {
                        "$setIsSubset": [["$$item.Id"], [4, 60]]
                    }
                }
            }
        }
    },
    {
        $match: {
            "tags.0": {"$exists": true}
        }
    },
    {
        $unwind: "$tags"
    },
    {
        $lookup: {
            from: "posts",
            localField: "acceptedAnswerId",
            foreignField: "Id",
            as: "AcceptedAnswer"
        }
    },
    {
        $unwind: "$AcceptedAnswer"
    },
    {
        $project: {
            tagName: "$tags.TagName",
            tagId: "$tags.Id",
            questionId: "$questionId",
            questionCreationDate: "$postCreationDate",
            answerId: "$AcceptedAnswer.Id",
            answerCreationDate: "$AcceptedAnswer.CreationDate",
            timeToAnswer: {
                $subtract: ["$AcceptedAnswer.CreationDate", "$postCreationDate"]
            }
        }
    },
    {
        $sort: {
            timeToAnswer: 1
        }
    },
    {
        $group: {
            _id: {
                tagId: "$tagId",
                tagName: "$tagName"
            },
            questionId: {$first: "$questionId"},
            questionCreationDate: {$first: "$questionCreationDate"},
            answerId: {$first: "$answerId"},
            answerCreationDate: {$first: "$answerCreationDate"},
            timeToAnswer: {
                $min: "$timeToAnswer"
            }
        }
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