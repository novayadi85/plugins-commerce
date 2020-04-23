import fetch from "node-fetch";
import config from "../config.js";
const { claimsJWT } = require("./decode-verify-jwt.js");
const { HYDRA_OAUTH2_INTROSPECT_URL } = config;

/**
 * Given an Authorization Bearer token it returns a JSON object with user
 * properties and claims found
 *
 * @name cognitoAuthToken
 * @method
 * @summary Expands an Auth token
 * @param {String} token Auth token
 * @returns {Object} JSON object
 */
export default async function cognitoAuthToken(token) {
  console.log('==TOKEN==')
  console.log(token)
  const response = await fetch(HYDRA_OAUTH2_INTROSPECT_URL, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    method: "POST",
    body: `token=${encodeURIComponent(token)}`
  });

  if (!response.ok) throw new Error("Error introspecting token");

  return response.json();
}
