const serverConfig = require("../config.json");

const logger = require('../util/LogManager').getLogger('Security.js');

/**
 * CORS POLICY
 * @returns {{credentials: boolean, origin: *}}
 */
function getCorsPolicy() {
    let whitelist = serverConfig.server.corsWhiteList;
    logger.info("CORS policy= " + whitelist)
    return {
        origin: function (origin, callback) {
            let originIsWhitelisted = whitelist.some(function(whitelistedOrigin){
                if (origin === undefined){
                    return true;
                }
                logger.info("Requester's origin is: " + origin);
                return origin.startsWith(whitelistedOrigin);
            });

            // If the origin is either in the whitelist or is undefined (which indicates that the request came from the same origin server), it's allowed.
            if (originIsWhitelisted) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true
    }
}

module.exports = {getCorsPolicy};