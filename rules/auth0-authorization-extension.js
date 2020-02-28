function (user, context, callback) {
  var _ = require('lodash');
  var EXTENSION_URL = "https://dev-5n5e1fnc.eu8.webtask.io/adf6e2f2b84784b57522e3b19dfc9201";
console.log("Vrevertttttttedd")
console.log(user)
  var audience = '';
  audience = audience || (context.request && context.request.query && context.request.query.audience);
  if (audience === 'urn:auth0-authz-api') {
    return callback(new UnauthorizedError('no_end_users'));
  }

  audience = audience || (context.request && context.request.body && context.request.body.audience);
  if (audience === 'urn:auth0-authz-api') {
    return callback(new UnauthorizedError('no_end_users'));
  }

  getPolicy(user, context, function (err, res, data) {
    if (err) {
      console.log('Error from Authorization Extension:', err);
      return callback(new UnauthorizedError('Authorization Extension: ' + err.message));
    }

    if (res.statusCode !== 200) {
      console.log('Error from Authorization Extension:', res.body || res.statusCode);
      return callback(
        new UnauthorizedError('Authorization Extension: ' + ((res.body && (res.body.message || res.body) || res.statusCode)))
      );
		}

		console.log("GOT POLICY", data)

		console.log("BEFORE USER", user)

    // Update the user object.
    user.groups = mergeRecords(user.groups, data.groups);
    user.roles = mergeRecords(user.roles, data.roles);
		user.permissions = mergeRecords(user.permissions, data.permissions);

		console.log("NOW USER", user)


    // Store this in the user profile (app_metadata).
    saveToMetadata(user, data.groups, data.roles, data.permissions, function (err) {
			console.log("EXIT CONTEXt", context)
			return callback(err, user, context);
    });
  });

  // Convert groups to array
  function parseGroups(data) {
    if (typeof data === 'string') {
      // split groups represented as string by spaces and/or comma
      return data.replace(/,/g, ' ').replace(/\s+/g, ' ').split(' ');
    }
    return data;
  }

  // Get the policy for the user.
  function getPolicy(user, context, cb) {
    console.log("DSASADS<ALLLLLLLLLLLLLLLLLLLLLLLLLLLL")
    console.log(context.clientID)
    console.log(configuration.PIDOC_FE_CLIENT_ID)
    request.post({
      // this should be configured to a frontend app (pidoc-fe)
      url: EXTENSION_URL + "/api/users/" + user.user_id + "/policy/" + configuration.PIDOC_FE_CLIENT_ID,
      headers: {
        "x-api-key": configuration.AUTHZ_EXT_API_KEY
      },
      json: {
        connectionName: context.connection || user.identities[0].connection,
        groups: parseGroups(user.groups)
      },
      timeout: 5000
    }, cb);
  }

  // Store authorization data in the user profile so we can query it later.
  function saveToMetadata(user, groups, roles, permissions, cb) {
		console.log("SAVING META", "MERGING", user.app_metadata, groups, roles, permissions)
    user.app_metadata = user.app_metadata || {};
    user.app_metadata.authorization = {
      t: mergeRecords(user.groups, groups),
      r: mergeRecords(user.roles, roles),
      p: mergeRecords(user.permissions, permissions)
    };

		console.log("MERGED", user.app_metadata)
		// user.app_metadata.space = context.connectionId;
		user.app_metadata.space = context.connectionMetadata.space

    auth0.users.updateAppMetadata(user.user_id, user.app_metadata)
      .then(function () {
        cb();
      })
      .catch(function (err) {
        cb(err);
      });
  }

  // Merge the IdP records with the records of the extension.
  function mergeRecords(idpRecords, extensionRecords) {
    idpRecords = idpRecords || [];
    extensionRecords = extensionRecords || [];

    if (!Array.isArray(idpRecords)) {
      idpRecords = idpRecords.replace(/,/g, ' ').replace(/\s+/g, ' ').split(' ');
    }

    return _.uniq(_.union(idpRecords, extensionRecords));
  }
}
