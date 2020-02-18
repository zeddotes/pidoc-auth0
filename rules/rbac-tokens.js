function (user, context, callback) {
  const stripe = require('stripe@7.4.0')('sk_test_sfP5BelBEPXhPOzVh2n02w3V');
  const namespace = 'https://pidoc';
  const assignedRoles = (user.authorization || {}).r;
  const assignedPermissions = (user.authorization || {}).p;
  const assignedGroups = (user.authorization || {}).t;

  const ROLES = 'r';
  const PERMISSIONS = 'p'
  const TEAMS = 't'
  const SPACE = 's'

  const xx = 'CC'

  function safeJSONParseArray(str = '[]') {
    try {
      return JSON.parse(str)
    } catch (e) {
      return []
    }
  }

  let idTokenClaims = context.idToken || {};
  let accessTokenClaims = context.accessToken || {};

  idTokenClaims[`${namespace}/${ROLES}`] = assignedRoles;
  accessTokenClaims[`${namespace}/${ROLES}`] = assignedRoles;

  idTokenClaims[`${namespace}/${PERMISSIONS}`] = assignedPermissions;
  accessTokenClaims[`${namespace}/${PERMISSIONS}`] = assignedPermissions;

  if (assignedPermissions && assignedPermissions.length && assignedPermissions.indexOf('ta') > -1) {
      idTokenClaims[`${namespace}/${TEAMS}`] = safeJSONParseArray(context.connectionMetadata.teams);
		  accessTokenClaims[`${namespace}/${TEAMS}`] = safeJSONParseArray(context.connectionMetadata.teams);
  } else {
      idTokenClaims[`${namespace}/${TEAMS}`] = assignedGroups;
		  accessTokenClaims[`${namespace}/${TEAMS}`] = assignedGroups;
  }

//  idTokenClaims[`${namespace}/${SPACE}`] = user.space || "";
//  accessTokenClaims[`${namespace}/${SPACE}`] = user.space || "";
//
  idTokenClaims[`${namespace}/${SPACE}`] = context.connectionID;
  accessTokenClaims[`${namespace}/${SPACE}`] = context.connectionID;


  context.idToken = idTokenClaims;
  context.accessToken = accessTokenClaims;

  if (assignedPermissions && assignedPermissions.length) {
    stripe
      .subscriptions
      .retrieve(context.connectionMetadata.subscription)
      .then(function (subscription) {
        console.log(subscription)
        if (subscription && subscription.plan && subscription.plan.metadata) {
          const planData = subscription.plan.metadata
          context.accessToken[`${namespace}/${PERMISSIONS}`] = context.idToken[`${namespace}/${PERMISSIONS}`] = assignedPermissions.map((perm) => {
            if (planData.hasOwnProperty(perm)) {
              return `${perm}:${planData[perm]}`
            }
            return perm
          })
        }
        return callback(null, user, context);
      })
      .catch(function (e) {
        console.log(e)
        return callback(null, user, context);
      })
  } else {
    callback(null, user, context);
  }
}
