import { GET_USERS_REQUEST } from './GetUsersTypes'
import { GET_USERS_SUCCESS } from './GetUsersTypes'
import { GET_USERS_FAILURE } from './GetUsersTypes'
import { GET_USERS_UPDATE }  from './GetUsersTypes'

const initialstate = {
    loading : true , 
    usersList : [],
    error : '',
    
}
export function GetUsersReducer(state=initialstate ,action) {
    switch(action.type){
        
        case GET_USERS_REQUEST :  return {
            ...state,
            loading : true
        }
        case GET_USERS_SUCCESS :  return {
            loading : false,
            ...state,
            usersList : action.usersList,
            error : ''
        }
        case GET_USERS_FAILURE :  return {
            loading : false,
            ...state,
            usersList : [],
            error : action.payload 
        }
        case GET_USERS_UPDATE : return {
            loading : false,
            ...state,
            usersList : action.usersList,
            error : ''
        }
        
           default : return state
    }
}
export default { GetUsersReducer  }