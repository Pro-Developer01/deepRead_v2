import { configureStore } from "@reduxjs/toolkit";
import breadcumReducer from "../Features/breadcumSlice";
import levelCounterReducer from "../Features/levelCounterSlice";
import persistentDrawerReducer from "../Features/persistentDrawerSlice";
import IdentifyIdeaCardReducer from "../Features/IdentifyIdeaCardSlice";
import libraryReducer from "../Features/librarySlice";
import authReducer from "../Features/authSlice";
import amazonSyncSlice from "../Features/amazonSyncSlice";

import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

export const libraryPersistConfig = {
  key: "lib",
  storage,
};
export const authPersistConfig = {
  key: "auth",
  storage,
};
export const amazonSyncPersistConfig = {
  key: "amazon",
  storage,
};

const persistedLibraryReducer = persistReducer(
  libraryPersistConfig,
  libraryReducer
);
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedAmazonReducer = persistReducer(
  amazonSyncPersistConfig,
  amazonSyncSlice
);

export const store = configureStore({
  reducer: {
    breadcumReducer,
    levelCounterReducer,
    persistentDrawerReducer,
    IdentifyIdeaCardReducer,
    library: persistedLibraryReducer,
    auth: persistedAuthReducer,
    amazonSync: persistedAmazonReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
