/**
 * Created by mingxuanli on 8/10/17.
 */

const Posts = require('../mongo-schemas/posts.model');

// Input Param, Please change it for different queries
const questionId = 1;

// Query
const query = [
    {
        $match: {
            $or: [
                {PostTypeId: 1, Id: questionId},
                {PostTypeId: 2, ParentId: 1}
            ]
        }
    },
    {
        $lookup: {
            from: "users",
            localField: "OwnerUserId",
            foreignField: "Id",
            as: "User"
        }
    },
    {
        $unwind: "$User"
    },
    {
        $project: {
            _id: 0,
            postId: "$Id",
            userId: "$User.Id",
            displayName: "$User.DisplayName",
            creationDate: "$User.CreationDate",
            upVotes: "$User.UpVotes",
            downVotes: "$User.DownVotes"
        }
    }
];

const executeQuery = () => {
    return new Promise((resolve, reject) => {
        Posts.model.aggregate(query, function (err, data) {
            if(err){
                reject(err);
            }else{
                resolve(data);
            }
        });
    });
};

module.exports = {
    query,
    executeQuery
};