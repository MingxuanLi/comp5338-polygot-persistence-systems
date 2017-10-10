/**
 * Created by mingxuanli on 8/10/17.
 */

const _ = require('lodash');
const Posts = require('../mongo-schemas/posts.model');

// Input Param, Please change it for different queries
const UserId = 33;

// Query
const queryCoAuthorsAnsweringQuestonsForThisUser = [
        {
            $match: {
                OwnerUserId: UserId,
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
                "CoAuthor.Id": {"$exists": true, "$ne": UserId}
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
    ];

const queryCoAuthorsAnsweringQuestonsForOtherUser = [
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
    ];

const executeQuery = () => {
    return new Promise((resolve, reject) => {
        Posts.model.aggregate(queryCoAuthorsAnsweringQuestonsForThisUser, function (err, coAuthors1) {
            if(err){
                reject(err);
            }else{
                Posts.model.aggregate(queryCoAuthorsAnsweringQuestonsForOtherUser, function(err, coAuthors2){
                    if(err){
                        reject(err);
                    }else{
                        const data = _.concat(coAuthors1, coAuthors2);
                        let coAuthors = [];
                        _.forEach(data, function(value, key){
                            let coAuthor = _.find(data, {coAuthorId: value._id.coAuthorId});
                            if(coAuthor){
                                coAuthor.count += value.count;
                            }else{
                                coAuthor = {
                                    coAuthorId: value._id.coAuthorId,
                                    displayName: value._id.displayName,
                                    count: value.count
                                };
                                coAuthors.push(coAuthor);
                            }
                        });
                        coAuthors = _.orderBy(coAuthors, 'count', 'desc').slice(0, 5);
                        resolve(coAuthors);
                    }
                });
            }
        });
    });
};

module.exports = {
    queryCoAuthorsAnsweringQuestonsForThisUser,
    queryCoAuthorsAnsweringQuestonsForOtherUser,
    executeQuery
};