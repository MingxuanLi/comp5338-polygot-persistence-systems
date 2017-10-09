/**
 * Created by mingxuanli on 26/9/17.
 */

const args = require('yargs');
const chalk = require('chalk');

const mongo = require('./mongo-helper');
const neo4j = require('./neo4j-helper');

const commandLine = async () => {
    const db = args.argv.db;
    const action = args.argv.action;

    if(db === 'mongodb' && action === 'load'){
        mongo.connect();
        await mongo.clearCollection();
        await mongo.loadData();
        mongo.disconnect();
    }else if(db === 'mongodb' && action === 'query'){
        mongo.connect();
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
        neo4j.connect();
        neo4j.disconnect();
    }else{
        console.error(chalk.red('Unknown/Invalid DB or Action'));
    }
};

commandLine();