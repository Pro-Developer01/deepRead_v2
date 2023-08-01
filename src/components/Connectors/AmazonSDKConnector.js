import React, { Component } from "react";
import amazon from "aws-sdk";
import { customLog } from "../../helperFunctions/customLogger";

const apiRoot = process.env.REACT_APP_API_URL;

class AmazonLogin extends Component {
  async componentDidMount() {
    try {
      document.getElementById("LoginWithAmazon").onclick = async function () {
        //window.onAmazonLoginReady = async () => {
        //console.log('Amazon Login SDK is ready');
        //amazon.Login.setClientId('amzn1.application-oa2-client.03e7da7567b04215bcdb5788be49fd89');

        const options = {
          scope: "profile",
          pkce: true,
          scope_data: { profile: { essential: false } },
          response_type: "code",
        };

        amazon.Login.authorize(options, async (response) => {
          if (response.error) {
            alert("OAuth error " + response.error);
            return;
          }

          alert("Success authorizing: " + response.code);
          const tokenResponse = await amazon.Login.retrieveToken(response.code);
          if (tokenResponse.error) {
            alert("Retrieving token error " + tokenResponse.error);
            return;
          }

          const aws_auth_token = tokenResponse.access_token;
          alert("Success retrieving token: " + tokenResponse.access_token);
          const profileResponse = await amazon.Login.retrieveProfile(
            tokenResponse.access_token
          );
          const profile = profileResponse;
          alert("Profile of user: " + profile);
          const { Name, PrimaryEmail, CustomerId } = profile;

          const userId = localStorage.getItem("userId");
          const token = localStorage.getItem("token");
          customLog(
            `Before calling Sync-Books => userId: ${userId} and token: ${token}`
          );

          // Also, now we sync the library by calling the sync endpoint
          try {
            const res = await fetch(`${apiRoot}/api/auth/sync-books`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                authorization: token,
              },
              body: JSON.stringify({
                user_id: userId,
                cookie: aws_auth_token,
              }),
            });

            const response = await res.json();
            console.log(response);
          } catch (error) {
            console.log("Error syncing books:", error);
          }
        });
      };
    } catch (error) {
      console.log("Error signing in with Amazon:", error);
    }
  }

  render() {
    return <div>{/* Your component JSX goes here */}</div>;
  }
}

export default AmazonLogin;
