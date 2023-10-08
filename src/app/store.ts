import {tasksReducer} from 'features/TodolistsList/tasks-reducer';
import {todoListReducer} from 'features/TodolistsList/todolists-reducer';
import {
    AnyAction,
    applyMiddleware,
    combineReducers,
    createStore,
} from 'redux';
import thunkMiddleware, {ThunkAction, ThunkDispatch} from 'redux-thunk';
import {appReducer} from './app-reducer';
import {authReducer} from 'features/Login/auth-reducer';
import {configureStore} from '@reduxjs/toolkit';

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todoListReducer,
    app: appReducer,
    auth: authReducer,
});

export const store = configureStore({reducer: rootReducer});
export type AppRootStateType = ReturnType<typeof store.getState>;

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    AppRootStateType,
    unknown,
    AnyAction
>;

export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AnyAction>;

// @ts-ignore
window.store = store;
