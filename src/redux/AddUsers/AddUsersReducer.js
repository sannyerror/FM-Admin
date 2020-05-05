import { ADD_USERS_REQUEST } from './AddUsersTypes'
import { ADD_USERS_SUCCESS } from './AddUsersTypes'
import { ADD_USERS_FAILURE } from './AddUsersTypes'
import { ADD_USERS_UPDATE }  from './AddUsersTypes'
const initialstate = {
    loading : true , 
    addedusers : [],
    error : '',
    
}
export function AddUsersReducer(state=initialstate ,action) {
    switch(action.type){
        
        case ADD_USERS_REQUEST :  return {
            ...state,
            loading : true
        }
        case ADD_USERS_SUCCESS :  return {
            loading : false,
            ...state,
            addedusers : action.addedusers,
            error : ''
        }
        case ADD_USERS_FAILURE :  return {
            loading : false,
            ...state,
            addedusers : [],
            error : action.payload 
        }
        case ADD_USERS_UPDATE : return {
            loading : false,
            ...state,
            addedusers : action.addedusers,
            error : ''
        }
        
           default : return state
    }
}


export default { AddUsersReducer  }