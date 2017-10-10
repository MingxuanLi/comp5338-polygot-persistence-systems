/**
 * Created by mingxuanli on 26/9/17.
 */

const args = require('yargs');
const chalk = require('chalk');

const mongo = require('./mongo-helper');
const neo4j = require('./neo4j-helper');
const mongoQuerySQ1 = require('./mongo-queries/sq1-find-all-users-in-given-question');
const mongoQuerySQ2 = require('./mongo-queries/sq2-find-most-viewed-question-in-a-topic');
const mongoQueryAQ1 = require('./mongo-queries/aq1-discover-easiest-question');
const mongoQueryAQ2 = require('./mongo-queries/aq2-five-hottest-topic-in-a-given-period');
const mongoQueryAQ3 = require('./mongo-queries/aq3-champion-user-in-a-topic');
const mongoQueryAQ4 = require('./mongo-queries/aq4-recommend-unanswered-questions-to-a-given-user');
const mongoQueryAQ5_1 = require('./mongo-queries/aq5_1-accepted-answer-upvotes-percentage');
const mongoQueryAQ5_2 = require('./mongo-queries/aq5_2-other-answers-upvotes-percentage');
const mongoQueryAQ6 = require('./mongo-queries/aq6-co-authors');
const neo4jQuerySQ1 = require('./neo4j-queries/sq1-find-all-users-in-given-question');
const neo4jQuerySQ2 = require('./neo4j-queries/sq2-find-most-viewed-question-in-a-topic');
const neo4jQueryAQ1 = require('./neo4j-queries/aq1-discover-easiest-question');
const neo4jQueryAQ3 = require('./neo4j-queries/aq3-champion-user-in-a-topic');
const neo4jQueryAQ6 = require('./neo4j-queries/aq6-co-authors');

const commandLine = async () => {
    const db = args.argv.db;
    const action = args.argv.action;
    const query = args.argv.query;

    if(db === 'mongodb' && action === 'load'){
        mongo.connect();
        await mongo.clearCollection();
        await mongo.loadData();
        mongo.disconnect();
    }else if(db === 'mongodb' && action === 'query'){
        mongo.connect();
        let res = null;
        const timestamp1 = new Date().getTime();
        switch(query){
            case "sq1":
                res = await mongoQuerySQ1.executeQuery();
                break;
            case "sq2":
                res = await mongoQuerySQ2.executeQuery();
                break;
            case "aq1":
                res = await mongoQueryAQ1.executeQuery();
                break;
            case "aq2":
                break;
            case "aq3":
                res = await mongoQueryAQ3.executeQuery();
                break;
            case "aq4":
                break;
            case "aq5_1":
                break;
            case "aq5_2":
                break;
            case "aq6":
                res = await mongoQueryAQ6.executeQuery();
                break;
            default:
                console.error(chalk.red('Unknown/Invalid Query'));
                break;
        };
        const timestamp2 = new Date().getTime();
        console.log('Used Time:' + (timestamp2 - timestamp1));
        console.log('Query Result:');
        console.log(JSON.stringify(res, null, 4));
        mongo.disconnect();
    }else if(db === 'neo4j' && action === 'load'){
        neo4j.setUp();
        neo4j.connect();
        await neo4j.clearGraph();
        await neo4j.loadGraphData();
        await neo4j.setUpNodeLabels();
        await neo4j.setUpRelationships();
        neo4j.disconnect();
        neo4j.cleanUp();
    }else if(db === 'neo4j' && action === 'query'){
        const session = neo4j.connect();
        let res = null;
        const timestamp1 = new Date().getTime();
        switch(query){
            case "sq1":
                res = await neo4jQuerySQ1.executeQuery(session);
                break;
            case "sq2":
                res = await neo4jQuerySQ2.executeQuery(session);
                break;
            case "aq1":
                res = await neo4jQueryAQ1.executeQuery(session);
                break;
            case "aq2":
                break;
            case "aq3":
                res = await neo4jQueryAQ3.executeQuery(session);
                break;
            case "aq4":
                break;
            case "aq5_1":
                break;
            case "aq5_2":
                break;
            case "aq6":
                res = await mongoQueryAQ6.executeQuery(session);
                break;
            default:
                console.error(chalk.red('Unknown/Invalid Query'));
                break;
        };
        const timestamp2 = new Date().getTime();
        console.log('Used Time:' + (timestamp2 - timestamp1));
        console.log('Query Result:');
        console.log(JSON.stringify(res, null, 4));
        neo4j.disconnect();
    }else{
        console.error(chalk.red('Unknown/Invalid DB or Action'));
    }
};

commandLine();