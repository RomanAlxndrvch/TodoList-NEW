import {authAPI} from 'api/todolists-api'
import {authActions} from "features/Login/auth-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppThunk} from "app/store";

const slice = createSlice({
    name: 'app',
    initialState: {
        status: 'idle' as RequestStatusType,
        error: null as string | null,
        isInitialized: false
    },
    reducers: {
        setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
            state.status = action.payload.status
        },
        setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
            state.error = action.payload.error
        },
        setIsInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
            state.isInitialized = action.payload.isInitialized
        }
    }
})

export const appReducer = slice.reducer
export const appAction = slice.actions
export type AppInitialState = ReturnType<typeof slice.getInitialState>

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'


export const initializeAppTC = (): AppThunk => (dispatch) => {
    authAPI.me().then(res => {
        if (res.data.resultCode === 0) {
            dispatch(authActions.setIsLoggedIn({isLoggedIn: true}));
        }
        else {

        }

        dispatch(appAction.setIsInitialized({isInitialized: true}));
    })
}
