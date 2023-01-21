import {TasksActionsType, tasksReducer} from './tasks-reducer';
import {TodoListsActionsType, todolistsReducer} from './todolists-reducer';
import {AnyAction, applyMiddleware, combineReducers, createStore, legacy_createStore} from 'redux';
import thunk, {ThunkAction, ThunkDispatch} from "redux-thunk";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));


export type AppRootStateType = ReturnType<typeof rootReducer>
export type RootState = ReturnType<typeof store.getState>

type AppActionType = TasksActionsType | TodoListsActionsType
export type AppDispatch = ThunkDispatch<RootState, unknown, AppActionType>


// @ts-ignore
window.store = store;
