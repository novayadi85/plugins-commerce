import Logger from "@reactioncommerce/logger";
import cognitoAuthToken from "./cognitoAuthToken.js";
import cognitoidentityserviceprovider from './cognitoIdentityProvider.js'

/**
 * Given an Authorization Bearer token and the current context, returns the user document
 * for that token after performing token checks.
 *
 * If the provided token is not associated with any user or is associated but is
 * expired, this function throws an "access-denied" ReactionError.
 *
 * @name getUserFromAuthToken
 * @method
 * @memberof GraphQL
 * @summary Looks up a user by token
 * @param {String} loginToken Auth token
 * @param {Object} context An object with request-specific state
 * @returns {Object} The user associated with the token
 */

async function getUserFromAuthToken(loginToken, context) {
  const token = loginToken.replace(/bearer\s/gi, "");

  const tokenObj = await cognitoAuthToken(token);
  if (!tokenObj) {
    Logger.debug("No token object");
    throw new Error("No token object");
  }

  const { ok:active, sub: _id, token_use: tokenType } = tokenObj;

  if (!active) {
    Logger.debug("Bearer token is expired");
    throw new Error("Bearer token is expired");
  }

  if (tokenType !== "access") {
    Logger.error("Bearer token is not an access token");
    throw new Error("Bearer token is not an access token");
  }

  // const currentUser = await context.collections.users.findOne({ _id });

  const params = {
    AccessToken: token
  };
  const currentUser = cognitoidentityserviceprovider.getUser(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else console.log(data);           // successful response
  });

  if (!currentUser) {
    Logger.error("Bearer token specifies a user ID that does not exist");
    throw new Error("Bearer token specifies a user ID that does not exist");
  }

  return currentUser;
}

export default getUserFromAuthToken;
