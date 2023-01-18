import React, {useEffect, useState} from 'react'
import axios from "axios";

export default {
    title: 'API'
}

const setting = {
    withCredentials: true,
    headers: {
        'API-KEY': '8fc044d8-3f5e-469a-b681-136f15cb55d0'
    }
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        axios.get('https://social-network.samuraijs.com/api/1.1/todo-lists', setting).then(res => setState(res.data))
    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        axios.post('https://social-network.samuraijs.com/api/1.1/todo-lists', {title: '20:36'}, setting).then(res => {
            setState(res.data.data.item)
        })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        axios.delete('https://social-network.samuraijs.com/api/1.1/todo-lists/90346e6d-19f9-4e09-9844-02208c357c63', setting).then(res => setState(res.data))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        axios.put('https://social-network.samuraijs.com/api/1.1/todo-lists/4bd5a2f4-f9b3-456e-8149-502800a86bc8', {title: '21:10'}, setting).then(res => setState(res.data))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
