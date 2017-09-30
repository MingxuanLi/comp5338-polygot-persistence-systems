/**
 * Created by mingxuanli on 26/9/17.
 */

const csvParser = require('./csv-parser');
const mongo = require('./mongo-helper');

const csvFilePath =  'dataset/Tags.csv';

const getCsv = async () => {
    const value = await csvParser.parseCsvFile(csvFilePath);
    // console.log(value);
    mongo.loadData(value);
};


const commandLine = () => {
    getCsv();
};

commandLine();