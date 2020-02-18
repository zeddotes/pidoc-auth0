function (user, context, callback) {
  user.user_metadata = user.user_metadata || {};
  // update the user_metadata that will be part of the response
  const namespace = 'https://pidoc';

  const currentTeam = user.user_metadata.team;
  const userTeams = context.accessToken[`${namespace}/t`]

  if (!userTeams || !userTeams.length) {
    user.user_metadata.team = null
  } else if (!currentTeam || userTeams.indexOf(currentTeam) === -1) {
    user.user_metadata.team = userTeams[0]
	}

	context.accessToken[`${namespace}/v`]
	context.idToken[`${namespace}/v`]

  // persist the user_metadata update
  auth0.users.updateUserMetadata(user.user_id, user.user_metadata)
    .then(function(){
      callback(null, user, context);
    })
    .catch(function(err){
      callback(err);
    });
}
