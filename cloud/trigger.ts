import _ from 'lodash';
// import moment from 'moment';
// import { menuOptions } from './types';
import {
  APP,
  returnNext,
  // aclWriteSecret,
  // aclReadSecret,
} from './util';

/** ******************************************************************************************************************************************
 * functions
 ****************************************************************************************************************************************** * */
// async function fileTargetSave(
//   targetClass: string,
//   targetId: string,
//   fileIds: string[],
// ) {
//   if (!targetClass || !targetId || !fileIds) return;
//   try {
//     // files new added
//     if (fileIds.length) {
//       const FilesQ = new Parse.Query('Files');
//       FilesQ.containedIn('objectId', fileIds);
//       FilesQ.limit(1000);
//       const fileMs = await FilesQ.find({ useMasterKey: true });

//       const files: Parse.Object[] = [];

//       fileMs.forEach((fileM: Parse.Object) => {
//         if (
//           fileM.get('targetClass') !== targetClass ||
//           fileM.get('targetId') !== targetId
//         ) {
//           fileM.set({ targetClass, targetId });
//           files.push(fileM);
//         }
//       });

//       if (files.length) await Parse.Object.saveAll(files);
//     }

//     // files discarded
//     const discardFilesQ = new Parse.Query('Files');
//     discardFilesQ.equalTo('targetClass', targetClass);
//     discardFilesQ.equalTo('targetId', targetId);
//     discardFilesQ.limit(1000);

//     const discardFiles = await discardFilesQ.find({ useMasterKey: true });

//     // clean!
//     if (!discardFiles.length) return;

//     // delete all
//     if (!fileIds.length) {
//       return await Parse.Object.destroyAll(discardFiles, {
//         useMasterKey: true,
//       });
//     }

//     // unused delete
//     const fildIdKey: any = {};
//     fileIds.forEach(fileId => {
//       fildIdKey[fileId] = true;
//     });

//     const filterDiscardFiles = discardFiles.filter(
//       (fileM: Parse.Object) => !fildIdKey[fileM.id],
//     );
//     if (filterDiscardFiles.length) {
//       await Parse.Object.destroyAll(filterDiscardFiles, { useMasterKey: true });
//     }

//     return;
//   } catch (error) {
//     throw error;
//   }
// }

// async function checkUserBanned(userId: string) {
//   if (!userId) return returnNext();

//   const userQ = new Parse.Query(Parse.User);
//   const userM = await userQ.get(userId, {
//     useMasterKey: true,
//   });
//   if (userM.get('isBanned')) {
//     throw { code: 101, error: 'User is banned' };
//   }
// }

/** ******************************************************************************************************************************************
 * User
 ****************************************************************************************************************************************** * */
module.exports.beforeSave_User = function(
  request: Parse.Cloud.BeforeSaveRequest,
  response: Parse.Cloud.BeforeSaveResponse,
) {
  async function adminRole(User: Parse.User) {
    if (User.isNew()) {
      User.set('isAdmin', false);
      return;
    }
    if (!User.dirty('isAdmin')) return;

    const roleQ = new Parse.Query(Parse.Role);
    roleQ.equalTo('name', 'Admins');
    const roleM = await roleQ.first({ useMasterKey: true });
    if (roleM) {
      const isAdmin = User.get('isAdmin');
      if (isAdmin) {
        roleM.getUsers().add(User);
      } else {
        roleM.getUsers().remove(User);
      }
      return roleM.save(null, { useMasterKey: true });
    }
  }

  Promise.all([adminRole(request.object as Parse.User)]).then(
    () => response.success(),
    (err: Parse.Error) => response.error(err),
  );
};

module.exports.beforeDelete_User = function(
  request: Parse.Cloud.BeforeSaveRequest,
  response: Parse.Cloud.BeforeSaveResponse,
) {
  response.error('Error : User delete blocking.');
};

/** ******************************************************************************************************************************************
 * Installation
 ****************************************************************************************************************************************** * */
module.exports.beforeSave_Installation = function(
  request: Parse.Cloud.BeforeSaveRequest,
  response: Parse.Cloud.BeforeSaveResponse,
) {
  // aclWriteSecret(request.object, request.user);

  // user
  if (request.object.get('userId') && request.object.dirty('userId')) {
    request.object.set('user', Parse.User.createWithoutData(request.object.get('userId')));
  }

  function manageInstallation() {
    const deviceToken = request.object.get('deviceToken');
    if (deviceToken === null || deviceToken === '') {
      APP.log(request, 'warn', 'No deviceToken found, exit');
      return returnNext();
    }

    const query = new Parse.Query(Parse.Installation);
    query.equalTo('deviceToken', deviceToken);
    return query.each(
      (installationM: Parse.Object) => {
        if (request.object.isNew() || installationM.id !== request.object.id) {
          return installationM.destroy({ useMasterKey: true });
        }
        APP.log(request, 'warn', 'Current deviceToken ' + deviceToken + ', dont delete');
        return returnNext();
      },
      { useMasterKey: true },
    );
  }

  function manageAndroidInstallation() {
    const androidId = request.object.get('androidId');
    if (androidId === null || androidId === '') {
      APP.log(request, 'warn', 'No androidId found, exit');
      return returnNext();
    }

    const query = new Parse.Query(Parse.Installation);
    query.equalTo('deviceType', 'android');
    query.equalTo('appIdentifier', request.object.get('appIdentifier'));
    query.equalTo('androidId', androidId);
    return query.each(
      (installationM: Parse.Object) => {
        if (installationM.get('installationId') !== request.object.get('installationId')) {
          return installationM.destroy({ useMasterKey: true });
        }
        APP.log(request, 'warn', 'Current App id ' + installationM.get('installationId') + ', dont delete');
        return returnNext();
      },
      { useMasterKey: true },
    );
  }

  Promise.all([manageInstallation(), manageAndroidInstallation()]).then(
    () => response.success(),
    (err: Parse.Error) => response.error(err),
  );
};

/** ******************************************************************************************************************************************
 * Files
 ****************************************************************************************************************************************** * */
module.exports.afterDelete_Files = function(request: Parse.Cloud.AfterDeleteRequest) {
  const PARSE_CONFIG = JSON.parse(process.env.PARSE_CONFIG.replace(/'/gi, '"')); // eslint-disable-line
  const PARSE_APP = PARSE_CONFIG.apps[0];

  function fileDelete(key: string) {
    const url = request.object.get(key);
    if (!url) return returnNext();

    const fileName = url.substring(url.lastIndexOf('/') + 1);
    return Parse.Cloud.httpRequest({
      method: 'DELETE',
      url: PARSE_APP.serverURL + '/files/' + fileName,
      headers: {
        'X-Parse-Application-Id': PARSE_APP.appId,
        'X-Parse-Master-Key': PARSE_APP.masterKey,
      },
    });
  }

  Promise.all([fileDelete('url'), fileDelete('thumbUrl'), fileDelete('sizeMidUrl'), fileDelete('sizeLargeUrl')]).then(
    () => {},
    (err: Parse.Error) => console.error(err),
  );
};
