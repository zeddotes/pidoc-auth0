function (user, context, callback) {
	console.log("RBAC TOKENNNN TYME", user, user.authorization)
  const namespace = 'https://pidoc';
  // const assignedRoles = user.roles || [];
  // const assignedPermissions = user.permissions || [];
  // const assignedGroups = user.groups || [];

  // const ROLES = 'r';
  // const PERMISSIONS = 'p'
  // const TEAMS = 't'
  const SPACE = 's'

  // function safeJSONParseArray(str = '[]') {
  //   try {
  //     return JSON.parse(str)
  //   } catch (e) {
  //     return []
  //   }
  // }

  let idTokenClaims = context.idToken || {};
  let accessTokenClaims = context.accessToken || {};

  // idTokenClaims[`${namespace}/${ROLES}`] = assignedRoles;
  // accessTokenClaims[`${namespace}/${ROLES}`] = assignedRoles;

  // idTokenClaims[`${namespace}/${PERMISSIONS}`] = assignedPermissions;
  // accessTokenClaims[`${namespace}/${PERMISSIONS}`] = assignedPermissions;

  // if (assignedPermissions && assignedPermissions.length && assignedPermissions.indexOf('ta') > -1) {
  //     idTokenClaims[`${namespace}/${TEAMS}`] = safeJSONParseArray(context.connectionMetadata.teams);
	// 	  accessTokenClaims[`${namespace}/${TEAMS}`] = safeJSONParseArray(context.connectionMetadata.teams);
  // } else {
  //     idTokenClaims[`${namespace}/${TEAMS}`] = assignedGroups;
	// 	  accessTokenClaims[`${namespace}/${TEAMS}`] = assignedGroups;
  // }

//  idTokenClaims[`${namespace}/${SPACE}`] = user.space || "";
//  accessTokenClaims[`${namespace}/${SPACE}`] = user.space || "";
//
  idTokenClaims[`${namespace}/${SPACE}`] = context.connectionMetadata.space;
	accessTokenClaims[`${namespace}/${SPACE}`] = context.connectionMetadata.space;

	// if (idTokenClaims.permissions) delete idTokenClaims.permissions
	// if (accessTokenClaims.permissions) delete accessTokenClaims.permissions

  context.idToken = idTokenClaims;
	context.accessToken = accessTokenClaims;

	// console.log("SSSSSSLDDDDDDDPerm", assignedPermissions)
	// console.log("SSSSSSLDDDDDDDRoles", assignedRoles)
	// console.log("SSSSSSLDDDDDDDTeams?", assignedGroups)

	return callback(null, user, context);

  // if (assignedPermissions && assignedPermissions.length) {
  //   stripe
  //     .subscriptions
  //     .retrieve(context.connectionMetadata.subscription)
  //     .then(function (subscription) {
  //       console.log(subscription)
  //       if (subscription && subscription.plan && subscription.plan.metadata) {
  //         const planData = subscription.plan.metadata
  //         context.accessToken[`${namespace}/${PERMISSIONS}`] = context.idToken[`${namespace}/${PERMISSIONS}`] = assignedPermissions.map((perm) => {
  //           if (planData.hasOwnProperty(perm)) {
  //             return `${perm}:${planData[perm]}`
  //           }
  //           return perm
  //         })
  //       }
  //       return callback(null, user, context);
  //     })
  //     .catch(function (e) {
  //       console.log(e)
  //       return callback(null, user, context);
  //     })
  // } else {
  //   callback(null, user, context);
  // }
}
