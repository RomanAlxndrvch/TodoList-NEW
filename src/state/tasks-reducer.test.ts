import {tasksReducer} from "./tasks-reducer";
import {setTodoListsAC, TodolistDomainType} from "./todolists-reducer";


test('todoLists should set in to state', () => {

    const initialState: Array<TodolistDomainType> = [
        {id: '1', title: 'What to learn', filter: 'all', addedDate: '', order: 0},
        {id: '2', title: 'What to buy', filter: 'all', addedDate: '', order: 0}
    ]

    const endState = tasksReducer({}, setTodoListsAC(initialState))

    expect(endState['1']).toBe([])
    expect(endState['2']).toBe([])
})