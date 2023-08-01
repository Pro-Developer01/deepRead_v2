import { createSlice } from "@reduxjs/toolkit";

import {
  amazonBookSyncIntervalMinutes,
  hasIntervalPassed,
  getMinutesInMilliseconds,
  formatDateString,
  formatTimeString,
} from "../../helperFunctions/timing";

const SYNC_RUNNING_MESSAGE =
  "Book sync is running on the background. Please Wait.";
const SYNC_SINGLE_LASTSYNC_MESSAGE = "Book was last synced at #TIME#";

export const amazonSyncSlice = createSlice({
  name: "amazonSyncSlice",
  initialState: {
    bookSyncInitiated: null,
    bookSyncFinished: null,
    amazonSyncDisabled: null,
    bookSyncMessage: null,
    singleBookSyncMessage: null,
  },
  reducers: {
    resetSyncStatus: (state) => {
      state.amazonSyncDisabled = null;
      state.bookSyncMessage = getFinishedEnabledMessage(state.bookSyncFinished);
      state.singleBookSyncMessage = SYNC_SINGLE_LASTSYNC_MESSAGE;
    },
    startSync: (state, action) => {
      state.amazonSyncDisabled = true;
      if (!action?.payload?.singleBook) {
        state.bookSyncInitiated = new Date().getTime();
      }
      state.bookSyncMessage = SYNC_RUNNING_MESSAGE;
      state.singleBookSyncMessage = SYNC_RUNNING_MESSAGE;
    },
    finishSync: (state, action) => {
      if (!action?.payload?.singleBook) {
        state.bookSyncFinished = new Date().getTime();
      }
      state.bookSyncMessage = getFinishedDisabledMessage(
        state.bookSyncInitiated,
        state.bookSyncFinished
      );
      state.singleBookSyncMessage = SYNC_SINGLE_LASTSYNC_MESSAGE;
    },
    failSync: (state) => {
      state.amazonSyncDisabled = false;
      state.bookSyncInitiated = null;
      state.bookSyncMessage = getFinishedEnabledMessage(state.bookSyncFinished);
      state.singleBookSyncMessage = SYNC_SINGLE_LASTSYNC_MESSAGE;
    },
    enableSync: (state) => {
      state.amazonSyncDisabled = false;
      state.bookSyncMessage = getFinishedEnabledMessage(state.bookSyncFinished);
      state.singleBookSyncMessage = SYNC_SINGLE_LASTSYNC_MESSAGE;
    },
  },
});

// Action creators are generated for each case reducer function
export const { resetSyncStatus, startSync, finishSync, failSync, enableSync } =
  amazonSyncSlice.actions;

export default amazonSyncSlice.reducer;

const getFinishedDisabledMessage = (lastSyncInit, lastSyncFinished) => {
  const lastSyncInitDate = lastSyncInit ? new Date(lastSyncInit) : null;
  const nextSyncDate = lastSyncInit
    ? new Date(
        lastSyncInit + getMinutesInMilliseconds(amazonBookSyncIntervalMinutes)
      )
    : null;

  return (
    "Your previous book sync was at " +
    formatTimeString(lastSyncInitDate) +
    ". Next time sync will be available at " +
    formatTimeString(nextSyncDate)
  );
};
const getFinishedEnabledMessage = (lastSyncFinished) => {
  const lastSyncFinishDate = lastSyncFinished
    ? new Date(lastSyncFinished)
    : null;
  return (
    "Your previous book sync was at " + formatDateString(lastSyncFinishDate)
  );
};
