// AmazonConnector.js
import { Auth } from "aws-amplify";

import { store } from "../../Utils/Store/Store";
import {customLog} from "../../helperFunctions/customLogger";

class AmazonConnector {
  static async authenticate() {
    try {
      const user = await Auth.currentAuthenticatedUser();
      if (user) {
        if (!user.username.includes("amazon")) {
          // throw the error, as we're logged in with some user, but not the correct one
          throw new Error("not logged in with amazon account");
        }
      }
      // If the user is already authenticated, no need to authenticate again
      return user;
    } catch (error) {
      // User is not authenticated, initiate the authentication flow
      await Auth.federatedSignIn({ provider: "LoginWithAmazon" });
      const user = await Auth.currentAuthenticatedUser();
      return user;
    }
  }

  // Get the current authenticated user's credentials
  static async getCurrentUserCredentials() {
    try {
      const credentials = await Auth.currentCredentials();
      customLog(`User credentials: , ${credentials}`);
      // Access the credentials properties such as accessKeyId, secretAccessKey, sessionToken, etc.
    } catch (error) {
      console.error("Error retrieving user credentials:", error);
    }
  }

  static async getToken() {
    const user = await this.authenticate();
    const session = await Auth.currentSession();
    const accessToken = session.getAccessToken();
    return accessToken.getJwtToken();
  }

  static async getSession() {
    const user = await this.authenticate();
    const session = await Auth.currentSession();
    return session;
  }

  static async disconnect() {
    await Auth.signOut();
  }

  static async authenticateFlowAndTriggerExtension() {
    let aws_auth_token = await AmazonConnector.getToken();
    let session = await AmazonConnector.getSession();
    await AmazonConnector.getCurrentUserCredentials();

    customLog(session);

    const { token, userId } = store.getState().auth;
    customLog(
      `before calling Sync-Books => userId: ${userId} and token: ${token}`
    );

    // Make sure aws_auth_token is not null before proceeding
    if (aws_auth_token) {
    } else {
      console.log("Error retrieving aws_auth_token");
    }
  }
  catch(error) {
    console.log("Error signing in with Amazon:", error);
  }
}

export default AmazonConnector;
