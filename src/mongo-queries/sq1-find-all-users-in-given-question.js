/**
 * Created by mingxuanli on 8/10/17.
 */

const query = `
    db.posts.aggregate([
        {
            $match: {
                $or: [
                    {PostTypeId: 1, Id:1},
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
    ]);
`;

module.exports = query;