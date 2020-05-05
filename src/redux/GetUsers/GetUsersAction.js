import { GET_USERS_REQUEST } from './GetUsersTypes'
import { GET_USERS_SUCCESS } from './GetUsersTypes'
import { GET_USERS_FAILURE } from './GetUsersTypes'
import { GET_USERS_UPDATE } from './GetUsersTypes'

export function getUsersRequest(){
    return {
        type : GET_USERS_REQUEST
    }
}
export function getUsersSuccess(usersList){
    return {
      type: GET_USERS_SUCCESS,
      usersList
    }
}
export function getUsersFailure(error){
    return {
        type: GET_USERS_FAILURE,
        error
    }
}
export function update(usersList){
    return {
        type: GET_USERS_UPDATE,
        usersList
    }
}



export default  { getUsersRequest ,getUsersSuccess, getUsersFailure}