import "./App.css";
// import "./Global.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Route, Routes } from "react-router-dom";
import { hot } from "react-hot-loader/root";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import DashBoard from "./pages/DashBoard/DashBoard";

import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Amplify, Auth, Hub } from "aws-amplify";
import awsconfig from "./aws-exports";

import MyLibrary from "./pages/MyLibrary/MyLibrary";
import Sidebar_v2 from "./components/Sidebar/Sidebar_v2";

import { login, logout, refresh } from "./Utils/Features/authSlice";
import { Loading } from "./components/Loading";
import { isTokenFresh } from "./helperFunctions/timing";
import { customLog } from "./helperFunctions/customLogger";

// configure amplify for multiple redirects
let env = process.env.REACT_APP_NODE_ENV;
if (env) {
  env = env.toLowerCase();
  if (env !== "prod" && env !== "dev" && env !== "staging") {
    throw new Error(`Invalid value for REACT_APP_NODE_ENV: ${env}`);
  }
} else {
  throw new Error("REACT_APP_NODE_ENV variable is not set!");
}

let [localRedirectSignIn, stagingRedirectSignIn, prodRedirectSignIn] =
  awsconfig.oauth.redirectSignIn.split(",");
let [localRedirectSignOut, stagingRedirectSignOut, prodRedirectSignOut] =
  awsconfig.oauth.redirectSignOut.split(",");
customLog(
  `Redirection links: local: ${localRedirectSignIn}, staging: ${stagingRedirectSignIn}, prod: ${prodRedirectSignIn}`
);

const updatedAwsConfig = {
  ...awsconfig,
  oauth: {
    ...awsconfig.oauth,
    redirectSignIn:
      env === "prod"
        ? prodRedirectSignIn
        : env === "staging"
        ? stagingRedirectSignIn
        : localRedirectSignIn,
    redirectSignOut:
      env === "prod"
        ? prodRedirectSignOut
        : env === "staging"
        ? stagingRedirectSignOut
        : localRedirectSignOut,
  },
};

Amplify.configure(updatedAwsConfig);

const theme = createTheme({
  typography: {
    fontFamily: ["Lato", "sans-serif"].join(","),
    fontColor: "var(--fontColor)",
  },
  color: "var(--fontColor)",
});

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    isAuthenticated,
    authenticatedTime,
    isPending,
    isSuccess,
    isError,
    message,
  } = useSelector((state) => state.auth);

  const [user, setUser] = useState(null);
  const [customState, setCustomState] = useState(null);

  useEffect(() => {
    const unsubscribe = Hub.listen("auth", ({ payload: { event, data } }) => {
      // eslint-disable-next-line default-case
      switch (event) {
        case "signIn" || "signUp":
          setUser(data);
          break;
        case "signOut":
          setUser(null);
          break;
        case "customOAuthState":
          setCustomState(data);
      }
    });

    Auth.currentAuthenticatedUser()
      .then((currentUser) => {
        setUser(currentUser);
        if (!isAuthenticated) {
          Auth.currentUserInfo().then((currUserInfo) => {
            customLog("Real User Creation Procedure invoked");
            const body = {
              name: currUserInfo.username,
              customer_id: currUserInfo.username,
              email: currUserInfo.attributes.email,
            };

            dispatch(login({ dispatch, body }));
            navigate("/library");
          });
        } else if (!isTokenFresh(authenticatedTime)) {
          Auth.currentUserInfo().then((currUserInfo) => {
            customLog("Token Refresh Procedure invoked");
            dispatch(refresh(currUserInfo.attributes.email));
          });
        }
      })
      .catch(() => customLog("Not signed in"));

    // for the event handling of the amplify login
    return unsubscribe;
  }, []);

  if (isPending) {
    return <Loading />;
  } else if (isError) {
    return (
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "20%",
        }}
      >
        {message} Please log out and try again.
        <div style={{ padding: "20px" }}>
          <div
            style={{
              position: "absolute",
              left: "30%",
              padding: "5px 10px 5px 10px",
              border: "2px solid",
              borderRadius: "10px",
            }}
          >
            <button
              onClick={() => {
                dispatch(logout());
                Auth.signOut();
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  } else if (isSuccess) {
    return (
      <>
        <ThemeProvider theme={theme}>
          <div className="rootContainer">
            <Sidebar_v2 />
            <Routes>
              <Route path="/*" element={<DashBoard />} />
              <Route path="/library" element={<MyLibrary />} />
              <Route path="*" element={<> not found</>} />
            </Routes>
          </div>

          {/* <NewIdeaButton /> */}
        </ThemeProvider>
        <ToastContainer />
      </>
    );
  } else {
    return <></>;
  }
}

// to differntiate when to use hot reload and when to exclude it
let WrappedApp;
if (env === "dev") {
  WrappedApp = withAuthenticator(hot(App));
} else {
  WrappedApp = withAuthenticator(hot(App));
}
export default WrappedApp;
