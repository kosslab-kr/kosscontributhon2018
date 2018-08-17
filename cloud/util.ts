const _ = require('lodash');

export function modelToObject(model: any) {
  const rt = _.extend(
    {
      id: model.id,
      objectId: model.id,
    },
    model.attributes,
  );
  if (typeof rt.createdAt === 'object' && typeof rt.createdAt.toISOString === 'function') {
    rt.createdAt = rt.createdAt.toISOString();
  }
  if (typeof rt.updatedAt === 'object' && typeof rt.updatedAt.toISOString === 'function') {
    rt.updatedAt = rt.updatedAt.toISOString();
  }
  if (rt.ACL) delete rt.ACL;
  return rt;
}

/**
 * logger
 */
export function log(
  _request: any,
  _severity: string,
  _text: any,
  _text1?: any,
  _text2?: any,
  _text3?: any,
  _text4?: any,
  _text5?: any,
) {
  let fn = console.log;
  // const fnP = _request && _request.log;
  let pref = '';
  const severity = _severity ? _severity.toLowerCase() : 'info';
  switch (severity) {
    case 'info':
      pref = '[INFO] ';
      break;
    case 'error':
      fn = console.error;
      pref = '[ERROR] ';
      break;
    case 'warn':
      pref = '[WARN] ';
      break;
    case 'verbose':
      pref = '[VERBOSE] ';
      break;
    case 'debug':
      pref = '[DEBUG] ';
      break;
    case 'silly':
      pref = '[SILLY] ';
      break;
    default:
      pref = '[INFO] ';
      break;
  }
  if (_text && _.isObject(_text)) _text = JSON.stringify(_text);
  if (_text1 && _.isObject(_text1)) _text1 = JSON.stringify(_text1);
  if (_text2 && _.isObject(_text2)) _text2 = JSON.stringify(_text1);
  if (_text3 && _.isObject(_text3)) _text3 = JSON.stringify(_text1);
  if (_text4 && _.isObject(_text4)) _text4 = JSON.stringify(_text1);
  if (_text5 && _.isObject(_text5)) _text5 = JSON.stringify(_text1);

  const content =
    pref +
    ' ' +
    (_text ? _text + ' ' : '') +
    (_text1 ? _text1 + ' ' : '') +
    (_text2 ? _text2 + ' ' : '') +
    (_text3 ? _text3 + ' ' : '') +
    (_text4 ? _text4 + ' ' : '') +
    (_text5 ? _text5 + ' ' : '');

  if (_request && _request.jobManager) _request.jobManager.log(content);

  if (process.env.NODE_ENV === 'production' && _severity === 'debug') return;
  // return fnP ? fnP(_severity, content): fn(content);
  return fn(content);
}

/**
 * singleton core
 */
export const APP = {
  log,
};

/**
 * get unix timestamp
 */
export function timestamp() {
  return Math.floor(new Date().getTime() / 1000);
}

/**
 * promise next
 */
export function returnNext(_object?: any) {
  return Parse.Promise.as(_object);
}

/**
 * promise error
 */
export function returnError(_object: any) {
  APP.log(null, 'error', _object);
  return Parse.Promise.error(_object);
}

/**
 * delay using promise (setTimeout didn't support)
 */
export function delay(delayTime: number) {
  // const delayUntil;
  let delayPromise: Parse.Promise<{}> = null;

  const _delay = function() {
    // if (Date.now() >= delayUntil) {
    //   delayPromise.resolve();
    //   return;
    // } else {
    //   process.nextTick(_delay);
    // }
    setTimeout(() => {
      delayPromise.resolve({});
    }, delayTime);
  };

  // delayUntil = Date.now() + delayTime;
  delayPromise = new Parse.Promise();
  _delay();
  return delayPromise;
}

/**
 * check deny push time from user's setting
 */
export function getAvaliablePushTime(
  timezoneOffset: number,
  startHour: number,
  startMinute: number,
  endHour: number,
  endMinute: number,
) {
  const currentTimeZoneOffsetInHours = timezoneOffset / 60;
  const nowTime = new Date();

  // 각 시간을 utc시간으로 변환. 날짜는 같게만듬.
  // 서버시간을 utc로 변환시킴.
  const diffTime = new Date(2015, 4, 10, nowTime.getUTCHours(), nowTime.getUTCMinutes());
  diffTime.setDate(1);
  // 유저의 타임존 설정기준에 맞추어 utc시간으로 변환.
  const banStartTime = new Date(2015, 4, 10, startHour + currentTimeZoneOffsetInHours, startMinute);
  banStartTime.setDate(1);
  const banEndTime = new Date(2015, 4, 10, endHour + currentTimeZoneOffsetInHours, endMinute);
  banEndTime.setDate(1);

  let avaliablePushTime: Date = null;

  if (banStartTime > banEndTime) {
    // 역순이면 정순으로 만들어줌
    banEndTime.setDate(banEndTime.getDate() + 1); // 4.1 14:30 + 1D = 4.2 14:30
  }

  // 오늘거 비교
  if (banStartTime <= diffTime && diffTime <= banEndTime) {
    // 4.2 04:30 ~ 4.2 14:30
    // 방해금지 시간안에 들어감
    avaliablePushTime = banEndTime;
  }

  // 내일거 비교
  diffTime.setDate(diffTime.getDate() + 1); // 4.3 13:00
  if (banStartTime <= diffTime && diffTime <= banEndTime) {
    // 방해금지 시간안에 들어감
    avaliablePushTime = banEndTime;
  }

  return avaliablePushTime;
}

export function getInstallationByObjectId(request: any, response: any) {
  const objectId = request.params.objectId || '';
  let retryCount = 0;

  const qObjectId = new Parse.Query(Parse.Installation);
  qObjectId.equalTo('objectId', objectId);

  const qInstallationId = new Parse.Query(Parse.Installation);
  qInstallationId.equalTo('installationId', objectId);

  const query = Parse.Query.or(qObjectId, qInstallationId);

  function errorFn(error: any) {
    APP.log(request, 'error', 'getInstallationByObjectId error:' + JSON.stringify(error));
    response.success(JSON.stringify(error));
  }

  function _doQuery() {
    query
      .first({
        useMasterKey: true,
      })
      .then(result => {
        if (result) {
          return response.success(result);
        }
        return delay(100).then(() => {
          if (retryCount < 30) {
            retryCount++;
            _doQuery();
          } else {
            errorFn('retryCount over 30');
          }
        });
      }, errorFn);
  }

  _doQuery();
}

/**
 * array elements toggling using randomized dummy user
 * @param {String} className
 * @param {String} objectId
 * @param {String} field
 * @param {String} type : add, remove
 * @param {String} value
 */
// function toggleLikeDummyUser(request, response) {
//   const { params } = request;
//   if (!Object.keys(params).length)
//     return response.error({ code: 102, error: 'Invalid parameter' });

//   const query = new Parse.Query(params.className);

//   const dummyUserQ = new Parse.Query(Parse.User);
//   dummyUserQ.equalTo('isDummyUser', true);

//   Parse.Promise.when([
//     query.get(params.objectId, { useMasterKey: true }),
//     dummyUserQ.find({ useMasterKey: true }),
//   ])
//     .then(results => {
//       const targetM = results[0];
//       const dummyUsers = _.shuffle(results[1]);

//       // target
//       const targetArray = targetM.get(params.field) || [];
//       // convert to list
//       const targetList = {};
//       targetArray.forEach(value => {
//         targetList[value] = value;
//       });

//       let newArray = targetArray;
//       if (params.type === 'add') {
//         const dummyUser = dummyUsers.find(dummy => !targetList[dummy.id]);
//         if (dummyUser) newArray = _.union(targetArray, [dummyUser.id]);
//       } else {
//         const dummyUser = dummyUsers.find(dummy => targetList[dummy.id]);
//         if (dummyUser) newArray = _.without(targetArray, dummyUser.id);
//       }

//       // count
//       const countKey = params.field.replace('UserIds', '') + 'Count';

//       // save
//       return targetM.save(
//         {
//           [params.field]: newArray,
//           [countKey]: newArray.length,
//         },
//         { useMasterKey: true },
//       );
//     })
//     .then(
//       result => {
//         response.success(result);
//       },
//       err => {
//         console.error('toggleArray error / params:', params, err);
//         response.error(err);
//       },
//     );
// }

/**
 * array elements add, remove
 * @param {String} className
 * @param {String} objectId
 * @param {String} field
 * @param {String} type : add, remove
 * @param {String} value
 */
export function toggleArray(request: any, response: any) {
  const { params } = request;
  if (!Object.keys(params).length) {
    return response.error({
      code: 102,
      error: 'Invalid parameter',
    });
  }

  // if (
  //   request.user &&
  //   request.user.get('isAdmin') &&
  //   params.field === 'likeUserIds'
  // ) {
  //   return toggleLikeDummyUser(request, response);
  // }

  const query = new Parse.Query(params.className);
  query
    .get(params.objectId, {
      useMasterKey: true,
    })
    .then(targetM => {
      // target
      const targetArray = targetM.get(params.field);
      const newArray =
        params.type === 'add' ? _.union(targetArray, [params.value]) : _.without(targetArray, params.value);

      // count
      const countKey = params.field.replace('UserIds', '') + 'Count';

      // save
      return targetM.save(
        {
          [params.field]: newArray,
          [countKey]: newArray.length,
        },
        {
          useMasterKey: true,
        },
      );
    })
    .then(
      result => {
        // include
        if (params.include) {
          const queryR = new Parse.Query(params.className);
          queryR.include(params.include);
          return queryR
            .get(params.objectId, {
              useMasterKey: true,
            })
            .then(response.success, response.error);
        }
        response.success(result);
      },
      (err: any) => {
        console.error('toggleArray error / params:', params, err);
        response.error(err);
      },
    );
}

async function _getGeoip(ip: string) {
  const _url = 'http://geoip:8080/json/' + ip;
  try {
    const httpResponse = await Parse.Cloud.httpRequest({
      url: _url,
      method: 'GET',
    });
    const responseData = httpResponse.data || JSON.parse(httpResponse.text);
    return responseData;
  } catch (error) {
    console.error('getGeoip error / ip:', ip, error);
    throw error;
  }
}

export async function getGeoipNoError(ip: string) {
  try {
    return await _getGeoip(ip);
  } catch (error) {
    return {};
  }
}

export async function getGeoip(request: any, response: any) {
  const { params } = request;
  try {
    const ipJson = await _getGeoip(params.ip);
    return response.success(ipJson);
  } catch (error) {
    console.error('getGeoip error / params:', params, error);
    return response.error(error);
  }
}

export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; // The maximum is exclusive and the minimum is inclusive
}

export async function countSave(request: any, response: any) {
  const { params } = request;
  if (!Object.keys(params).length || !params.className || !params.objectId) {
    return response.error({
      code: 102,
      error: 'Invalid parameter',
    });
  }

  try {
    const query = new Parse.Query(params.className);
    const model = await query.get(params.objectId, {
      useMasterKey: true,
    });
    model.increment(params.field || 'viewCount', params.count || getRandomInt(1, 10));
    await model.save(null, {
      useMasterKey: true,
    });
    return response.success();
  } catch (error) {
    console.error('countSave error / params:', params, error);
    return response.error(error);
  }
}

export function aclWriteSecret(object: Parse.Object, user?: string | Parse.User, isBlockAdmin?: boolean) {
  const acl = object.getACL() || new Parse.ACL();

  // public
  acl.setPublicReadAccess(true);
  acl.setPublicWriteAccess(false);
  // user
  if (user) {
    acl.setReadAccess(user as any, true);
    acl.setWriteAccess(user as any, true);
  }
  // admin
  if (isBlockAdmin !== true) acl.setRoleReadAccess('Admins', true);
  if (isBlockAdmin !== true) acl.setRoleWriteAccess('Admins', true);

  object.setACL(acl);

  return object;
}

export function aclReadSecret(object: Parse.Object, user?: string | Parse.User, isBlockAdmin?: boolean) {
  const acl = object.getACL() || new Parse.ACL();

  // public
  acl.setPublicReadAccess(false);
  acl.setPublicWriteAccess(false);
  // user
  if (user) {
    acl.setReadAccess(user as any, true);
    acl.setWriteAccess(user as any, true);
  }
  // admin
  if (isBlockAdmin !== true) acl.setRoleReadAccess('Admins', true);
  if (isBlockAdmin !== true) acl.setRoleWriteAccess('Admins', true);

  object.setACL(acl);

  return object;
}
