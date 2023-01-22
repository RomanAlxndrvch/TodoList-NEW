import {removeTaskAC, tasksReducer} from "./tasks-reducer";
import {setTodoListsAC, TodolistDomainType} from "./todolists-reducer";
import {TasksStateType} from "../App";
import {TaskPriorities, TaskStatuses} from "../api/todolists-api";


test('todoLists should set in to state', () => {

    const initialState: Array<TodolistDomainType> = [
        {id: '1', title: 'What to learn', filter: 'all', addedDate: '', order: 0},
        {id: '2', title: 'What to buy', filter: 'all', addedDate: '', order: 0}
    ]

    const endState = tasksReducer({}, setTodoListsAC(initialState))

    expect(endState['1']).toBe([])
    expect(endState['2']).toBe([])
})

test('right task should be deleted', () => {
    const initialState: TasksStateType = {
        "todolistId1": [
            {
                id: "1", title: "CSS", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
            },
            {
                id: "2", title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
            },
            {
                id: "3", title: "React", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
            }
        ],
        /* "todolistId2": [
             {
                 id: "1", title: "bread", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
                 startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
             },
             {
                 id: "2", title: "milk", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '',
                 startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
             },
             {
                 id: "3", title: "tea", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
                 startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
             }
         ]*/
    }

    const endState = tasksReducer(initialState, removeTaskAC('1', "todolistId1"))

    expect(endState["todolistId1"].length).toBe(2)
})