import {TasksStateType} from '../App';
import {addTodolistAC, RemoveTodolistActionType, setTodoListsAC} from './todolists-reducer';
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from '../api/todolists-api'
import {AppDispatch, AppRootStateType} from "./store";

export type RemoveTaskActionType = {
    type: 'REMOVE-TASK',
    todolistId: string
    taskId: string
}

export type AddTaskActionType = {
    type: 'ADD-TASK',
    task: TaskType
}

export type ChangeTaskStatusActionType = {
    type: 'CHANGE-TASK-STATUS',
    todolistId: string
    taskId: string
    status: TaskStatuses
}

export type ChangeTaskTitleActionType = {
    type: 'CHANGE-TASK-TITLE',
    todolistId: string
    taskId: string
    title: string
}

export type TasksActionsType = RemoveTaskActionType | AddTaskActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | ReturnType<typeof addTodolistAC>
    | RemoveTodolistActionType
    | ReturnType<typeof setTodoListsAC>
    | ReturnType<typeof setTasksAC>
    | ReturnType<typeof updateTaskAC>

const initialState: TasksStateType = {
    /*"todolistId1": [
        { id: "1", title: "CSS", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "2", title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "3", title: "React", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    ],
    "todolistId2": [
        { id: "1", title: "bread", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "2", title: "milk", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "3", title: "tea", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    ]*/

}

export const tasksReducer = (state: TasksStateType = initialState, action: TasksActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            return {...state, [action.todolistId]: state[action.todolistId].filter(el => el.id !== action.taskId)}
        }
        case 'ADD-TASK': {
            return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
        }
        case 'CHANGE-TASK-STATUS': {
            let todolistTasks = state[action.todolistId];
            let newTasksArray = todolistTasks
                .map(t => t.id === action.taskId ? {...t, status: action.status} : t);

            state[action.todolistId] = newTasksArray;
            return ({...state});
        }
        case 'CHANGE-TASK-TITLE': {
            let todolistTasks = state[action.todolistId];
            let newTasksArray = todolistTasks
                .map(t => t.id === action.taskId ? {...t, title: action.title} : t);

            state[action.todolistId] = newTasksArray;
            return ({...state});
        }
        case 'ADD-TODOLIST': {
            return {
                ...state,
                [action.todoList.id]: []
            }
        }
        case 'REMOVE-TODOLIST': {
            const copyState = {...state};
            delete copyState[action.id];
            return copyState;
        }
        case 'SET-TODOLISTS': {
            const stateCopy = {...state}
            action.todoLists.forEach((tl) => {
                stateCopy[tl.id] = []
            })
            return stateCopy;
        }
        case "SET-TASKS": {
            return {...state, [action.todoListID]: [...action.tasks]}
        }
        case "UPDATE-TASK": {
            return {
                ...state,
                [action.todoListID]: state[action.todoListID].map(el => el.id === action.taskId ? {...action.task} : el)
            }
        }

        default:
            return state;
    }
}

export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskActionType => {
    return {type: 'REMOVE-TASK', taskId: taskId, todolistId: todolistId}
}
export const addTaskAC = (task: TaskType): AddTaskActionType => {
    return {type: 'ADD-TASK', task}
}
export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string): ChangeTaskStatusActionType => {
    return {type: 'CHANGE-TASK-STATUS', status, todolistId, taskId}
}
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string): ChangeTaskTitleActionType => {
    return {type: 'CHANGE-TASK-TITLE', title, todolistId, taskId}
}

export const setTasksAC = (tasks: Array<TaskType>, todoListID: string) => {
    return {
        type: 'SET-TASKS',
        todoListID,
        tasks
    } as const
}

export const updateTaskAC = (taskId: string, todoListID: string, task: TaskType) => {
    return {
        type: "UPDATE-TASK",
        task,
        todoListID,
        taskId
    } as const
}

export const setTasksTC = (todoListId: string) => (dispatch: AppDispatch) => {
    todolistsAPI.getTasks(todoListId).then(res => {
        dispatch(setTasksAC(res.data.items, todoListId))
    })
}

export const removeTaskTC = (todoListId: string, taskId: string) => (dispatch: AppDispatch) => {
    todolistsAPI.deleteTask(todoListId, taskId).then(res => {
        if (res.data.resultCode === 0) dispatch(removeTaskAC(taskId, todoListId))
    })
}

export const addTaskTC = (todoListId: string, title: string) => (dispatch: AppDispatch) => {
    todolistsAPI.createTask(todoListId, title).then(res => {
        dispatch(addTaskAC(res.data.data.item))
    })
}

export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

export const updateTaskTC = (id: string, model: UpdateDomainTaskModelType, todolistId: string) => (dispatch: AppDispatch, getState: () => AppRootStateType) => {
    const taskFromState = getState().tasks[todolistId].find(el => el.id === id)
    if (taskFromState) {
        const updatedTask: UpdateTaskModelType = {
            status: taskFromState.status,
            deadline: taskFromState.deadline,
            title: taskFromState.title,
            description: taskFromState.description,
            priority: taskFromState.priority,
            startDate: taskFromState.startDate,
            ...model
        }
        todolistsAPI.updateTask(todolistId, id, updatedTask).then(res => {
            dispatch(updateTaskAC(id, todolistId, res.data.data.item))
        })
    }
}

