const mongoose = require('mongoose');

const config = require("../config.json");
const dbConfig = config.database;
const dbName = dbConfig.dbname;

const logger = require('../util/LogManager').getLogger('DbConfig.js');

//iterate the local data and compare with db model data
async function mongoDBConnectAndInit () {
    const isCloudDb = dbConfig.isCloudDb;
    let mongoDbUrlStr = ""
    //Set full db url
    if (isCloudDb) {
        const cloudDbUri = dbConfig.cloudDbFullUrl;
        const mongoDBUrl = new URL(cloudDbUri);
        mongoDbUrlStr = mongoDBUrl.toString();
    } else {
        const mongoDBUrlNoAuth = `mongodb://${dbConfig.host}:${dbConfig.port}/${dbName}`;
        const mongoDBUrl = new URL(`mongodb://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbName}`);
        mongoDbUrlStr = dbConfig.hasAuth === false ? mongoDBUrlNoAuth.toString() : mongoDBUrl.toString();
    }

    try {
        logger.info("Connecting to mongoDB: " + mongoDbUrlStr);
        await mongoose.connect(mongoDbUrlStr);
        await mongoose.connection.on('error', () => logger.error("Connection failed"));
    } catch (err) {
        logger.error("Database connection error", err);
        throw err;
    }
}

module.exports = {mongoDBConnectAndInit};