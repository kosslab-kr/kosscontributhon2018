/** ******************************************************************************************************************************************
 * Installation
 ****************************************************************************************************************************************** * */
/**
 * query installation object using randomId
 */
Parse.Cloud.define('getInstallationByObjectId', require('./util').getInstallationByObjectId);

/** ******************************************************************************************************************************************
 * BackgroundJob
 ****************************************************************************************************************************************** * */
// get region post
Parse.Cloud.define('backgroundJob', require('./background').backgroundJob);

/** ******************************************************************************************************************************************
 * Others
 ****************************************************************************************************************************************** * */
// array elements add, remove
Parse.Cloud.define('toggleArray', require('./util').toggleArray);

// increment/decreament value
Parse.Cloud.define('countSave', require('./util').countSave);

// get geoip
Parse.Cloud.define('getGeoip', require('./util').getGeoip);

/** ******************************************************************************************************************************************
 * Triggers
 ****************************************************************************************************************************************** * */
// user delete blocking
// Parse.Cloud.beforeDelete(Parse.User, require('./trigger').beforeDelete_User);

// installation management
Parse.Cloud.beforeSave(Parse.Installation, require('./trigger').beforeSave_Installation);

// User
Parse.Cloud.beforeSave(Parse.User, require('./trigger').beforeSave_User);

// Files
Parse.Cloud.afterDelete('Files', require('./trigger').afterDelete_Files);
