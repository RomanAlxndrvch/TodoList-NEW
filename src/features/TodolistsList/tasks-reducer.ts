import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {AppRootStateType, AppThunk} from '../../app/store'
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils'
import {appAction} from "app/app-reducer";
import {
    AddTodolistActionType,
    RemoveTodolistActionType,
    SetTodolistsActionType, todoListsAction
} from "features/TodolistsList/todolists-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: TasksStateType = {}


const slice = createSlice({
    name: 'tasks',
    initialState: {} as TasksStateType,
    reducers: {
        removeTask: (state, action: PayloadAction<{ taskId: string, todolistId: string }>) => {
            const index = state[action.payload.todolistId].findIndex(el => el.id === action.payload.taskId)
            console.log(index)
            if (index !== -1) state[action.payload.todolistId].splice(index, 1)
        },
        addTask: (state, action: PayloadAction<{ task: TaskType }>) => {
            state[action.payload.task.todoListId].unshift(action.payload.task)
        },
        updateTask: (state, action: PayloadAction<{
            taskId: string,
            model: UpdateDomainTaskModelType,
            todolistId: string
        }>) => {
            const index = state[action.payload.todolistId].findIndex(el => el.id === action.payload.taskId)

            state[action.payload.todolistId][index] = {...state[action.payload.todolistId][index], ...action.payload.model}
        },
        setTasks: (state, action: PayloadAction<{ tasks: TaskType[], todolistId: string }>) => {
            state[action.payload.todolistId] = action.payload.tasks
        }
    },
    extraReducers: (builder) => {
        builder.addCase(todoListsAction.addTodoList, (state, action) => {
            state[action.payload.todoList.id] = []
        })
            .addCase(todoListsAction.removeTodoList, (state, action) => {
                delete state[action.payload.id]
            })
            .addCase(todoListsAction.setTodoLists, (state, action) => {
                action.payload.todoLists.forEach(el => {
                    state[el.id] = []
                })
            })
    },


})

export const taskAction = slice.actions
export const tasksReducer = slice.reducer


// thunks
export const fetchTasksTC = (todolistId: string): AppThunk => (dispatch) => {
    dispatch(appAction.setAppStatus({status: "loading"}))
    todolistsAPI.getTasks(todolistId)
        .then((res) => {
            const tasks = res.data.items
            dispatch(taskAction.setTasks({tasks, todolistId}))
            dispatch(appAction.setAppStatus({status: "succeeded"}))
        })
}
export const removeTaskTC = (taskId: string, todolistId: string): AppThunk => (dispatch) => {
    todolistsAPI.deleteTask(todolistId, taskId)
        .then(res => {
            const action = taskAction.removeTask({taskId, todolistId})
            dispatch(action)
        })
}
export const addTaskTC = (title: string, todolistId: string): AppThunk => (dispatch) => {
    dispatch(appAction.setAppStatus({status: "loading"}))
    todolistsAPI.createTask(todolistId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                const task = res.data.data.item
                const action = taskAction.addTask({task})
                dispatch(action)
                dispatch(appAction.setAppStatus({status: "succeeded"}))
            }
            else {
                handleServerAppError(res.data, dispatch);
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string): AppThunk =>
    (dispatch, getState: () => AppRootStateType) => {
        const state = getState()
        const task = state.tasks[todolistId].find(t => t.id === taskId)
        if (!task) {
            //throw new Error("task not found in the state");
            console.warn('task not found in the state')
            return
        }

        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...domainModel
        }

        todolistsAPI.updateTask(todolistId, taskId, apiModel)
            .then(res => {
                if (res.data.resultCode === 0) {
                    const action = taskAction.updateTask({taskId, todolistId, model: apiModel})
                    dispatch(action)
                }
                else {
                    handleServerAppError(res.data, dispatch);
                }
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch);
            })
    }

// types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type TasksStateType = {
    [key: string]: Array<TaskType>
}
type ActionsType =
/*   | ReturnType<typeof removeTaskAC>
   | ReturnType<typeof addTaskAC>
   | ReturnType<typeof updateTaskAC>*/
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    // | ReturnType<typeof setTasksAC>
    | any
type ThunkDispatch = Dispatch<ActionsType>
