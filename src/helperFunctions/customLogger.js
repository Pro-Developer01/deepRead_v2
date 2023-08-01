// customLogger.js

/**
 * Custom logger function that logs the message and name-value pairs of the arguments.
 * This function only logs when the environment variable REACT_APP_NODE_ENV is set to 'DEV'.
 * Usage: customLog(message)
 * - message: The main message to log, in the form `What needs to be logge name:${arg1}, userId:${arg2} ...`.
 *
 * @param {string} message - The main message to log.
 */
export function customLog(message) {
    let environment = process.env.REACT_APP_NODE_ENV;
    if (environment.toUpperCase() === 'DEV') {
      console.log(message);
    }
  }
  