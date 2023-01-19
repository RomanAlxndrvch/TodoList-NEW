import axios from "axios";

const setting = {
    withCredentials: true,
    headers: {
        'API-KEY': '8fc044d8-3f5e-469a-b681-136f15cb55d0'
    }
}

export const todoListsApi = {
    getTodoList() {
        return axios.get('https://social-network.samuraijs.com/api/1.1/todo-lists', setting)
    },

    /*    createTodoList(title: string) {
            return axios.post('https://social-network.samuraijs.com/api/1.1/todo-lists', {title}, setting)
        }*/
}