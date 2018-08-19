// import moment from 'moment';
import { cacheAllPojectEvents } from './events';

module.exports.backgroundJob = async function(
  request: Parse.Cloud.FunctionRequest,
  response: Parse.Cloud.FunctionResponse,
) {
  try {
    // Run
    await cacheAllPojectEvents();

    response.success({});
  } catch (error) {
    console.log('regionPost error', error);
    return response.error(error);
  }
};
