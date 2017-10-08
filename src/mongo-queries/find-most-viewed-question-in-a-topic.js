/**
 * Created by mingxuanli on 8/10/17.
 */

const query = `
    db.posts.aggregate([
        {
            $unwind: "$Tags"
        },
        {
            $match: {
                $or: [
                    {"Tags.Id": 4},
                    {"Tags.TagName": { $eq: 'government'}}
                ]
            }
        },
        {
            $sort: { "ViewCount": -1 }
        },
        {
            $limit: 1
        }
    ])
`;

module.exports = query;