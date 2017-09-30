/**
 * Created by mingxuanli on 26/9/17.
 */

const args = require('yargs');
const chalk = require('chalk');

const mongo = require('./mongo-helper');

const commandLine = async () => {
    const db = args.argv.db;
    const action = args.argv.action;

    if(db === 'mongo' && action === 'load'){
        mongo.connect();
        await mongo.clearCollection();
        await mongo.loadData();
        mongo.disconnect();
    }else if(db === 'mongo' && action === 'query'){
        mongo.connect();
        await mongo.clearCollection();
        await mongo.loadData();
        mongo.disconnect();
    }else if(db === 'neo4j' && action === 'load'){

    }else if(db === 'neo4j' && action === 'query'){

    }else{
        console.error(chalk.red('Unknown/Invalid DB or Action'));
    }
};

commandLine();