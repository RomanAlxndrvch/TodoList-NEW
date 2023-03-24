import {Dispatch} from "redux";
import {SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from "../../app/app-reducer";
import {authApi, loginParamsType} from "../../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";

type loginActionType = any
type ThunkDispatch = Dispatch<loginActionType | SetAppStatusActionType | SetAppErrorActionType>

const initialState = null

// Have to fix all any types
export const loginReducer = (state: any = initialState, action: loginActionType): any => {
    switch (action.type) {
        default: {
            return state
        }
    }
}

export const loginTC = (data: loginParamsType) => (dispatch: ThunkDispatch) => {
    dispatch(setAppStatusAC("loading"))
    authApi.login(data).then(res => {
        if (res.data.resultCode === 0) {
            dispatch(setAppStatusAC("succeeded"))
            console.log(res.data.messages)
        }
        else {
            handleServerAppError(res.data, dispatch);
        }
    })
        .catch((error) => {
            handleServerNetworkError(error, dispatch);
        })

}