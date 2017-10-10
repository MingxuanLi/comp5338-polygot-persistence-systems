/**
 * Created by mingxuanli on 8/10/17.
 */

const query = `
    MATCH (user:User)-[own1:Owned]->(answer:Answer)
`;

module.exports = query;