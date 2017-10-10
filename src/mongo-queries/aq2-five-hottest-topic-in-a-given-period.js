/**
 * Created by mingxuanli on 8/10/17.
 */

const Posts = require('../mongo-schemas/posts.model');

const query = `
    db.posts.aggregate([
        {
            $project: {
                Id: "$Id",
                PostTypeId: "$PostTypeId",
                CreationDate: "$CreationDate",
                AnswersIds: "$AnswersIds",
                Tags: "$Tags"
            }
        },
        {
            $match: {
                PostTypeId: 1,
                "Tags.0": {"$exists": true}
            }
        },
        {
            $unwind: "$Tags"
        },
        {
            $unwind: "$AnswersIds"
        },
        {
            $lookup: {
                from: "posts",
                localField: "AnswersIds",
                foreignField: "Id",
                as: "Answer"
            }
        },
        {
            $unwind: "$Answer"
        },
        {
            $match: {
                "Answer.CreationDate" : {
                    $gte: ISODate("2013-05-01T00:00:00.000Z"),
                    $lte: ISODate("2013-05-31T00:00:00.000Z")
                }
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "Answer.OwnerUserId",
                foreignField: "Id",
                as: "User"
            }
        },
        {
            $unwind: "$User"
        },
        {
            $group: {
                _id: {
                    tagId: "$Tags.Id",
                    tagName: "$Tags.TagName",
                    userId: "$User.Id",
                    userName: "$User.DisplayName"
                },
                "count": { "$sum": 1 }
            }
        }
    ]);
`;

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