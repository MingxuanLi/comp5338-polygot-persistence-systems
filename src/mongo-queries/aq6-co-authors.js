/**
 * Created by mingxuanli on 8/10/17.
 */

const queryCoAuthorsAnsweringQuestonsForThisUser = `
    db.posts.aggregate([
        {
            $match: {
                OwnerUserId: 33,
                PostTypeId: 1
            }
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
            $lookup: {
                from: "users",
                localField: "Answer.OwnerUserId",
                foreignField: "Id",
                as: "CoAuthor"
            }
        },
        {
            $unwind: "$CoAuthor"
        },
        {
            $match: {
                "CoAuthor.Id": {"$exists": true, "$ne": 33}
            }
        },
        {
            $group: {
                _id: {
                    coAuthorId: "$CoAuthor.Id",
                    displayName: "$CoAuthor.DisplayName"
                },
                count: { $sum : 1}
            }
        },
        {
            $sort: {count: -1}
        }
    ]);
`;

const queryCoAuthorsAnsweringQuestonsForOtherUser = `
    db.posts.aggregate([
        {
            $match: {
                OwnerUserId: 33,
                PostTypeId: 2
            }
        },
        {
            $lookup: {
                from: "posts",
                localField: "ParentId",
                foreignField: "Id",
                as: "Question"
            }
        },
        {
            $unwind: "$Question"
        },
        {
            $lookup: {
                from: "posts",
                localField: "Question.AnswersIds",
                foreignField: "Id",
                as: "Answer"
            }
        },
        {
            $unwind: "$Answer"
        },
        {
            $lookup: {
                from: "users",
                localField: "Question.OwnerUserId",
                foreignField: "Id",
                as: "Organizer"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "Answer.OwnerUserId",
                foreignField: "Id",
                as: "Contributor"
            }
        },
        { 
            $project: { 
                "CoAuthor": { "$setUnion": [ "$Organizer", "$Contributor" ] } 
            }
        },
        {
            $unwind: "$CoAuthor"
        },
        {
            $match: {
                "CoAuthor.Id": {"$exists": true, "$ne": 33}
            }
        },
        {
            $group: {
                _id: {
                    coAuthorId: "$CoAuthor.Id",
                    displayName: "$CoAuthor.DisplayName"
                },
                count: { $sum : 1}
            }
        },
        {
            $sort: {count: -1}
        }
    ]);
`;

module.exports = {
    queryCoAuthorsAnsweringQuestonsForThisUser,
    queryCoAuthorsAnsweringQuestonsForOtherUser
};