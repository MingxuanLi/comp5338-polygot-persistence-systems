/**
 * Created by mingxuanli on 9/10/17.
 */

const query = `
    db.posts.aggregate([
        {
            $match: {
                PostTypeId: 1,
                AcceptedAnswerId: { "$exists": true, "$ne": null }
            }
        },
        {
            $project: {
                questionId: "$Id",
                questionTitle: "$Title",
                acceptedAnswerId: "$AcceptedAnswerId",
                tags: {
                    $filter: {
                        input: "$Tags",
                        as: "item",
                        cond: { 
                            "$setIsSubset": [ [ "$$item.Id" ], [4] ]
                        }
                    }
                }
            }
        },
        {
            $match: {
                "tags.0": { "$exists": true }
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
                as: "acceptedAnswer"
            }
        },
        {
            $unwind: "$acceptedAnswer"
        },
        {
            $lookup: {
                from: "users",
                localField: "acceptedAnswer.OwnerUserId",
                foreignField: "Id",
                as: "acceptedUser"
            }
        },
        {
            $unwind: "$acceptedUser"
        },
        {
            $sort: {
                "acceptedUser.Id": 1
            }
        },
        {
            $group: {
                _id: {
                    userId: "$acceptedUser.Id",
                    displayName: "$acceptedUser.DisplayName"
                },
                acceptedQuestions: {
                    $addToSet: {
                        questionId: "$questionId",
                        questionTitle: "$questionTitle",
                        tags: "$tags"
                    }
                }
            }
        },
        {
            $project: {
                _id: "$_id",
                acceptedQuestions: "$acceptedQuestions",
                numOfAcceptedQuestions: {
                    $size: "$acceptedQuestions"
                }
            }
        },
        {
            $sort: {"numOfAcceptedQuestions": -1}
        },
        {
            $limit: 1
        }
    ]);
`;

module.exports = query;