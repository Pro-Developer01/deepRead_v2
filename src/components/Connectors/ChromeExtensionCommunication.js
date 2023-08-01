// ChromeExtensionConnector.js
import axios from "axios";
import AmazonConnector from "../Connectors/AmazonConnector";

import { toast } from "react-toastify";
import { store } from "../../Utils/Store/Store";
import {
  fetchLibrary,
  fetchBook,
  resetViewData,
} from "../../Utils/Features/librarySlice";
import {
  startSync,
  finishSync,
  failSync,
  enableSync,
} from "../../Utils/Features/amazonSyncSlice";

import { customLog } from "../../helperFunctions/customLogger";

var extensionId = process.env.REACT_APP_CHROME_EXTENSION_ID;
const apiUrl = process.env.REACT_APP_API_URL;
const apiRoot = apiUrl + "/api";

/* global chrome */
class ChromeExtensionConnector {
  static async SyncAmazonBooks(token, userId) {
    try {
      await AmazonConnector.authenticateFlowAndTriggerExtension();

      customLog("SyncAmzonBooks: Before sending the signal to our extension.");

      chrome.runtime.sendMessage(
        extensionId,
        {
          event: "SyncAmazonBooks",
          deepread_token: token,
          deepread_user: userId,
        },
        (response) => {
          customLog(`${response}`);
          this.postSyncBooks(response.cookies, userId, token);
        }
      );

      this.showToastInfo(
        "Library Sync has started, please wait a little while and you will be notified when your synced books are available in the library."
      );

      store.dispatch(startSync());
    } catch (error) {
      console.log("SyncAmazonBooks: error: ", error);

      this.showToastError(
        "Library Sync failed, check the DeepRead extension on your browser and/or try again later!"
      );
    } finally {
      // this.removeExtensionMessageListener(messageListener);
    }
  }

  static showToastSuccess(message) {
    toast.success(message, {
      position: toast.POSITION.BOTTOM_LEFT,
    });
  }
  static showToastInfo(message) {
    toast.info(message, {
      position: toast.POSITION.BOTTOM_LEFT,
    });
  }
  static showToastError(message) {
    toast.error(message, {
      position: toast.POSITION.BOTTOM_LEFT,
    });
  }

  static async postSyncBooks(cookies, userId, token) {
    if (cookies !== null && cookies !== undefined) {
      axios
        .post(
          `${apiRoot}/auth/sync-books`,
          {
            user_id: userId,
            cookies: cookies,
          },
          {
            headers: {
              "Content-Type": "application/json",
              authorization: token,
            },
          }
        )
        .then(async (res) => {
          const response = res.data;
          customLog(`Response from backend Sync-Books: ${response}`);
          if (response.status === 200) {
            this.showToastSuccess(
              "Amazon book sync is ready and you can see your books now in the library. " +
                response.message
            );
            store.dispatch(finishSync());
            store.dispatch(fetchLibrary());
            store.dispatch(enableSync());
          }
        })
        .catch((error) => {
          console.error("Error-SyncAmazonBooks on post to the backend:", error);
          this.showToastError("Library Sync failed, please try again later.!");
          store.dispatch(failSync());
        });
    } else {
      console.error(
        "Error-SyncAmazonBooks, no cookies found with the extension, or extension not setup in browser."
      );
      this.showToastError(
        "Library Sync failed, check the DeepRead extension on your browser and/or try again later."
      );

      store.dispatch(failSync());
    }
  }

  static async SyncAmazonFullHighlights(token, userId, bookId) {
    try {
      await AmazonConnector.authenticateFlowAndTriggerExtension();

      customLog(
        `MYLIBRARY: Before sending the signal to our extension. user_id: ${userId}, book_id: ${bookId}`
      );

      chrome.runtime.sendMessage(
        extensionId,
        {
          event: "SyncAmazonHighlights",
          deepread_token: token,
          deepread_user: userId,
          deepread_book_id: bookId,
        },
        (response) => {
          customLog(response);
          this.postSyncFullHighlights(response.cookies, userId, bookId, token);
        }
      );

      this.showToastInfo(
        "Full Highlights Sync has started, please wait a little while and you will be notified when your full highlights are available."
      );
    } catch (error) {
      console.log("Error authenticating: ", error);
      this.showToastError(
        "Full Highlights Sync failed, please try again later."
      );
    } finally {
      // this.removeExtensionMessageListener(messageListener);
    }
  }

  static async postSyncFullHighlights(cookies, userId, bookId, token) {
    if (cookies !== null && cookies !== undefined) {
      axios
        .post(
          `${apiRoot}/auth/sync-fullhighlights`,
          {
            user_id: userId,
            book_id: bookId,
            cookies: cookies,
          },
          {
            headers: {
              "Content-Type": "application/json",
              authorization: token,
            },
          }
        )
        .then(async (res) => {
          const response = res.data;
          customLog(`Response from backend Sync-FullHighlights: ${response}`);
          if (response.status === 200) {
            this.showToastSuccess(
              "Full Highlights sync is ready and you can see your highlights now: " +
                response.message
            );
            store.dispatch(resetViewData());
          }
        })
        .catch((error) => {
          console.error(
            "Error-SyncAmazonFullHighlights on post to the backend:",
            error
          );
          this.showToastError(
            "Full Highlights Sync failed, please try again later."
          );
          // alert that the sync has gone wrong
        });
    } else {
      console.error(
        "Error-SyncAmazonFullHighlights, no cookies found with the extension, or extension not setup in browser."
      );
      this.showToastError(
        "Full Highlights Sync failed, please try again later."
      );
    }
  }

  static async SyncAmazonSingleBook(token, userId, bookId) {
    try {
      await AmazonConnector.authenticateFlowAndTriggerExtension();

      customLog(
        "SyncAmazonSingleBook: Before sending the signal to our extension."
      );

      chrome.runtime.sendMessage(
        extensionId,
        {
          event: "SyncAmazonSingleBook",
          deepread_token: token,
          deepread_user: userId,
        },
        (response) => {
          customLog(`${response}`);
          this.postSyncSingleBook(response.cookies, userId, bookId, token);
        }
      );

      this.showToastInfo(
        "Single Book Sync has started, please wait a little while and you will be notified when your synced book is available in the library."
      );

      store.dispatch(startSync({ singleBook: true }));
    } catch (error) {
      console.log("SyncAmazonSingleBook: error: ", error);

      this.showToastError(
        "Single Book Sync failed, check the DeepRead extension on your browser and/or try again later!"
      );
    }
  }

  static async postSyncSingleBook(cookies, userId, bookId, token) {
    if (cookies !== null && cookies !== undefined) {
      axios
        .post(
          `${apiRoot}/auth/sync-book`,
          {
            book_id: bookId,
            user_id: userId,
            cookies: cookies,
          },
          {
            headers: {
              "Content-Type": "application/json",
              authorization: token,
            },
          }
        )
        .then(async (res) => {
          const response = res.data;
          customLog(`Response from backend sync-book: ${response}`);
          if (response.status === 200) {
            ChromeExtensionConnector.showToastSuccess(response.message);
            store.dispatch(finishSync({ singleBook: true }));
            store.dispatch(enableSync());
            store.dispatch(fetchBook(bookId));
            this.postSyncFullHighlights(cookies, userId, bookId, token);
            this.showToastInfo(
              "Full Highlights Sync has started, please wait a little while and you will be notified when your full highlights are available."
            );
          }
        })
        .catch((error) => {
          console.error(
            "Error-SyncAmazonSingleBook on post to the backend:",
            error
          );
          this.showToastError(
            "Single Book Sync failed, please try again later.!"
          );
          store.dispatch(failSync());
        });
    } else {
      console.error(
        "Error-SyncAmazonSingleBook, no cookies found with the extension, or extension not setup in browser."
      );
      this.showToastError(
        "Single Book Sync failed, check the DeepRead extension on your browser and/or try again later."
      );

      store.dispatch(failSync());
    }
  }
}

export default ChromeExtensionConnector;
