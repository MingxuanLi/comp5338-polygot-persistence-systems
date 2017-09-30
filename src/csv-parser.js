/**
 * Created by mingxuanli on 26/9/17.
 */

const csv = require('csvtojson');

const parseCsvFile = (csvFilePath) =>{
    const objArrs = [];
    return new Promise((resolve, reject) => {
        csv().fromFile(csvFilePath)
            .on('json', (jsonObj) => {
                objArrs.push(jsonObj);
            })
            .on('done',(error)=>{
                if(error){
                    reject(error);
                }else{
                    resolve(objArrs);
                }
            });
    });
};

module.exports = {
    parseCsvFile
};