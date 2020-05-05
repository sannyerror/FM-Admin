import { ADD_USERS_REQUEST } from './AddUsersTypes'
import { ADD_USERS_SUCCESS } from './AddUsersTypes'
import { ADD_USERS_FAILURE } from './AddUsersTypes'
import { ADD_USERS_UPDATE } from './AddUsersTypes'

export function addUsersRequest(){
    return {
        type : ADD_USERS_REQUEST
    }
}
export function addUsersSuccess(addedusers){
    return {
      type: ADD_USERS_SUCCESS,
      addedusers
    }
}
export function addUsersFailure(error){
    return {
        type: ADD_USERS_FAILURE,
        error
    }
}
export function update(addedusers){
    return {
        type: ADD_USERS_UPDATE,
        addedusers
    }
}



export default  { addUsersRequest ,addUsersSuccess, addUsersFailure}