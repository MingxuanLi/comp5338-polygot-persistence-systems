/**
 * Created by mingxuanli on 8/10/17.
 */

const query = `
    db.posts.aggregate([
        {
            $match: {
                PostTypeId: 1,
                AcceptedAnswerId: { "$exists": true, "$eq": null }
            }
        }
    ]);
`;

module.exports = query;