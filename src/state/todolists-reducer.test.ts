import {setTodoListsAC, TodolistDomainType, todolistsReducer} from "./todolists-reducer";

test('todoLists should set in to state', () => {

    const initialState: Array<TodolistDomainType> = [
        {id: '1', title: 'What to learn', filter: 'all', addedDate: '', order: 0},
        {id: '2', title: 'What to buy', filter: 'all', addedDate: '', order: 0}
    ]

    const endState = todolistsReducer([], setTodoListsAC(initialState))

    expect(endState[0].filter).toStrictEqual('active')
    expect(endState[1].filter).toStrictEqual('active')
})