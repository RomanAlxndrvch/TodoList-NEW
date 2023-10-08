import {addTodolistAC, TodolistDomainType, todoListReducer, todoListsAction} from './todolists-reducer'
import {tasksReducer, TasksStateType} from './tasks-reducer'
import {TodolistType} from 'api/todolists-api'

test('ids should be equals', () => {
    const startTasksState: TasksStateType = {};
    const startTodolistsState: Array<TodolistDomainType> = [];

    let todoList: TodolistType = {
        title: 'new todolist',
        id: 'any id',
        addedDate: '',
        order: 0
    }

    const action = todoListsAction.addTodoList({todoList});

    const endTasksState = tasksReducer(startTasksState, action);
    const endTodolistsState = todoListReducer(startTodolistsState, todoListsAction.addTodoList({todoList}))

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;

    expect(idFromTasks).toBe(action.payload.todoList.id);
    expect(idFromTodolists).toBe(action.payload.todoList.id);
});
