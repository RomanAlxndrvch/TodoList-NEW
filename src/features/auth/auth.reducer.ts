import { createSlice } from "@reduxjs/toolkit";
import { appActions } from "app/app.reducer";
import { authAPI, LoginParamsType } from "features/auth/auth.api";
import { clearTasksAndTodolists } from "common/actions";
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError, thunkTryCatch } from "common/utils";
import { todolistsApi } from "features/TodolistsList/todolists.api";
import { ResultCode } from "common/enums/index";

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    // setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
    //   state.isLoggedIn = action.payload.isLoggedIn;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authThunk.login.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(authThunk.logout.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(authThunk.initializeApp.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      });
  },
});

// thunks

const login = createAppAsyncThunk<
  {
    isLoggedIn: boolean;
  },
  LoginParamsType
>(`${slice.name}/login`, async (data, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    const res = await authAPI.login(data);
    if (res.data.resultCode === 0) {
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { isLoggedIn: true };
    } else {
      const isShowError = !res.data.fieldsErrors.length;
      handleServerAppError(res.data, dispatch, isShowError);
      return rejectWithValue(res.data);
    }
  } catch (err) {
    handleServerNetworkError(err, dispatch);
    return rejectWithValue(null);
  }
});

const logout = createAppAsyncThunk<
  {
    isLoggedIn: boolean;
  },
  undefined
>(`${slice.name}/logout`, async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    const res = await authAPI.logout();
    if (res.data.resultCode === 0) {
      dispatch(clearTasksAndTodolists());
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { isLoggedIn: false };
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
});

// const _initializeApp = createAppAsyncThunk<
//   {
//     isLoggedIn: boolean;
//   },
//   undefined
// >(`${slice.name}/initializeApp`, async (_, thunkAPI) => {
//   const { dispatch, rejectWithValue } = thunkAPI;
//   try {
//     const res = await authAPI.me();
//     if (res.data.resultCode === 0) {
//       return { isLoggedIn: true };
//     } else {
//       return rejectWithValue(null);
//     }
//   } catch (e) {
//     handleServerNetworkError(e, dispatch);
//     return rejectWithValue(null);
//   } finally {
//     dispatch(appActions.setAppInitialized({ isInitialized: true }));
//   }
// });

const initializeApp = createAppAsyncThunk<
  {
    isLoggedIn: boolean;
  },
  undefined
>(`${slice.name}/initializeApp`, async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  return thunkTryCatch(thunkAPI, async () => {
    const res = await authAPI.me();
    if (res.data.resultCode === 0) {
      return { isLoggedIn: true };
    } else {
      return rejectWithValue(null);
    }
  }).finally(() => {
    dispatch(appActions.setAppInitialized({ isInitialized: true }));
  });
});

export const authReducer = slice.reducer;
export const authActions = slice.actions;
export const authThunk = { login, logout, initializeApp };
