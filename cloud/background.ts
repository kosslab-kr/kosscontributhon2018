// import moment from 'moment';

module.exports.backgroundJob = async function(
  request: Parse.Cloud.FunctionRequest,
  response: Parse.Cloud.FunctionResponse,
) {
  try {
    // Run

    response.success({});
  } catch (error) {
    console.error('regionPost error', error);
    return response.error(error);
  }
};
