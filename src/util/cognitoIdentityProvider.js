import CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider'
const client = new CognitoIdentityServiceProvider()
module.exports = client