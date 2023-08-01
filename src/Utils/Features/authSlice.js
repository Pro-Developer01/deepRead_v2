import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { reset } from "../../Utils/Features/librarySlice";

const apiUrl = process.env.REACT_APP_API_URL;
const apiRoot = apiUrl + "/api";

export const login = createAsyncThunk(
  "auth/login",
  async ({ dispatch, body }, thunkAPI) => {
    dispatch(reset(thunkAPI.getState()));
    let result;
    if (body) {
      result = await axios.post(`${apiRoot}/auth/login`, body);
    } else {
      result = await axios.post(`${apiRoot}/auth/demo-account`, null, {
        headers: {
          authorization: thunkAPI.getState().auth.token,
        },
      });
    }
    if (result.status === 200) {
      const token = result.data.authorization;
      const userId = result.data.user_id;
      return { userId, token };
    }
  }
);

export const refresh = createAsyncThunk("auth/refresh", async (email) => {
  const result = await axios.post(`${apiRoot}/auth/refresh`, { email: email });
  if (result.status === 200) {
    const token = result.data.authorization;
    return token;
  }
});

export const authSlice = createSlice({
  name: "authSlice",
  initialState: {
    userId: null,
    token: null,
    isAuthenticated: false,
    authenticatedTime: null,
    isPending: false,
    isSuccess: false,
    isError: false,
    message: null,
  },
  reducers: {
    logout: (state, action) => {
      state.userId = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isPending = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isPending = true;
        state.isAuthenticated = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isPending = false;
        state.isError = false;
        state.isSuccess = true;
        state.isAuthenticated = true;
        state.authenticatedTime = new Date().getTime();

        state.userId = action.payload.userId;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isPending = false;
        state.isError = true;
        state.isSuccess = false;
        state.isAuthenticated = false;
        state.message = "Login failed to finish.";

        state.userId = null;
        state.token = null;
      })
      .addCase(refresh.pending, (state) => {
        state.isPending = true;
        state.isAuthenticated = false;
      })
      .addCase(refresh.fulfilled, (state, action) => {
        state.isPending = false;
        state.isError = false;
        state.isSuccess = true;
        state.isAuthenticated = true;
        state.authenticatedTime = new Date().getTime();

        state.token = action.payload;
      })
      .addCase(refresh.rejected, (state, action) => {
        state.isPending = false;
        state.isError = true;
        state.isSuccess = false;
        state.isAuthenticated = false;
        state.message = "Authentication refresh failed.";

        state.userId = null;
        state.token = null;
      });
  },
});

// Action creators are generated for each case reducer function
export const { logout } = authSlice.actions;

export default authSlice.reducer;
